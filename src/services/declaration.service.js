import * as declarationRepository from '../repositories/declaration.repository.js';

export async function getDeclarations(year, type) {
    return await declarationRepository.getDeclarations(year, type);
}

export async function saveDeclarations(payload) {
    return await declarationRepository.saveDeclarations(payload);
}