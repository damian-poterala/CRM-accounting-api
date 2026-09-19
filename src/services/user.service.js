import * as userRepository from '../repositories/user.repository.js';

import pool from '../config/db.js';

export async function getUsers() {
    return await userRepository.getUsers();
}

export async function getDashboard(id) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const allClientsPerUser = await userRepository.getAllClientsPerUser(connection, id);
        const allTasksPerUser = await userRepository.getAllTasksPerUser(connection, id);
        const clientByCooperationStatusPerUser = await userRepository.getClientByCooperationStatusPerUser(connection, id);
        const clientByCompanyTypePerUser = await userRepository.getClientByCompanyTypePerUser(connection, id);
    
        await connection.commit();

        return {
            status: 200,
            data: {
                all_clients                  : allClientsPerUser,
                all_tasks                    : allTasksPerUser,
                client_by_cooperation_status : clientByCooperationStatusPerUser,
                client_by_company_type       : clientByCompanyTypePerUser
            }
        }
        
    } catch (error) {
        await connection.rollback();
    } finally {
        connection.release();
    }
}