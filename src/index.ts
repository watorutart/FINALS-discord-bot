import { WeeklyDiscordBot } from './app';
import { config } from 'dotenv';
import express from 'express';

config();

async function main(): Promise<void> {
  const bot = new WeeklyDiscordBot();

  const botConfig = {
    discordToken: process.env.DISCORD_TOKEN || '',
    channelId: process.env.CHANNEL_ID || '',
    dataFilePath: process.env.DATA_FILE_PATH || './data/posts.md',
    cronExpression: process.env.CRON_EXPRESSION || '30 18 * * 5' // 毎週金曜日18:30
  };

  try {
    await bot.initialize(botConfig);
    console.log('Discord bot initialized successfully');

    bot.startScheduler(botConfig);
    console.log('Weekly scheduler started');
    console.log(`Next clip posting: Every Friday at 18:30 JST`);

    // Health check server for Railway
    const app = express();
    const port = process.env.PORT || 3000;

    app.get('/health', (_req, res) => {
      res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        scheduler: bot.isSchedulerRunning(),
        nextExecution: 'Every Friday 18:30 JST'
      });
    });

    app.get('/', (_req, res) => {
      res.json({
        name: 'FINALS Discord Clip Bot',
        status: 'running',
        description: 'Posts random FINALS clips every Friday at 18:30 JST'
      });
    });

    app.listen(port, () => {
      console.log(`Health check server running on port ${port}`);
    });

    process.on('SIGINT', async () => {
      console.log('Shutting down bot...');
      await bot.shutdown();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('Shutting down bot...');
      await bot.shutdown();
      process.exit(0);
    });

    console.log('🚀 FINALS Clip Bot is fully operational!');
    console.log('🎮 Ready to post awesome clips every Friday evening!');
    
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}