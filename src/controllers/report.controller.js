import * as reportService from '../services/report.service.js';

export async function allClientsExcel(req, res) {
    try {
        const file = await reportService.generateAllClientsReport();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="raport-aktywnych-klientow.xlsx"');

        return res.send(file);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas generowania raportu.' });
    }
}

export async function allTasksExcel(req, res) {
    try {
        const file = await reportService.generateAllTasksReport();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="raport-wszystki-zadan.xlsx"');

        return res.send(file);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas generowania raportu.' });
    }
}