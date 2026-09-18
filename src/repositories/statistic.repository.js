export async function getAllClients(connection) {
    const [rows] = await connection.query(`
        SELECT 
            COUNT(*) AS amount_clients
        FROM clients AS c
    `);

    return rows[0];
}

export async function getActiveClients(connection) {
    const [rows] = await connection.query(`
        SELECT 
            COUNT(*) AS amount_active_clients
        FROM clients AS c
        WHERE c.cooperation_status = 'active'
    `);

    return rows[0];
}

export async function getNewClientsCurrentMonth(connection) {
    const [rows] = await connection.query(`
        SELECT
            COUNT(*) AS amount_new_clients
        FROM clients AS c
        WHERE c.created_at >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
            AND c.created_at < DATE_ADD(DATE_FORMAT(CURRENT_DATE, '%Y-%m-01'), INTERVAL 1 MONTH)
    `);

    return rows[0];
}

export async function getMonthlyFeeSum(connection) {
    const [rows] = await connection.query(`
        SELECT 
            COUNT(c.id) AS amount_clients,
            COALESCE(SUM(cd.monthly_fee), 0) AS sum_monthly_fee
        FROM clients AS c 
        LEFT JOIN clients_details AS cd ON cd.client_id = c.id
        WHERE c.cooperation_status = 'active'
    `);

    return rows[0];
}

export async function getClientsByManager(connection) {
    const [rows] = await connection.query(`
        SELECT
            COUNT(c.id) AS amount,
            c.account_manager_id,
            u.username
        FROM clients AS c
        LEFT JOIN users AS u ON u.id = c.account_manager_id
        GROUP BY c.account_manager_id, u.username
    `);

    return rows;
}

export async function getClientsByLeadSource(connection) {
    const [rows] = await connection.query(`
        SELECT
            cd.lead_source_id,
            d.display_name AS lead_source,
            COUNT(c.id)    AS amount_clients
        FROM clients AS c
        LEFT JOIN clients_details AS cd ON c.id = cd.client_id
        LEFT JOIN dictionaries    AS d  ON d.id = cd.lead_source_id
        WHERE cd.lead_source_id IS NOT NULL
        GROUP BY cd.lead_source_id, d.display_name
        ORDER BY amount_clients DESC   
    `);

    return rows;
}

export async function getClientsByMonth(connection) {
    const [rows] = await connection.query(`
        WITH RECURSIVE months AS (
            SELECT 
                DATE_SUB(DATE_FORMAT(CURRENT_DATE, '%Y-%m-01'), INTERVAL 11 MONTH) AS month_date

            UNION ALL

            SELECT
                DATE_ADD(month_date, INTERVAL 1 MONTH)
            FROM months
            WHERE month_date < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
        )

        SELECT 
            YEAR(m.month_date) AS year,
            MONTH(m.month_date) AS month,
            COUNT(c.id) AS amount
        FROM months AS m
        LEFT JOIN clients AS c ON created_at >= m.month_date AND c.created_at < DATE_ADD(m.month_date, INTERVAL 1 MONTH)
        GROUP BY YEAR(m.month_date), MONTH(m.month_date)
        ORDER BY YEAR(m.month_date), MONTH(m.month_date)
    `);

    return rows;
}

export async function getClientsByCooperationStatus(connection) {
    const [rows] = await connection.query(`
        SELECT 
            COUNT(c.id) AS amount,
            d.display_name AS cooperation_status
        FROM clients AS c
        LEFT JOIN dictionaries AS d ON d.value_key = c.cooperation_status
        WHERE d.dictionary_type = 'cooperation_status'
        GROUP BY d.display_name
    `);

    return rows;
}

export async function getClientsByCompanyType(connection) {
    const [rows] = await connection.query(`
        SELECT 
            COUNT(c.id) AS amount,
            d.display_name AS company_type
        FROM clients AS c
        LEFT JOIN dictionaries AS d ON d.value_key = c.company_type
        WHERE d.dictionary_type = 'company_type'
        GROUP BY d.display_name
    `);

    return rows;
}
