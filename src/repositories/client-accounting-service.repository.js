import pool from '../config/db.js';

export async function deleteByClientId(connection, clientId) {
    await connection.query(`
        DELETE FROM client_accounting_services
        WHERE client_id = ?
    `, [ clientId ]);
}

export async function createMany(connection, clientId, services) {
    if(!services || services.length === 0) {
        return;
    }

    const values = services.map(service => [
        clientId,
        service.serviceId,
        service.programId ?? null
    ]);

    await connection.query(`
        INSERT INTO client_accounting_services (
            client_id,
            accounting_service_id,
            accounting_program_id
        )
        VALUES ?
    `, [ values ]);
}

export async function findByClientId(connection, clientId) {
    const [rows] = await connection.query(`
        SELECT
            accounting_service_id AS serviceId,
            accounting_program_id AS programId
        FROM client_accounting_services
        WHERE client_id = ?
        ORDER BY id
    `, [ clientId ]);

    return rows;
}