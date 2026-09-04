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