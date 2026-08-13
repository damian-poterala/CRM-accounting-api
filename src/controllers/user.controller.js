import * as userService from '../services/user.service.js';

export async function getUsers(req, res) {
    try {
        const users = await userService.getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania użytkowników' });
    }
}