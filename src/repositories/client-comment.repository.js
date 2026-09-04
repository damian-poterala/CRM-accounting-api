export async function create(clientId, comment, connection) {
    const [result] = await connection.query(`
        INSERT INTO client_comments (client_id, comment)
        VALUES (?, ?)
    `, [ clientId, comment ]);

    return result;
}

export async function findLatestByClientId(connection, clientId) {
    const [rows] = await connection.query(`
        SELECT comment 
        FROM client_comments
        WHERE client_id = ?
        ORDER BY created_at DESC, id DESC
        LIMIT 1
    `, [ clientId ]);

    return rows[0] ?? null;
}