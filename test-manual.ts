import { WeeklyDiscordBot } from './src/app';
import { config } from 'dotenv';

config();

async function testBot(): Promise<void> {
  const bot = new WeeklyDiscordBot();

  const botConfig = {
    discordToken: process.env.DISCORD_TOKEN || '',
    channelId: process.env.CHANNEL_ID || '',
    dataFilePath: './data/posts.md',
    cronExpression: '0 9 * * 1'
  };

  try {
    console.log('🔍 Config check:');
    console.log('- Token exists:', !!botConfig.discordToken);
    console.log('- Channel ID:', botConfig.channelId);
    console.log('- Data file:', botConfig.dataFilePath);
    
    console.log('🤖 Initializing Discord Bot...');
    await bot.initialize(botConfig);
    console.log('✅ Bot initialized successfully');

    // Wait a bit more for Discord connection
    console.log('⏳ Waiting for Discord connection...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('📝 Reading markdown data and posting to Discord...');
    await bot.postWeeklyContent(botConfig.dataFilePath, botConfig.channelId);
    console.log('✅ Message posted successfully!');

    console.log('🔄 Shutting down bot...');
    await bot.shutdown();
    console.log('✅ Bot shutdown complete');

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('❌ Full error details:', JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

testBot();