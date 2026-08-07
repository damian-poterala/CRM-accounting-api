import * as clientService from '../services/client.service.js';

export async function getClients(req, res) {
    try {
        const clients = await clientService.getClients();
        
        return res.status(200).json(clients);
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania klientów.' });
    }
}

export async function autocomplete(req, res) {
    try {
        const { field, query } = req.query;

        const result = await clientService.autocomplete(field, query);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania danych.' });
    }
}

export async function search(req, res) {
    try {
        const result = await clientService.search(req.body);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Wystąpił błąd podczas wyszukiwania danych.' });
    }
}