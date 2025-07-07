import { WeeklyDiscordBot } from './app';
import { config } from 'dotenv';

config();

async function main(): Promise<void> {
  const bot = new WeeklyDiscordBot();

  const botConfig = {
    discordToken: process.env.DISCORD_TOKEN || '',
    channelId: process.env.CHANNEL_ID || '',
    dataFilePath: process.env.DATA_FILE_PATH || './data/posts.md',
    cronExpression: process.env.CRON_EXPRESSION || '0 9 * * 1' // 毎週月曜日9時
  };

  try {
    await bot.initialize(botConfig);
    console.log('Discord bot initialized successfully');

    bot.startScheduler(botConfig);
    console.log('Weekly scheduler started');

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

    console.log('Bot is running. Press Ctrl+C to stop.');
    
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}