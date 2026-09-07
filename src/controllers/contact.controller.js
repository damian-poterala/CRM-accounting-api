import * as contactService from '../services/contact.service.js';

export async function getContacts(req, res) {
    try {
        const clientId = Number(req.params.id);

        if(!clientId) {
            return res.status(400).json({ message: 'Nieprawidłowe ID Klienta.' });
        }

        const contacts = await contactService.getContacts(clientId);
        return res.status(200).json(contacts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania listy kontaktów dla klienta.' });
    }
}

export async function create(req, res) {
    try {
        const data = req.body;
        const clientId = req.params.id;

        const result = await contactService.create(clientId, data);

        return res.status(result.status).json({ message: result.message });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas zapisywania kontaktu.' });
    }
}

export async function update(req, res) {

}

export async function remove(req, res) {
    try {
        const contactId = Number(req.params.id);

        if(!contactId) {
            return res.status(400).json({ message: 'Nieprawidłowe ID kontaktu.' });
        }

        const result = await contactService.remove(contactId);
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas usuwania kontaktu' });
    }
}