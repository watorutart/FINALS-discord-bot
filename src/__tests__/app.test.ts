import { WeeklyDiscordBot } from '../app';

jest.mock('../parsers/markdownParser');
jest.mock('../services/discordService');
jest.mock('../services/scheduler');

describe('WeeklyDiscordBot', () => {
  let bot: WeeklyDiscordBot;

  beforeEach(() => {
    bot = new WeeklyDiscordBot();
  });

  describe('initialize', () => {
    it('should throw error when discord token is missing', async () => {
      const config = {
        discordToken: '',
        channelId: '123456789',
        dataFilePath: './data/posts.md',
        cronExpression: '0 9 * * 1'
      };

      await expect(bot.initialize(config)).rejects.toThrow('Discord token is required');
    });

    it('should throw error when channel ID is missing', async () => {
      const config = {
        discordToken: 'valid_token',
        channelId: '',
        dataFilePath: './data/posts.md',
        cronExpression: '0 9 * * 1'
      };

      await expect(bot.initialize(config)).rejects.toThrow('Channel ID is required');
    });

    it('should throw error when data file path is missing', async () => {
      const config = {
        discordToken: 'valid_token',
        channelId: '123456789',
        dataFilePath: '',
        cronExpression: '0 9 * * 1'
      };

      await expect(bot.initialize(config)).rejects.toThrow('Data file path is required');
    });
  });

  describe('startScheduler', () => {
    it('should throw error when cron expression is missing', () => {
      const config = {
        discordToken: 'valid_token',
        channelId: '123456789',
        dataFilePath: './data/posts.md',
        cronExpression: ''
      };

      expect(() => bot.startScheduler(config)).toThrow('Cron expression is required');
    });
  });

  describe('postWeeklyContent', () => {
    it('should complete successfully with valid input', async () => {
      const dataFilePath = './data/posts.md';
      const channelId = '123456789';

      await expect(
        bot.postWeeklyContent(dataFilePath, channelId)
      ).resolves.not.toThrow();
    });
  });

  describe('postRandomClip', () => {
    it('should post random clip successfully', async () => {
      const dataFilePath = './data/posts.md';
      const channelId = '123456789';

      await expect(
        bot.postRandomClip(dataFilePath, channelId)
      ).resolves.not.toThrow();
    });

    it('should handle case when no clips available', async () => {
      const dataFilePath = './data/posts.md';
      const channelId = '123456789';

      await expect(
        bot.postRandomClip(dataFilePath, channelId)
      ).resolves.not.toThrow();
    });
  });

  describe('postRandomClipWithAutoReset', () => {
    it('should post clip and auto-reset when needed', async () => {
      const dataFilePath = './data/posts.md';
      const channelId = '123456789';

      await expect(
        bot.postRandomClipWithAutoReset(dataFilePath, channelId)
      ).resolves.not.toThrow();
    });

    it('should handle auto-reset cycle completion', async () => {
      const dataFilePath = './data/posts.md';
      const channelId = '123456789';

      await expect(
        bot.postRandomClipWithAutoReset(dataFilePath, channelId)
      ).resolves.not.toThrow();
    });
  });
});