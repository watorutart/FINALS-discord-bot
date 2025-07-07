import { MarkdownParser } from './parsers/markdownParser';
import { DiscordService } from './services/discordService';
import { WeeklyScheduler } from './services/scheduler';

export class WeeklyDiscordBot {
  private parser: MarkdownParser;
  private discordService: DiscordService;
  private scheduler: WeeklyScheduler;

  constructor() {
    this.parser = new MarkdownParser();
    this.discordService = new DiscordService();
    this.scheduler = new WeeklyScheduler();
  }

  async initialize(config: BotConfig): Promise<void> {
    if (!config.discordToken) {
      throw new Error('Discord token is required');
    }

    if (!config.channelId) {
      throw new Error('Channel ID is required');
    }

    if (!config.dataFilePath) {
      throw new Error('Data file path is required');
    }

    this.discordService.initialize(config.discordToken);
    
    await this.waitForDiscordReady();
  }

  async postWeeklyContent(dataFilePath: string, channelId: string): Promise<void> {
    try {
      const links = await this.parser.readFromFile(dataFilePath);
      const message = this.discordService.formatMessage(links);
      await this.discordService.sendMessage(channelId, message);
    } catch (error) {
      throw new Error(`Failed to post weekly content: ${error}`);
    }
  }

  async postRandomClip(dataFilePath: string, channelId: string): Promise<void> {
    try {
      const randomClip = await this.parser.getRandomFromFile(dataFilePath);
      
      if (!randomClip) {
        console.log('📭 No clips available for posting');
        return;
      }

      console.log(`🎲 Selected random clip: ${randomClip.title}`);
      
      const message = this.discordService.formatRandomClip(randomClip);
      await this.discordService.sendMessage(channelId, message);
      
      console.log('📝 Moving clip to posted section...');
      await this.parser.markAsPosted(dataFilePath, randomClip);
      console.log('✅ Clip marked as posted');
      
    } catch (error) {
      throw new Error(`Failed to post random clip: ${error}`);
    }
  }

  startScheduler(config: BotConfig): void {
    if (!config.cronExpression) {
      throw new Error('Cron expression is required');
    }

    this.scheduler.schedule(config.cronExpression, async () => {
      await this.postRandomClip(config.dataFilePath, config.channelId);
    });
  }

  stopScheduler(): void {
    this.scheduler.stop();
  }

  isSchedulerRunning(): boolean {
    return this.scheduler.isRunning();
  }

  async shutdown(): Promise<void> {
    this.stopScheduler();
    await this.discordService.disconnect();
  }

  private async waitForDiscordReady(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
  }
}

export interface BotConfig {
  discordToken: string;
  channelId: string;
  dataFilePath: string;
  cronExpression: string;
}