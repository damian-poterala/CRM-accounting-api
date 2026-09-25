import * as reportRepository from '../repositories/report.repository.js';
import * as excelUtil from '../utils/excel.util.js';

export async function generateAllClientsReport() {
    const clients = await reportRepository.getAllClients();

    const file = await excelUtil.createAllClientReport(clients);

    return file;
}

export async function generateAllTasksReport() {
    const tasks = await reportRepository.getAllTasks();

    const file = await excelUtil.createAllTasksReport(tasks);

    return file;
}