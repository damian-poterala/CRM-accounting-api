import pool from '../config/db.js';

export async function findById(id) {
    const [rows] = await pool.query(`
        SELECT id FROM tasks WHERE id = ? LIMIT 1
    `, [ id ]);

    return rows[0] || null;
}

export async function getAllTask() {
    const [rows] = await pool.query(`
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
        WHERE is_active = 1
            AND is_complete = 0
        ORDER BY t.due_date DESC
    `);

    return rows;
}

export async function getTaskPerUser(userId) {
    const [rows] = await pool.query(`
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
    `, [ userId ]);

    return rows;
}

export async function getTaskPerClient(userId, clientId) {
    const [rows] = await pool.query(`
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
            AND t.client_id = ?
        ORDER BY t.due_date DESC
    `, [ userId, clientId ]);

    return rows;
}

export async function create(data) {
    const [result] = await pool.query(`
        INSERT INTO tasks (user_id, client_id, description, due_date, is_active, is_complete, priority_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
        data.userId,
        data.clientId,
        data.description,
        data.dueDate,
        data.isActive,
        data.isComplete,
        data.priorityId
    ]);

    return result;
}

export async function remove(id) {
    const [result] = await pool.query(`
        UPDATE tasks
        SET is_active = 0
        WHERE id = ?
        LIMIT 1
    `, [ id ]);

    return result;
}

export async function complete(id) {
    const [result] = await pool.query(`
        UPDATE tasks 
        SET is_complete = 1
        WHERE id = ?
        LIMIT 1
    `, [ id ]);

    return result;
}