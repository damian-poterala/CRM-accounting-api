import * as contactRepository from '../repositories/contact.repository.js';

export async function getContacts(id) {
    return await contactRepository.getContacts(id);
}

export async function create(id, data) {
    const result = await contactRepository.create(id, data);

    return { status: 201, message: 'Udało się utworzyć nowy kontakt.' }
}

export async function remove(id) {
    const contact = await contactRepository.findById(id);

    if(!contact) {
        return { status: 404, data: { message: 'Nie udało się znaleźć kontaktu o wybranym id.' } };
    }

    const result = await contactRepository.remove(id);

    return { status: 201, message: "Udało się usunąć kontakt." };
}