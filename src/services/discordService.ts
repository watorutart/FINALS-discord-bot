import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { LinkData } from '../parsers/markdownParser';

export class DiscordService {
  private client: Client | null = null;

  formatMessage(links: LinkData[]): string {
    if (links.length === 0) {
      return '📅 今週の投稿\n\n今週の投稿はありません。';
    }

    const header = '📅 今週の投稿\n\n';
    const linkList = links
      .map(link => `🔗 [${link.title}](${link.url})`)
      .join('\n');

    return header + linkList;
  }

  formatRandomClip(clip: LinkData): string {
    const header = '🎬 今週のFINALSクリップ\n\n';
    
    const isChampionshipClip = clip.title.includes('第1回最強Clip決定戦優勝Clip');
    const cleanTitle = clip.title.replace(/ 第1回最強Clip決定戦優勝Clip$/, '');
    
    const clipInfo = `📺 ${cleanTitle}\n🔗 ${clip.url}`;
    
    let footer = '';
    if (isChampionshipClip) {
      footer = '\n\n🏆 第1回最強Clip決定戦優勝Clip';
    }

    return header + clipInfo + footer;
  }

  formatCycleComplete(cycleNumber: number, clipsCount: number): string {
    const header = '🎉 サイクル完了！\n\n';
    
    const cycleInfo = `✅ 第${cycleNumber}周目が完了しました！\n` +
                     `📊 投稿したクリップ数: ${clipsCount}個\n\n`;
    
    const nextCycle = `🔄 第${cycleNumber + 1}周目を開始します！\n` +
                     `🎮 引き続きFINALSクリップをお楽しみください！`;
    
    return header + cycleInfo + nextCycle;
  }

  async sendMessage(channelId: string, message: string): Promise<void> {
    if (!this.isValidChannelId(channelId)) {
      throw new Error('Invalid channel ID format');
    }

    if (!message.trim()) {
      throw new Error('Message content cannot be empty');
    }

    if (!this.client) {
      throw new Error('Discord client not initialized');
    }

    if (!this.client.isReady()) {
      throw new Error('Discord client is not ready');
    }

    console.log('🔍 Fetching channel:', channelId);
    const channel = await this.client.channels.fetch(channelId);
    console.log('📡 Channel fetched:', channel?.type, channel?.id);
    
    if (!channel?.isTextBased()) {
      throw new Error('Channel is not a text channel');
    }

    console.log('📤 Sending message...');
    await (channel as TextChannel).send(message);
    console.log('✅ Message sent successfully');
  }

  async initialize(token: string): Promise<void> {
    if (!this.isValidToken(token)) {
      throw new Error('Invalid Discord bot token format');
    }

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
      ]
    });

    this.client.on('ready', () => {
      console.log(`🤖 Bot logged in as ${this.client?.user?.tag}`);
    });

    this.client.on('error', (error) => {
      console.error('❌ Discord client error:', error);
    });

    // Wait for login to complete
    await this.client.login(token);
  }

  private isValidChannelId(channelId: string): boolean {
    return /^\d{17,20}$/.test(channelId);
  }

  private isValidToken(token: string): boolean {
    return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token);
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.destroy();
      this.client = null;
    }
  }
}