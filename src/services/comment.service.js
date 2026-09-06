import pool from '../config/db.js';

import * as clientCommentsRepository from '../repositories/client-comment.repository.js';

export async function create(clientId, data) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        if(data.comment) {
            await clientCommentsRepository.create(clientId, data.comment, connection);
        }

        await connection.commit();

        return { status: 200, data: { message: 'Komentarz został dodany.' } }
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}