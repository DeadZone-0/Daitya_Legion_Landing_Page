import cron from 'node-cron';
import { scrapePlayers } from '../services/scraperService.js';

// Schedule to run every 6 hours (0 */6 * * *)
const startScraperJob = () => {
  cron.schedule('0 */6 * * *', async () => {
    console.log('Running background scraper job...');
    try {
      await scrapePlayers();
      console.log('Scraper job completed successfully');
    } catch (error) {
      console.error('Error during scraper job:', error.message);
    }
  });

  console.log('Scraper job scheduled (runs every 6 hours)');
};

export default startScraperJob;
