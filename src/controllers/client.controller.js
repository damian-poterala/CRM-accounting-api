import * as clientService from '../services/client.service.js';

export async function getClients(req, res) {
    try {
        const id = req.user.id;
        const clients = await clientService.getClients(id);
        
        return res.status(200).json(clients);
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania klientów.' });
    }
}

export async function getClientsPerUser(req, res) {
    try {
        const id = req.user.id;
        const clients = await clientService.getClientsPerUser(id);
        
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
        const userId = req.user.id;
        const result = await clientService.search(req.body, userId);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Wystąpił błąd podczas wyszukiwania danych.' });
    }
}

export async function update(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;

        const result = await clientService.update(id, data);

        return res.status(result.status).json({ status: 200, message: 'Udało się zaktualizować dane klienta' });
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Wystąpił błąd podczas aktualizacji danych.' });
    }
}

export async function create(req, res) {
    try {
        const data = req.body;

        const result = await clientService.create(data);

        return res.status(result.status).json({ status: 200, message: 'Udało się utworzyć nowego klienta' });
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Wystąpił błąd podczas tworzenia klienta' });
    }
}

export async function updateDetails(req, res) {
    try {
        const clientId = Number(req.params.id);
        const data = req.body;

        if(!clientId) {
            return res.status(400).json({ message: 'Nieprawidłowe ID klienta' });
        }

        const result = await clientService.updateDetails(clientId, data);

        return res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Wystąpił błąd podczas zapisywania szczegółów klienta" });
    }
}

export async function getFormData(req, res, next) {
    try {
        const result = await clientService.getFormData(req.params.id);
        return res.status(result.status).json(result.data);
    } catch (error) {
        next(error);
    }
}

export async function getDetails(req, res) {
    const result = await clientService.getDetails(req.params.id);

    return res.status(result.status).json(result.data);
}