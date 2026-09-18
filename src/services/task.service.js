import * as taskRepository from '../repositories/task.repository.js';

export async function getAllTask() {
    return await taskRepository.getAllTask();
}

export async function getTaskPerUser(userId) {
    return await taskRepository.getTaskPerUser(userId);
}

export async function getTaskPerClient(userId, clientId) {
    return await taskRepository.getTaskPerClient(userId, clientId);
}

export async function create(data) {
    const result = await taskRepository.create(data);

    return { status: 201, message: 'Udało się utworzyć nowe zadanie.' }
}

export async function remove(id) {
    const task = await taskRepository.findById(id);

    if(!task) {
        return { status: 404, data: { message: 'Nie udało się znaleźć zadania o wybranym ID.' } };
    }

    const result = await taskRepository.remove(id);
    return { status: 201, message: 'Udało się usunąć zadanie.' };
}

export async function complete(id) {
    const task = await taskRepository.findById(id);

    if(!task) {
        return { status: 404, data: { message: 'Nie udało się znaleźć zadania o wybranym ID.' } };
    }

    const result = await taskRepository.complete(id);
    return { status: 201, message: 'Udało się zamknąć zadanie.' };
}