import * as taskService from '../services/task.service.js';

export async function getAllTask(req, res) {
    try {
        const tasks = await taskService.getAllTask();
        return res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania listy zadań.' });
    }
}

export async function getTaskPerUser(req, res) {
    try {
        const userId = Number(req.params.id);

        if(!userId) {
            return res.status(400).json({ message: 'Nieprawidłowe ID użytkownika.' });
        }

        const tasks = await taskService.getTaskPerUser(userId);
        return res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania listy zadań przypisanych do użytkownika.' });
    }
}

export async function getTaskPerClient(req, res) {
    try {
        const userId = Number(req.user.id);
        const clientId = Number(req.params.clientId);

        console.log(userId);
        console.log(clientId);

        const tasks = await taskService.getTaskPerClient(userId, clientId);
        return res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania listy zadań przypisanych do klienta.' });
    }
}

export async function create(req, res) {
    try {
        const data = req.body;

        const result = await taskService.create(data);

        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas zapisywania zadania.' });
    }
}

export async function remove(req, res) {
    try {
        const taskId = Number(req.params.id);

        if(!taskId) {
            return res.status(400).json({ message: 'Nieprawidłowe ID zadania.' });
        }

        const result = await taskService.remove(taskId);
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas usuwania zadania.' });
    }
}

export async function complete(req, res) {
    try {
        const taskId = Number(req.params.id);

        if(!taskId) {
            return res.status(400).json({ message: 'Nieprawidłowe ID zadania.' });
        }

        const result = await taskService.complete(taskId);
        return res.status(result.status).json({ message: result.message }); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas zamykania zadania.' });
    }
}