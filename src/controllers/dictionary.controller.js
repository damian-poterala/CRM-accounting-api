import * as dictionaryService from '../services/dictionary.service.js';

export async function getAll(req, res) {
    try {
        const dictionaries = await dictionaryService.getAll();

        return res.status(200).json(dictionaries);
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania słownika.' });
    }
}