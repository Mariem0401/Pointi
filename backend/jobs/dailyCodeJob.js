const CodeController = require('../Controller/codeController');
const cron = require('node-cron');

module.exports = {
  start: () => {
    // Exécution à 7h du lundi au vendredi
    cron.schedule('0 7 * * 1-5', async () => {
      logger.info('Début de la génération des codes quotidiens');
      try {
        await CodeController.sendDailyCodes();
        logger.info('Envoi des codes terminé');
      } catch (error) {
        logger.error('Erreur dans le job:', error);
      }
    }, {
      scheduled: true,
      timezone: "Europe/Paris"
    });
  }
};