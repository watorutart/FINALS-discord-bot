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

    const channel = await this.client.channels.fetch(channelId);
    if (!channel?.isTextBased()) {
      throw new Error('Channel is not a text channel');
    }

    await (channel as TextChannel).send(message);
  }

  initialize(token: string): void {
    if (!this.isValidToken(token)) {
      throw new Error('Invalid Discord bot token format');
    }

    this.client = new Client({
      intents: [GatewayIntentBits.Guilds]
    });

    this.client.login(token);
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