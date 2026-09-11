import pool from '../config/db.js';

import * as statisticRepository from '../repositories/statistic.repository.js';

export async function getStatistics() {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const allClients             = await statisticRepository.getAllClients(connection);
        const activeClients          = await statisticRepository.getActiveClients(connection);
        const newClientsCurrentMonth = await statisticRepository.getNewClientsCurrentMonth(connection);
        const monthlyFeeSum          = await statisticRepository.getMonthlyFeeSum(connection);
        const clientByManager        = await statisticRepository.getClientsByManager(connection);
        const clientByLeadSource     = await statisticRepository.getClientsByLeadSource(connection);
        const clientByMonth          = await statisticRepository.getClientsByMonth(connection);
        const clientByCooperationStatus = await statisticRepository.getClientsByCooperationStatus(connection);

        await connection.commit();

        return {
            status: 200,
            data: {
                all_clients                  : allClients.amount_clients,
                active_clients               : activeClients.amount_active_clients,
                new_clients_current_month    : newClientsCurrentMonth.amount_new_clients,
                monthly_fee_sum              : monthlyFeeSum.sum_monthly_fee,
                client_by_manager            : clientByManager,
                client_by_lead_source        : clientByLeadSource,
                client_by_month              : clientByMonth,
                client_by_cooperation_status : clientByCooperationStatus,
            }
        }
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}