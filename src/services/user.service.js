import * as userRepository from '../repositories/user.repository.js';

export async function getUsers() {
    return await userRepository.getUsers();
}