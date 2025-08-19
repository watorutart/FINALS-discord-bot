import { MarkdownParser } from './parsers/markdownParser';
import { DiscordService } from './services/discordService';
import { WeeklyScheduler } from './services/scheduler';

export class WeeklyDiscordBot {
  private parser: MarkdownParser;
  private discordService: DiscordService;
  private scheduler: WeeklyScheduler;
  private cycleCount: number = 1;

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

    await this.discordService.initialize(config.discordToken);
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

  async postRandomClipWithAutoReset(dataFilePath: string, channelId: string): Promise<void> {
    try {
      let randomClip = await this.parser.getRandomFromFile(dataFilePath);
      
      // 投稿可能なクリップがない場合、自動リセットを実行
      if (!randomClip) {
        console.log('🔄 No available clips found. Starting auto-reset...');
        
        const postedCount = await this.parser.getPostedClipsCountFromFile(dataFilePath);
        
        if (postedCount === 0) {
          console.log('📭 No clips available at all. Nothing to reset.');
          return;
        }

        console.log(`🔄 Resetting ${postedCount} posted clips back to available...`);
        await this.parser.resetPostedToAvailableFile(dataFilePath);
        
        // 周回完了メッセージを投稿
        const cycleCompleteMessage = this.discordService.formatCycleComplete(this.cycleCount, postedCount);
        await this.discordService.sendMessage(channelId, cycleCompleteMessage);
        
        this.cycleCount++;
        console.log(`🎉 Cycle ${this.cycleCount - 1} completed! Starting cycle ${this.cycleCount}`);
        
        // リセット後にランダムクリップを再選択
        randomClip = await this.parser.getRandomFromFile(dataFilePath);
      }

      if (!randomClip) {
        console.log('📭 Still no clips available after reset');
        return;
      }

      console.log(`🎲 [Cycle ${this.cycleCount}] Selected random clip: ${randomClip.title}`);
      
      const message = this.discordService.formatRandomClip(randomClip);
      await this.discordService.sendMessage(channelId, message);
      
      console.log('📝 Moving clip to posted section...');
      await this.parser.markAsPosted(dataFilePath, randomClip);
      console.log('✅ Clip marked as posted');
      
    } catch (error) {
      throw new Error(`Failed to post random clip with auto-reset: ${error}`);
    }
  }

  startScheduler(config: BotConfig): void {
    if (!config.cronExpression) {
      throw new Error('Cron expression is required');
    }

    this.scheduler.schedule(config.cronExpression, async () => {
      await this.postRandomClipWithAutoReset(config.dataFilePath, config.channelId);
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

}

export interface BotConfig {
  discordToken: string;
  channelId: string;
  dataFilePath: string;
  cronExpression: string;
}