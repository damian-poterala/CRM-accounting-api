import * as statisticService from '../services/statistic.service.js';

export async function getStatistics(req, res) {
    try {
        const result = await statisticService.getStatistics();

        return res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania statystyk.' });
    }
}