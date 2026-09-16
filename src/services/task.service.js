import * as taskRepository from '../repositories/task.repository.js';

export async function getAllTask() {
    return await taskRepository.getAllTask();
}

export async function getTaskPerUser(userId) {
    return await taskRepository.getTaskPerUser(userId);
}

export async function create(data) {
    const result = await taskRepository.create(data);

    return { status: 201, message: 'Udało się utworzyć nowe zadanie.' }
}