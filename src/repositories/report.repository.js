import pool from '../config/db.js';

export async function getAllClients() {
    const [rows] = await pool.query(`
        SELECT  c.id,
                c.company_type AS company_type_key,
                (SELECT display_name FROM dictionaries AS d WHERE d.value_key = c.company_type LIMIT 1) AS company_type,
                c.company_name,
                c.first_name,
                c.last_name,
                CONCAT(c.first_name, ' ', c.last_name) AS owner_company,
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
                c.updated_at
        FROM clients AS c
        WHERE c.cooperation_status = 'active'
        ORDER BY id DESC
    `);

    return rows;
}

export async function getAllTasks() {
    const [rows] = await pool.query(`
        SELECT
            t.id,
            t.user_id,
            (SELECT username FROM users AS u WHERE u.id = t.user_id LIMIT 1) AS user,
            t.client_id,
            (SELECT company_name FROM clients AS c WHERE c.id = t.client_id LIMIT 1) AS client,
            t.description,
            DATE_FORMAT(t.due_date, '%Y-%m-%d') AS due_date,
            t.priority_id,
            (SELECT display_name FROM dictionaries AS d WHERE d.id = priority_id LIMIT 1) AS priority,
            CASE WHEN t.is_active = 1 THEN 'Tak' ELSE 'Nie' END AS is_active,
            CASE WHEN t.is_complete = 1 THEN 'Tak' ELSE 'Nie' END AS is_complete,
            DATE_FORMAT(t.created_at, '%Y-%m-%d') AS created_at,
            DATE_FORMAT(t.updated_at, '%Y-%m-%d') AS updated_at
        FROM tasks AS t
    `);

    return rows;
}