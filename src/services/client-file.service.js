import * as clientFilesRepository from '../repositories/client-file.repository.js';

import path from 'path';

export async function getFiles(clientId) {
    return await clientFilesRepository.getFiles(clientId);
}

export async function create(clientId, file, userId) {
    if(!file) {
        return { status: 400, message: 'Nie wybrano pliku' };
    }    

    const extension = path.extname(file.originalname).toLowerCase().replace('.', '');

    const result = await clientFilesRepository.create(
        clientId,
        {
            originalName: file.originalname,
            mimeType: file.mimetype,
            extension: extension,
            fileSize: file.size,
            fileData: file.buffer
        },
        userId
    );

    return { status: 201, message: 'Udało się dodać plik.' };
}

export async function download(fileId, clientId) {
    const file = await clientFilesRepository.findById(fileId, clientId);

    if(!file) {
        return { status: 404, data: { message: 'Nie udało się znaleźć wybranego pliku.' } };
    }

    return { status: 200, data: file };
}

export async function remove(fileId, clientId) {
    const file = await clientFilesRepository.findById(fileId, clientId);

    if(!file) {
        return { status: 404, data: { message: 'Nie udało się znaleźć wybranego pliku' } };
    }

    await clientFilesRepository.remove(fileId, clientId);

    return { status: 201, message: 'Udało się usunąć plik.' };
}

