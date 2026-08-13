import { Connection, format } from 'mysql2';
import pool from '../config/db.js';

export async function getDeclarations(year, type) {
    const [rows] = await pool.query(`
        SELECT  c.id AS client_id,
                c.company_name,
                COALESCE(cd.account_manager_id, c.account_manager_id) AS account_manager_id,
                cd.month,
                DATE_FORMAT(cd.sent_date, '%Y-%m-%d') AS sent_date,
                cd.comment
        FROM clients AS c
        LEFT JOIN client_declarations AS cd
            ON cd.client_id = c.id
            AND cd.year = ?
            AND cd.declaration_type = ?
        ORDER BY company_name ASC    
    `, [year, type]
    );

    const clientsMap = new Map();

    for(const row of rows) {
        if(!clientsMap.has(row.client_id)) {
            const months = {};

            for(let i = 1; i <= 12; i++) {
                months[i] = {
                    date: null,
                    comment: ''
                };
            }

            clientsMap.set(row.client_id, {
                clientId: row.client_id,
                companyName: row.company_name,
                accountManagerId: row.account_manager_id,
                months
            });
        }

        if(row.month) {
            const client = clientsMap.get(row.client_id);

            client.months[row.month] = {
                date: row.sent_date,
                comment: row.comment ?? ''
            }
        }
    }

    return Array.from(clientsMap.values());
}

export async function saveDeclarations(payload) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { year, type, rows } = payload;

        for(const row of rows) {
            const { clientId, accountManagerId, months } = row;

            for(const monthData of months) {
                console.log([
                    clientId,
                    accountManagerId,
                    type,
                    year,
                    monthData.month,
                    formatDate(monthData.date),
                    monthData.comment
                ]);
                await connection.execute(`
                    INSERT INTO client_declarations (client_id, account_manager_id, declaration_type, year, month, sent_date, comment)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                        account_manager_id = VALUES(account_manager_id),
                        sent_date = VALUES(sent_date),
                        comment = VALUES(comment),
                        updated_at = CURRENT_TIMESTAMP  
                `, [clientId, accountManagerId, type, year, monthData.month, formatDate(monthData.date), monthData.comment]);
            }
        }

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}


function formatDate(date) {
    if(!date) {
        return null;
    }

    return new Date(date).toISOString().split('T')[0];
}