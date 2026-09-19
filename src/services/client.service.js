import pool from '../config/db.js';

import * as clientRepository from '../repositories/client.repository.js';
import * as clientDetailsRepository from '../repositories/client-details.repository.js';
import * as clientCommentsRepository from '../repositories/client-comment.repository.js';
import * as clientAccountingServiceRepository from '../repositories/client-accounting-service.repository.js';
import * as clientZusRegistrationRepository from '../repositories/client-zus-registration.repository.js';
import * as clientZusRegistrationHistoryRepository from '../repositories/client-zus-registration-history.repository.js';
import * as clientVatStatus from '../repositories/client-vat-status.repository.js';

export async function getClients(id) {
    return await clientRepository.getClients(id);
}

export async function getClientsPerUser(id) {
    return await clientRepository.getClientsPerUser(id);
}

export async function autocomplete(field, query) {
    const allowedFields = {
        nip: 'nip',
        company_name: 'company_name',
        owner: 'owner'
    };

    if(!allowedFields[field]) {
        return [];
    }

    return await clientRepository.autocomplete(allowedFields[field], query);
}

export async function search(filters, id) {
    return await clientRepository.search(filters, id);
}

export async function update(id, data) {
    const client = await clientRepository.findById(id);

    if(!client) {
        return { status: 404, data: { message: 'Nie udało się znaleźć klienta o wybranym id.' } };
    }

    const result = await clientRepository.update(id, data);

    return { 
        status: 200, 
        data: result.affectedRows == 0 ? 'Nie wprowadzono żadnych zmian.' : 'Dane klienta zostały zaktualizowane.'
    };
}

export async function create(data) {
    const result = await clientRepository.create(data);

    return { status: 201, data: { message: 'Klient został utworzony.' } };
}

