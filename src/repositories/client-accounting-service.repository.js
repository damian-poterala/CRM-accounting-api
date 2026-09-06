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

export async function findDetailsByClientId(clientId, connection) {
    const [rows] = await connection.query(`
        SELECT
            cas.id,
            cas.accounting_service_id,
            (SELECT display_name FROM dictionaries AS d WHERE d.id = cas.accounting_service_id) AS accounting_service,
            cas.accounting_program_id,
            (SELECT display_name FROM dictionaries AS d WHERE d.id = cas.accounting_program_id) AS accounting_program
        FROM client_accounting_services AS cas
        WHERE client_id = ?
    `, [ clientId ]);

    return rows;
}