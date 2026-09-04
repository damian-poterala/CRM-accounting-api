export async function create(connection, clientId, data) {
    const [result] = await connection.query(`
        INSERT INTO client_zus_registrations (
            client_id,
            registration_type_id,
            date_from,
            date_to,
            social_contribution,
            health_contribution
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `, [
        clientId,
        data.registrationTypeId,
        data.dateFrom,
        data.dateTo,
        data.socialContribution,
        data.healthContribution
    ]);

    return result;
}

export async function update(connection, id, data) {
    const [result] = await connection.query(`
        UPDATE client_zus_registrations
        SET registration_type_id = ?,
            date_from = ?,
            date_to = ?,
            social_contribution = ?,
            health_contribution = ?
        WHERE id = ?
    `, [ data.registrationTypeId, data.dateFrom, data.dateTo ?? null, data.socialContribution, data.healthContribution, id ]);

    return result;
}

export async function remove(connection, id) {
    const [result] = await connection.query(`
        DELETE FROM client_zus_registrations
        WHERE id = ?
    `, [id]);

    return result;
}

export async function findByClientId(connection, clientId) {
    const [rows] = await connection.query(`
        SELECT
            id,
            client_id,
            registration_type_id AS registrationTypeId,
            DATE_FORMAT(date_from, '%Y-%m-%d') AS dateFrom,
            DATE_FORMAT(date_to, '%Y-%m-%d') AS dateTo,
            social_contribution AS socialContribution,
            health_contribution AS healthContribution
        FROM client_zus_registrations
        WHERE client_id = ?
        ORDER BY id
    `, [ clientId ]);

    return rows;
}