export async function updateDetails(clientId, data) {
    const client = await clientRepository.findById(clientId);

    if(!client) {
        return { status: 404, data: { message: 'Nie znaleziono klienta o podanym ID.' } };
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const details = await clientDetailsRepository.findByClientId(clientId, connection);

        if(details) {
            await clientDetailsRepository.update(clientId, data, connection);
        } else {
            await clientDetailsRepository.create(clientId, data, connection);
        }

        if(data.comment?.trim()) {
            await clientCommentsRepository.create(clientId, data.comment, connection);
        }

        await clientAccountingServiceRepository.deleteByClientId(connection, clientId);
        await clientAccountingServiceRepository.createMany(connection, clientId, data.services);
        await clientVatStatus.deleteByClientId(connection, clientId);
        await clientVatStatus.createMany(connection, clientId, data.vatStatuses);
        await syncZusRegistrations(connection, clientId, data.registrations)

        await connection.commit();

        return {
            status: 200,
            data: {
                message: details ? 'Dane klienta zostały zaktualizowane.' : 'Dane klienta zostały zapisane.'
            }
        }
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function syncZusRegistrations(connection, clientId, registrations) {
    const existingRegistrations =
        await clientZusRegistrationRepository.findByClientId(
            connection,
            clientId
        );

    const incomingIds = new Set();

    for (const registration of registrations ?? []) {

        const existing = existingRegistrations.find(
            item =>
                item.registrationTypeId === registration.registrationTypeId
        );

        if (!existing) {
            const result = await clientZusRegistrationRepository.create(
                connection,
                clientId,
                registration
            );

            await clientZusRegistrationHistoryRepository.create(
                connection,
                {
                    id: result.insertId,
                    clientId,
                    registrationTypeId: registration.registrationTypeId,
                    dateFrom: registration.dateFrom,
                    dateTo: registration.dateTo,
                    socialContribution: registration.socialContribution,
                    healthContribution: registration.healthContribution
                },
                'INSERT'
            );

            continue;
        }

        incomingIds.add(existing.id);

        const hasChanged =
            existing.registrationTypeId !== registration.registrationTypeId ||
            existing.dateFrom !== registration.dateFrom ||
            existing.dateTo !== (registration.dateTo ?? null) ||
            Boolean(existing.socialContribution) !== registration.socialContribution ||
            Boolean(existing.healthContribution) !== registration.healthContribution;

        if (!hasChanged) {
            continue;
        }

        // ZAPISUJEMY STARY STAN DO HISTORII
        await clientZusRegistrationHistoryRepository.create(
            connection,
            {
                id: existing.id,
                clientId: existing.client_id,
                registrationTypeId: existing.registrationTypeId,
                dateFrom: existing.dateFrom,
                dateTo: existing.dateTo,
                socialContribution: Boolean(existing.socialContribution),
                healthContribution: Boolean(existing.healthContribution)
            },
            'UPDATE'
        );

        // AKTUALIZUJEMY
        await clientZusRegistrationRepository.update(
            connection,
            existing.id,
            registration
        );
    }

    // USUNIĘCIE ODHACZONYCH
    for (const existing of existingRegistrations) {

        if (incomingIds.has(existing.id)) {
            continue;
        }

        await clientZusRegistrationHistoryRepository.create(
            connection,
            {
                id: existing.id,
                clientId: existing.clientId,
                registrationTypeId: existing.registrationTypeId,
                dateFrom: existing.dateFrom,
                dateTo: existing.dateTo,
                socialContribution: Boolean(existing.socialContribution),
                healthContribution: Boolean(existing.healthContribution)
            },
            'DELETE'
        );

        await clientZusRegistrationRepository.remove(
            connection,
            existing.id
        );
    }
}

export async function getFormData(clientId) {
    const client = await clientRepository.findById(clientId);

    if(!clientId) {
        return { 
            status: 404, 
            data: { 
                messaeg: 'Nie znaleziono klienta o podanym ID.' 
            } 
        };
    }

    const connection = await pool.getConnection();

    try {
        const details = await clientDetailsRepository.findByClientId(clientId, connection);
        const comment = await clientCommentsRepository.findLatestByClientId(connection, clientId);
        const accountingServices = await clientAccountingServiceRepository.findByClientId(connection, clientId);
        const vatStatuses = await clientVatStatus.findByClientId(connection, clientId);
        const zusRegistrations = await clientZusRegistrationRepository.findByClientId(connection, clientId);

        const services = {
            kpir: {
                enabled: false,
                programId: null
            },
            kh: {
                enabled: false,
                programId: null
            },
            uepik: {
                enabled: false,
                programId: null
            },
            kadry: {
                enabled: false,
                programId: null
            }
        };

        const serviceMap = {
            28: 'kpir',
            29: 'kh',
            30: 'uepik',
            31: 'kadry'
        };

        for (const service of accountingServices) {
            const serviceName = serviceMap[service.serviceId];

            if (!serviceName) continue;

            services[serviceName] = {
                enabled: true,
                programId: service.programId ?? null
            };
        }

        const vat = {
            vatPayer: {
                enabled: false,
                dateFrom: null,
                dateTo: null
            },

            vatUe: {
                enabled: false,
                dateFrom: null,
                dateTo: null
            },

            vatExemptSubject: {
                enabled: false,
                dateFrom: null,
                dateTo: null
            },

            vatExemptEntity: {
                enabled: false,
                dateFrom: null,
                dateTo: null
            },

            vat9m: {
                enabled: false,
                dateFrom: null,
                dateTo: null
            }
        };

        const vatStatusMap = {
            38: 'vatPayer',
            9: 'vatUe',
            39: 'vatExemptSubject',
            40: 'vatExemptEntity',
            42: 'vat9m'
        };

        for (const status of vatStatuses) {
            const statusName = vatStatusMap[status.vatStatusId];

            if (!statusName) continue;

            vat[statusName] = {
                enabled: true,
                dateFrom: status.dateFrom,
                dateTo: status.dateTo
            };
        }

        const zus = {
            relief: {
                enabled: false,
                validFrom: '',
                validTo: '',
                socialContribution: false,
                healthContribution: false
            },

            preferential: {
                enabled: false,
                validFrom: '',
                validTo: '',
                socialContribution: false,
                healthContribution: false
            },

            full: {
                enabled: false,
                validFrom: '',
                validTo: '',
                socialContribution: false,
                healthContribution: false
            },

            smallPlus: {
                enabled: false,
                validFrom: '',
                validTo: '',
                socialContribution: false,
                healthContribution: false
            }
        };

        const zusRegistrationMap = {
            82: 'relief',
            83: 'preferential',
            84: 'full',
            85: 'smallPlus'
        };

        for (const registration of zusRegistrations) {
            const registrationName =
                zusRegistrationMap[registration.registrationTypeId];

            if (!registrationName) continue;

            zus[registrationName] = {
                enabled: true,
                validFrom: registration.dateFrom ?? '',
                validTo: registration.dateTo ?? '',
                socialContribution: Boolean(registration.socialContribution),
                healthContribution: Boolean(registration.healthContribution)
            };
        }

        return { 
            status: 200, 
            data: {
                ...details,
                notes:{
                    content: comment?.comment ?? ''
                },
                ...services,
                ...vat,
                ...zus,
            } 
        };
    } finally {
        connection.release();
    }
}

export async function getDetails(clientId) {
    const client = await clientRepository.findById(clientId);

    if(!client) {
        return { status: 404, data: { message: 'Nie znaleziono klienta o podanym ID.' } };
    }

    const connection = await pool.getConnection();

    try {
        const details  = await clientDetailsRepository.findDetailsByClientId(clientId, connection);
        const comment  = await clientCommentsRepository.findLatestDetailsByClientId(clientId, connection);
        const zus      = await clientZusRegistrationRepository.findDetailsByClientId(clientId, connection); 
        const services = await clientAccountingServiceRepository.findDetailsByClientId(clientId, connection);
        const vat      = await clientVatStatus.findDetailsByClientId(clientId, connection);

        return {
            status: 200,
            data: {
                ...details,
                notes: {
                    content: comment?.comment ?? ''
                },
                zus      : [...zus],
                services : [...services],
                vat      : [...vat]
            }
        }
    } finally {
        connection.release();
    }
}

function formatDate(date) {
    if (!date) {
        return null;
    }

    return date.toISOString().slice(0, 10);
}