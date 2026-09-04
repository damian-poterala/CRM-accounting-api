import pool from '../config/db.js';

export async function create(connection, data, action) {
    const [result] = await connection.query(`
        INSERT INTO client_zus_registration_history (
            client_zus_registration_id,
            client_id,
            registration_type_id,
            date_from,
            date_to,
            social_contribution,
            health_contribution,
            action
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        data.id ?? null,
        data.clientId,
        data.registrationTypeId,
        data.dateFrom,
        data.dateTo ?? null,
        data.socialContribution,
        data.healthContribution,
        action
    ]);

    return result;
}