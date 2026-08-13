import * as declarationService from '../services/declaration.service.js';

export async function getDeclarations(req, res) {
    try {
        const year = Number(req.query.year);
        const type = req.query.type;

        if(!year || !type) {
            return res.status(400).json({ message: 'Parametry rok i typ deklaracji są wymagane' });
        }

        const declarations = await declarationService.getDeclarations(year, type);
        
        return res.status(200).json(declarations);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania listy deklaracji' });
    }
}

export async function saveDeclarations(req, res) {
    try {
        const { year, type, rows } = req.body;

        if(!year || !type || !Array.isArray(rows)) {
            return res.status(400).json({ message: "Nieprawidłowe dane do zapisu deklaracji" });
        }

        await declarationService.saveDeclarations({ year, type, rows });

        return res.status(200).json({ message: "Deklaracje zostały zapisane." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Wystąpił błąd podczas zapisywania deklaracji." });
    }
}