import pool from '../config/db.js';

export async function getClients() {

    const [rows] = await pool.query(`
        SELECT *
        FROM clients
        ORDER BY id DESC
    `);

    return rows;
}

export async function autocomplete(field, query) {
    const fields = {
        nip: {
            select: 'nip',
            where: 'nip'
        },
        company_name: {
            select: 'company_name',
            where: 'company_name',
        },
        owner: {
            select: "CONCAT(first_name, ' ', last_name) AS owner",
            where: "CONCAT(first_name, ' ', last_name)"
        }
    }

    const sql = `
        SELECT id, ${ fields[field].select }
        FROM clients
        WHERE ${ fields[field].where } LIKE ?
        ORDER BY id DESC
        LIMIT 20
    `;

    console.log(sql);

    const [rows] = await pool.query(sql, [`%${ query }%`]);
    return rows;
}   

export async function search(filters) {
    let sql = `
        SELECT *
        FROM clients
        WHERE 1 = 1
    `;

    const params = [];

    if(filters.company_name) {
        sql += ' AND company_name = ?';
        params.push(filters.company_name);
    }

    if(filters.company_type) {
        sql += ' AND company_type = ?';
        params.push(filters.company_type);
    }

    if(filters.cooperation_status) {
        sql += ' AND cooperation_status = ?';
        params.push(filters.cooperation_status);
    }

    if(filters.nip) {
        sql += ' AND nip = ?';
        params.push(filters.nip);
    }

    if(filters.owner) {
        sql += " AND CONCAT(first_name, ' ', last_name) = ?";
        params.push(filters.owner);
    }

    sql += `
        ORDER BY id DESC
    `;

    const [rows] = await pool.execute(sql, params);
    return rows; 
}

export async function findById(id) {
    const [rows] = await pool.query(`
        SELECT id
        FROM clients
        WHERE id = ?
        LIMIT 1     
    `, [id]);

    return rows[0] || null;
}

export async function update(id, data) {
    const [result] = await pool.query(`
       UPDATE clients
       SET  cooperation_status = ?,
            account_manager_id = ?,
            phone = ?,
            email = ?,
            is_vat_payer = ?,
            notes = ?
       WHERE id = ? 
    `, [data.cooperationStatus, data.accountManager, data.phone, data.email, data.isVatPayer, data.notes, id]);

    return result;
}