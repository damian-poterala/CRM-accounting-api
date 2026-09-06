import * as commentService from '../services/comment.service.js';

export async function create(req, res) {
    try {
        const clientId = Number(req.params.id);
        const data = req.body;

        if(!clientId) {
            return res.status(400).json({ message: 'Nieprawidłowe ID klienta.' });
        }

        const result = await commentService.create(clientId, data);
        return res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas zapisywania komentarza.' });
    }
}