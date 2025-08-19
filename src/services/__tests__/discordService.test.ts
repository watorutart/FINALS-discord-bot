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

  describe('formatRandomClip', () => {
    it('should format single clip with special styling', () => {
      const clip: LinkData = {
        title: 'No23 8デスより1キルを誇れよ！！！！！！',
        url: 'https://clips.twitch.tv/example'
      };

      const result = discordService.formatRandomClip(clip);

      expect(result).toContain('🎬 今週のFINALSクリップ');
      expect(result).toContain('📺 No23 8デスより1キルを誇れよ！！！！！！');
      expect(result).toContain('🔗 https://clips.twitch.tv/example');
    });

    it('should detect championship clip', () => {
      const championshipClip: LinkData = {
        title: 'No23 8デスより1キルを誇れよ！！！！！！ 第1回最強Clip決定戦優勝Clip',
        url: 'https://clips.twitch.tv/example'
      };

      const result = discordService.formatRandomClip(championshipClip);

      expect(result).toContain('🏆 第1回最強Clip決定戦優勝Clip');
    });

    it('should handle clip without special markers', () => {
      const regularClip: LinkData = {
        title: 'No15 最強のふたり',
        url: 'https://clips.twitch.tv/example'
      };

      const result = discordService.formatRandomClip(regularClip);

      expect(result).toContain('📺 No15 最強のふたり');
      expect(result).not.toContain('🏆');
    });
  });

  describe('formatCycleComplete', () => {
    it('should format cycle completion message', () => {
      const cycleNumber = 2;
      const clipsCount = 80;

      const result = discordService.formatCycleComplete(cycleNumber, clipsCount);

      expect(result).toContain('🎉 サイクル完了！');
      expect(result).toContain('第2周目');
      expect(result).toContain('80個');
      expect(result).toContain('第3周目を開始');
    });

    it('should handle first cycle completion', () => {
      const cycleNumber = 1;
      const clipsCount = 80;

      const result = discordService.formatCycleComplete(cycleNumber, clipsCount);

      expect(result).toContain('第1周目');
      expect(result).toContain('第2周目を開始');
    });

    it('should handle different clip counts', () => {
      const cycleNumber = 3;
      const clipsCount = 120;

      const result = discordService.formatCycleComplete(cycleNumber, clipsCount);

      expect(result).toContain('120個');
      expect(result).toContain('第4周目を開始');
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
    it('should validate token format', async () => {
      const invalidToken = 'invalid-token';

      await expect(
        discordService.initialize(invalidToken)
      ).rejects.toThrow('Invalid Discord bot token format');
    });

    it('should accept valid token format', async () => {
      const validToken = 'BOT_TOKEN_EXAMPLE.PART_TWO.PART_THREE_EXAMPLE_TOKEN_FORMAT';

      // Mock Discord Client to avoid actual connection
      const mockClient = {
        login: jest.fn().mockResolvedValue(undefined),
        on: jest.fn()
      };
      
      // Replace the Client constructor temporarily
      const originalClient = require('discord.js').Client;
      require('discord.js').Client = jest.fn(() => mockClient);

      await expect(
        discordService.initialize(validToken)
      ).resolves.not.toThrow();

      // Restore original Client
      require('discord.js').Client = originalClient;
    });
  });
});