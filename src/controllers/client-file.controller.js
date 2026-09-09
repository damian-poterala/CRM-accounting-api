import * as clientFilesService from '../services/client-file.service.js';

export async function getFiles(req, res) {
    try {
        const clientId = Number(req.params.id);

        if(!clientId) {
            return res.status(400).json({ message: 'Nieprawidłowe ID klienta.' });
        }

        const files = await clientFilesService.getFiles(clientId);

        return res.status(200).json(files);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania listy plików dla klienta.' });
    }
}

export async function create(req, res) {
    try {
        const clientId = Number(req.params.id);

        if(!clientId) {
            return res.status(400).json({ message: 'Nieprawidlowe ID klienta.' });
        }

        const userId = req.user.id;

        const result = await clientFilesService.create(clientId, req.file, userId);

        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas zapisywania pliku.' });
    }
}

export async function download(req, res) {
    try {
        const clientId = Number(req.params.id);
        const fileId = Number(req.params.fileId);

        if(!clientId) {
            return res.status(400).json({ message: 'Nieprawidłowe ID klienta.' });
        }

        if(!fileId) {
            return res.status(400).json({ message: 'Nieprawidłowe ID pliku.' });
        }

        const result = await clientFilesService.download(fileId, clientId);

        if(result.status !== 200) {
            return res.status(result.status).json({ message: result.data });
        }

        const file = result.data;
        const safeFileName = file.original_name.replace(/[\r\n"]/g, '_');

        res.setHeader('Content-Type', file.mime_type);
        res.setHeader('Content-Length', file.file_size);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeFileName)}"`);

        return res.send(file.file_data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania pliku.' });
    }
}

export async function remove(req, res) {
    try {
        const clientId = Number(req.params.id);
        const fileId = Number(req.params.fileId);

        if(!clientId) {
            return res.status(400).json({ message: 'Nieprawidłowe ID klienta.' });
        }

        if(!fileId) {
            return res.status(400).json({ message: 'Nieprawidłowe ID pliku.' });
        }

        const result = await clientFilesService.remove(fileId, clientId);

        return res.status(result.status).json({ message: result.message || result.data?.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas usuwania pliku.' });
    }
}