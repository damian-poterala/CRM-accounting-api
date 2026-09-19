import pool from '../config/db.js';

export async function getUsers() {
    const [rows] = await pool.query(`
        SELECT  id,
                username
        FROM users
        WHERE is_active = 1
        ORDER BY id DESC    
    `);

    return rows;
}

export async function getAllClientsPerUser(connection, id) {
    const [rows] = await connection.query(`
        SELECT  c.id,
            c.company_type AS company_type_key,
            (SELECT display_name FROM dictionaries AS d WHERE d.value_key = c.company_type LIMIT 1) AS company_type,
            c.company_name,
            c.first_name,
            c.last_name,
            c.nip,
            c.regon,
            c.krs,
            c.pesel,
            c.email,
            c.phone,
            c.is_vat_payer,
            c.cooperation_status AS cooperation_status_key,
            (SELECT display_name FROM dictionaries AS d WHERE d.value_key = c.cooperation_status LIMIT 1) AS cooperation_status,
            c.account_manager_id,
            (SELECT username FROM users AS u WHERE u.id = c.account_manager_id LIMIT 1) AS account_manager,
            c.notes,
            c.created_at,
            c.updated_at,
            (SELECT COUNT(*) FROM clients_details AS cd WHERE cd.client_id = c.id) AS details,
            (SELECT COUNT(*) FROM tasks AS t WHERE t.client_id = c.id AND t.user_id = ? AND t.is_active = 1 AND t.is_complete = 0 LIMIT 1) AS tasks
        FROM clients AS c
        WHERE c.account_manager_id = ?
            AND c.cooperation_status = 'active'
        ORDER BY id DESC
    `, [ id, id ]);

    return rows;
}

export async function getAllTasksPerUser(connection, id) {
    const [rows] = await connection.query(`
        SELECT 
            t.id,
            t.user_id,
            (SELECT u.username FROM users AS u WHERE u.id = t.user_id LIMIT 1) AS username,
            t.client_id,
            (SELECT c.company_name FROM clients AS c WHERE c.id = t.client_id LIMIT 1) AS client,
            t.description,
            DATE_FORMAT(t.due_date, '%Y-%m-%d') AS due_date,
            t.is_active,
            t.is_complete,
            t.priority_id,
            (SELECT display_name FROM dictionaries AS d WHERE d.id = t.priority_id LIMIT 1) AS priority,
            t.created_at,
            t.updated_at
        FROM tasks AS t
        WHERE t.is_active = 1
            AND t.is_complete = 0
            AND t.user_id = ?
        ORDER BY t.due_date DESC
    `, [ id ]);

    return rows;
}

export async function getClientByCooperationStatusPerUser(connection, id) {
    const [rows] = await connection.query(`
        SELECT 
            COUNT(c.id) AS amount,
            d.display_name AS cooperation_status
        FROM clients AS c
        LEFT JOIN dictionaries AS d ON d.value_key = c.cooperation_status
        WHERE d.dictionary_type = 'cooperation_status'
            AND c.account_manager_id = ?
        GROUP BY d.display_name
    `, [ id ]);

    return rows;
}

export async function getClientByCompanyTypePerUser(connection, id) {
    const [rows] = await connection.query(`
        SELECT 
            COUNT(c.id) AS amount,
            d.display_name AS company_type
        FROM clients AS c
        LEFT JOIN dictionaries AS d ON d.value_key = c.company_type
        WHERE d.dictionary_type = 'company_type'
            AND c.account_manager_id = ?
        GROUP BY d.display_name
    `, [ id ]);

    return rows;
}