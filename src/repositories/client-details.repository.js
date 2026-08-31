import pool from '../config/db.js';

export async function findByClientId(clientId) {
    const [rows] = await pool.query(`
        SELECT * FROM clients_details WHERE client_id = ? LIMIT 1    
    `, [clientId]);

    return rows[0] ?? null;
}

export async function create(clientId, data) {
    const [result] = await pool.query(`
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

export async function update(clientId, data) {
    const [result] = await pool.query(`
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