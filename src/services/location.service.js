import * as locationRepository from '../repositories/location.repository.js';

export async function getLocations(id) {
    return await locationRepository.getLocations(id);
}

export async function create(id, data) {
    const result = await locationRepository.create(id, data);

    return { status: 201, message: 'Udało się zapisać lokalizacji dla klienta.' };
}

export async function update(id, data) {
    const location = await locationRepository.findById(id);

    if(!location) {
        return { status: 404, data: { message: 'Nie udało się znaleźć lokalizacji o wybranym id.' } };
    }

    const result = await locationRepository.update(id, data);

    return { status: 201, message: 'Udało się zaktualizować dane lokalizacji.' };
}

export async function remove(id) {
    const location = await locationRepository.findById(id);

    if(!location) {
        return { status: 404, data: { message: 'Nie udało się znaleźć lokalizacji o wybranym id.' } };
    }

    const result = await locationRepository.remove(id);

    return { status: 201, message: 'Udało się usunąć lokalizację.' };
}