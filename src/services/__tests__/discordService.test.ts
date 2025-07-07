import { DiscordService } from '../discordService';
import { LinkData } from '../../parsers/markdownParser';

jest.mock('discord.js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    destroy: jest.fn(),
    isReady: jest.fn().mockReturnValue(true),
    on: jest.fn(),
    channels: {
      fetch: jest.fn()
    },
    user: {
      tag: 'TestBot#0000'
    }
  })),
  GatewayIntentBits: {
    Guilds: 1,
    GuildMessages: 2
  }
}));

describe('DiscordService', () => {
  let discordService: DiscordService;

  beforeEach(() => {
    discordService = new DiscordService();
  });

  describe('formatMessage', () => {
    it('should format links into Discord message', () => {
      const links: LinkData[] = [
        { title: 'テスト記事1', url: 'https://example.com/1' },
        { title: 'テスト記事2', url: 'https://example.com/2' }
      ];

      const result = discordService.formatMessage(links);

      expect(result).toContain('📅 今週の投稿');
      expect(result).toContain('🔗 [テスト記事1](https://example.com/1)');
      expect(result).toContain('🔗 [テスト記事2](https://example.com/2)');
    });

    it('should handle empty links array', () => {
      const links: LinkData[] = [];

      const result = discordService.formatMessage(links);

      expect(result).toContain('今週の投稿はありません');
    });

    it('should handle single link', () => {
      const links: LinkData[] = [
        { title: '単一記事', url: 'https://example.com/single' }
      ];

      const result = discordService.formatMessage(links);

      expect(result).toContain('🔗 [単一記事](https://example.com/single)');
    });
  });

  describe('sendMessage', () => {
    it('should validate channel ID format', async () => {
      const invalidChannelId = 'invalid-channel-id';
      const message = 'test message';

      await expect(
        discordService.sendMessage(invalidChannelId, message)
      ).rejects.toThrow('Invalid channel ID format');
    });

    it('should validate message content', async () => {
      const channelId = '123456789012345678';
      const emptyMessage = '';

      await expect(
        discordService.sendMessage(channelId, emptyMessage)
      ).rejects.toThrow('Message content cannot be empty');
    });
  });

  describe('initialize', () => {
    it('should validate token format', () => {
      const invalidToken = 'invalid-token';

      expect(() => {
        discordService.initialize(invalidToken);
      }).toThrow('Invalid Discord bot token format');
    });

    it('should accept valid token format', () => {
      const validToken = 'BOT_TOKEN_EXAMPLE.PART_TWO.PART_THREE_EXAMPLE_TOKEN_FORMAT';

      expect(() => {
        discordService.initialize(validToken);
      }).not.toThrow();
    });
  });
});