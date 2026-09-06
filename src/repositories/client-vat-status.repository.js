import pool from '../config/db.js';

export async function deleteByClientId(connection, clientId) {
    await connection.query(`
        DELETE FROM client_vat_statuses
        WHERE client_id = ?
    `, [ clientId ]);
}

export async function createMany(connection, clientId, vatStatuses) {
    if(!vatStatuses || vatStatuses.length === 0) {
        return;
    }

    const values = vatStatuses.map(status => [
        clientId,
        status.vatStatusId,
        status.dateFrom,
        status.dateTo
    ]);

    await connection.query(`
        INSERT INTO client_vat_statuses (
            client_id,
            vat_status_id,
            date_from,
            date_to
        )
        VALUES ?
    `, [ values ]);
}

export async function findByClientId(connection, clientId) {
    const [rows] = await connection.query(`
        SELECT
            id,
            client_id,
            vat_status_id AS vatStatusId,
            DATE_FORMAT(date_from, '%Y-%m-%d') AS dateFrom,
            DATE_FORMAT(date_to, '%Y-%m-%d') AS dateTo
        FROM client_vat_statuses
        WHERE client_id = ?
        ORDER BY id
    `, [ clientId ]);

    return rows;
}

export async function findDetailsByClientId(clientId, connection) {
    const [rows] = await connection.query(`
        SELECT
            cvs.id,
            cvs.vat_status_id,
            (SELECT display_name FROM dictionaries AS d WHERE d.id = cvs.vat_status_id) AS vat_status,
            DATE_FORMAT(cvs.date_from, '%Y-%m-%d') AS date_from,
            DATE_FORMAT(cvs.date_to, '%Y-%m-%d') AS date_to
        FROM client_vat_statuses AS cvs
        WHERE client_id = ?
    `, [clientId]);

    return rows;
}