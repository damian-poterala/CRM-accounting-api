import pool from '../config/db.js';

export async function findByClientId(clientId, connection) {
    const [rows] = await connection.query(`
        SELECT  
            DATE_FORMAT(contract_signed_at, '%Y-%m-%d') AS contractSignedAt,
            DATE_FORMAT(service_start_date, '%Y-%m-%d') AS serviceStartDate,
            DATE_FORMAT(service_end_date, '%Y-%m-%d') AS serviceEndDate,
            contract_number AS contractNumber,
            electronic_contract AS electronicContract,
            lead_source_id AS leadSource,
            monthly_fee AS monthlyFee,
            payment_due_date AS paymentDueDate,
            payment_method_id AS paymentMethod,
            documents_limit AS documentsLimit,
            vat_period_id AS vatPeriod,
            income_tax_period_id AS incomeTaxPeriod,
            zus_not_applicable AS zusNotApplicable,
            zus_contributor AS zusPayer
        FROM clients_details
        WHERE client_id = ?
        LIMIT 1    
    `, [clientId]);

    if(!rows[0]) {
        return null;
    }

    return {
        ...rows[0],
        electronicContract: Boolean(rows[0].electronicContract),
        zusNotApplicable: Boolean(rows[0].zusNotApplicable),
        zusPayer: Boolean(rows[0].zusPayer)
    };
}

export async function findDetailsByClientId(clientId, connection) {
    const [rows] = await connection.query(`
        SELECT 
            c.id,
            c.company_type AS company_type_key,
            (SELECT display_name FROM dictionaries AS d WHERE d.value_key = c.company_type LIMIT 1) AS company_type,
            c.company_name,
            c.first_name,
            c.last_name,
            CONCAT(c.first_name, ' ', c.last_name) AS full_name,
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
            (SELECT u.username FROM users AS u WHERE u.id = c.account_manager_id LIMIT 1) AS account_manager,
            c.notes AS comment,
            DATE_FORMAT(c.created_at, '%Y-%m-%d') AS created_at,
            DATE_FORMAT(c.updated_at, '%Y-%m-%d') AS updated_at,

            DATE_FORMAT(cd.contract_signed_at, '%Y-%m-%d') AS contract_signed_at,
            DATE_FORMAT(cd.service_start_date, '%Y-%m-%d') AS service_start_date,
            DATE_FORMAT(cd.service_end_date, '%Y-%m-%d') AS service_end_date,
            cd.contract_number AS contract_number,
            CASE WHEN cd.electronic_contract = 1 THEN 'Tak' ELSE 'Nie' END AS electronic_contract,
            cd.lead_source_id AS lead_source_id,
            (SELECT display_name FROM dictionaries AS d WHERE d.id = cd.lead_source_id) AS lead_source,
            cd.monthly_fee AS monthly_fee,
            cd.payment_due_date AS payment_due_date,
            cd.payment_method_id AS payment_method_id,
            (SELECT display_name FROM dictionaries AS d WHERE d.id = cd.payment_method_id LIMIT 1) AS payment_method,
            cd.documents_limit AS documents_limit,
            cd.vat_period_id AS vat_period_id,
            (SELECT display_name FROM dictionaries AS d WHERE d.id = cd.vat_period_id LIMIT 1) AS vat_period,
            cd.income_tax_period_id AS income_tax_period_id,
            (SELECT display_name FROM dictionaries AS d WHERE d.id = cd.income_tax_period_id LIMIT 1) AS income_tax_period,
            CASE WHEN cd.zus_not_applicable = 1 THEN 'Tak' ELSE 'Nie' END AS zus_not_applicable,
            CASE WHEN cd.zus_contributor = 1 THEN 'Tak' ELSE 'Nie' END AS zus_contributor
        FROM clients AS c
        LEFT JOIN clients_details AS cd ON c.id = cd.client_id
        WHERE c.id = ?
        LIMIT 1  
    `, [ clientId ]);

    return rows[0] ?? null;
}

export async function create(clientId, data, connection) {
    const [result] = await connection.query(`
        INSERT INTO clients_details (
            client_id,
            contract_signed_at,
            service_start_date,
            service_end_date,
            contract_number,
            electronic_contract,
            lead_source_id,
            monthly_fee,
            payment_due_date,
            payment_method_id,
            documents_limit,
            vat_period_id,
            income_tax_period_id,
            zus_not_applicable,
            zus_contributor
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)    
    `, [
        clientId,
        data.contractSignedAt,
        data.serviceStartDate,
        data.serviceEndDate,
        data.contractNumber,
        data.electronicContract,
        data.leadSourceId,
        data.monthlyFee,
        data.paymentDueDate,
        data.paymentMethodId,
        data.documentsLimit,
        data.vatPeriodId,
        data.incomeTaxPeriodId,
        data.zusNotApplicable,
        data.zusContributor
    ]);

    return result;
}

export async function update(clientId, data, connection) {
    const [result] = await connection.query(`
        UPDATE clients_details
        SET contract_signed_at = ?,
            service_start_date = ?,
            service_end_date = ?,
            contract_number = ?,
            electronic_contract = ?,
            lead_source_id = ?,
            monthly_fee = ?,
            payment_due_date = ?,
            payment_method_id = ?,
            documents_limit = ?,
            vat_period_id = ?,
            income_tax_period_id = ?,
            zus_not_applicable = ?,
            zus_contributor = ?
        WHERE client_id = ?
    `, [
        data.contractSignedAt,
        data.serviceStartDate,
        data.serviceEndDate,
        data.contractNumber,
        data.electronicContract,
        data.leadSourceId,
        data.monthlyFee,
        data.paymentDueDate,
        data.paymentMethodId,
        data.documentsLimit,
        data.vatPeriodId,
        data.incomeTaxPeriodId,
        data.zusNotApplicable,
        data.zusContributor,
        clientId
    ]);

    return result;
}