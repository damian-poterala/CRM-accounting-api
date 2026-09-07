import * as locationService from '../services/location.service.js';

export async function getLocations(req, res) {
    try {
        const clientId = Number(req.params.id);

        if(!clientId) {
            return res.status(400).json({ message: 'Nieprawidłowe ID klienta.' });
        }

        const locations = await locationService.getLocations(clientId);
        return res.status(200).json(locations);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania listy lokalizacji przypisanych do klienta.' });
    }
}

export async function create(req, res) {
    try {
        const data = req.body;
        const clientId = req.params.id;

        const result = await locationService.create(clientId, data);

        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas zapisywania lokalizacji klienta.' });
    }
}

export async function update(req, res) {

}

export async function remove(req, res) {
    try {
        const locationId = Number(req.params.id);

        if(!locationId) {
            return res.status(400).json({ message: 'Nieprawidłowe ID lokalizacji.' });
        }

        const result = await locationService.remove(locationId);
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas usuwania lokalizacji.' })
    }
}