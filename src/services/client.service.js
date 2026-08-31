import * as clientRepository from '../repositories/client.repository.js';
import * as clientDetailsRepository from '../repositories/client-details.repository.js';

export async function getClients() {
    return await clientRepository.getClients();
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

export async function search(filters) {
    return await clientRepository.search(filters);
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
    return await clientRepository.create(data);
}

export async function updateDetails(clientId, data) {
    const client = await clientRepository.findById(clientId);

    if(!client) {
        return { status: 404, data: { message: 'Nie znaleziono klienta o podanym ID.' } };
    }

    const details = await clientDetailsRepository.findByClientId(clientId);

    let result;

    if(details) {
        result = await clientDetailsRepository.update(clientId, data);
    } else {
        result = await clientDetailsRepository.create(clientId, data);
    }

    return {
        status: 200,
        data: {
            message: details ? 'Szczegóły klineta zostały zaktualizowane.' : 'Szczegóły klienta zostały zapisane.'
        }
    }
}