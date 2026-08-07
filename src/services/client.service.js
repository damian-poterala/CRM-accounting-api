import * as clientRepository from '../repositories/client.repository.js';

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