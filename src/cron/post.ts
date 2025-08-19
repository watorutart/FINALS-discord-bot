#!/usr/bin/env node

/**
 * Serverless Discord Clip Posting Script
 * Used by GitHub Actions to post weekly clips without keeping the bot running 24/7
 */

import { WeeklyDiscordBot } from '../app';
import { BotConfig } from '../app';

async function main(): Promise<void> {
  console.log('🚀 Starting serverless clip posting...');
  console.log(`Timestamp: ${new Date().toISOString()}`);

  const bot = new WeeklyDiscordBot();

  const botConfig: BotConfig = {
    discordToken: process.env.DISCORD_TOKEN || '',
    channelId: process.env.CHANNEL_ID || '',
    dataFilePath: process.env.DATA_FILE_PATH || './data/posts.md',
    cronExpression: '' // Not needed for one-time execution
  };

  // Validate environment variables
  if (!botConfig.discordToken) {
    throw new Error('DISCORD_TOKEN environment variable is required');
  }
  
  if (!botConfig.channelId) {
    throw new Error('CHANNEL_ID environment variable is required');
  }

  try {
    // Initialize the bot (connects to Discord)
    await bot.initialize(botConfig);
    console.log('✅ Discord bot initialized successfully');

    // Post the weekly clip with auto-reset functionality
    await bot.postRandomClipWithAutoReset(botConfig.dataFilePath, botConfig.channelId);
    console.log('✅ Weekly clip posted successfully');

    // Gracefully shutdown
    await bot.shutdown();
    console.log('✅ Bot shutdown completed');
    
    console.log('🎉 Serverless clip posting completed successfully!');
    
    // Only exit if running as main module (not in tests)
    if (require.main === module) {
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Failed to post clip:', error);
    
    try {
      await bot.shutdown();
    } catch (shutdownError) {
      console.error('❌ Error during shutdown:', shutdownError);
    }
    
    // Only exit if running as main module (not in tests)
    if (require.main === module) {
      process.exit(1);
    }
    
    // Re-throw error for tests
    throw error;
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the main function if this file is executed directly
if (require.main === module) {
  main();
}

export { main };