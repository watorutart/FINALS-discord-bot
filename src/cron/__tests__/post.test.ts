import { WeeklyDiscordBot } from '../../app';
import { main } from '../post';

// WeeklyDiscordBotのモック
jest.mock('../../app');

describe('サーバーレス投稿スクリプト', () => {
  let mockBot: jest.Mocked<WeeklyDiscordBot>;
  
  beforeEach(() => {
    // モックのリセット
    jest.clearAllMocks();
    
    // WeeklyDiscordBotのモックインスタンスを作成
    mockBot = {
      initialize: jest.fn(),
      postRandomClipWithAutoReset: jest.fn(),
      shutdown: jest.fn(),
    } as any;
    
    (WeeklyDiscordBot as jest.MockedClass<typeof WeeklyDiscordBot>).mockImplementation(() => mockBot);
    
    // 環境変数をセット
    process.env.DISCORD_TOKEN = 'test-token';
    process.env.CHANNEL_ID = 'test-channel-id';
    process.env.DATA_FILE_PATH = './data/posts.md';
  });

  afterEach(() => {
    // 環境変数をクリア
    delete process.env.DISCORD_TOKEN;
    delete process.env.CHANNEL_ID;
    delete process.env.DATA_FILE_PATH;
  });

  describe('正常系', () => {
    test('環境変数が正しく設定されている場合、クリップ投稿が成功する', async () => {
      // モックの設定
      mockBot.initialize.mockResolvedValue();
      mockBot.postRandomClipWithAutoReset.mockResolvedValue();
      mockBot.shutdown.mockResolvedValue();

      // 実行
      await main();

      // 検証
      expect(WeeklyDiscordBot).toHaveBeenCalledTimes(1);
      expect(mockBot.initialize).toHaveBeenCalledWith({
        discordToken: 'test-token',
        channelId: 'test-channel-id',
        dataFilePath: './data/posts.md',
        cronExpression: ''
      });
      expect(mockBot.postRandomClipWithAutoReset).toHaveBeenCalledWith('./data/posts.md', 'test-channel-id');
      expect(mockBot.shutdown).toHaveBeenCalled();
    });

    test('DATA_FILE_PATHが未設定の場合、デフォルト値が使用される', async () => {
      // DATA_FILE_PATHを削除
      delete process.env.DATA_FILE_PATH;
      
      // モックの設定
      mockBot.initialize.mockResolvedValue();
      mockBot.postRandomClipWithAutoReset.mockResolvedValue();
      mockBot.shutdown.mockResolvedValue();

      // 実行
      await main();

      // 検証：デフォルト値が使用されること
      expect(mockBot.initialize).toHaveBeenCalledWith({
        discordToken: 'test-token',
        channelId: 'test-channel-id',
        dataFilePath: './data/posts.md',
        cronExpression: ''
      });
    });
  });

  describe('異常系', () => {
    test('DISCORD_TOKENが未設定の場合、エラーが発生する', async () => {
      // DISCORD_TOKENを削除
      delete process.env.DISCORD_TOKEN;

      // 実行と検証
      await expect(main()).rejects.toThrow('DISCORD_TOKEN environment variable is required');
      
      // bot操作は呼ばれないこと
      expect(mockBot.initialize).not.toHaveBeenCalled();
    });

    test('CHANNEL_IDが未設定の場合、エラーが発生する', async () => {
      // CHANNEL_IDを削除
      delete process.env.CHANNEL_ID;

      // 実行と検証
      await expect(main()).rejects.toThrow('CHANNEL_ID environment variable is required');
      
      // bot操作は呼ばれないこと
      expect(mockBot.initialize).not.toHaveBeenCalled();
    });

    test('bot初期化でエラーが発生した場合、適切にハンドリングされる', async () => {
      // モックの設定：初期化でエラー
      const initError = new Error('Discord初期化エラー');
      mockBot.initialize.mockRejectedValue(initError);
      mockBot.shutdown.mockResolvedValue();

      // 実行と検証
      await expect(main()).rejects.toThrow('Discord初期化エラー');
      
      // shutdownは呼ばれること
      expect(mockBot.shutdown).toHaveBeenCalled();
      // postRandomClipWithAutoResetは呼ばれないこと
      expect(mockBot.postRandomClipWithAutoReset).not.toHaveBeenCalled();
    });

    test('クリップ投稿でエラーが発生した場合、適切にハンドリングされる', async () => {
      // モックの設定：クリップ投稿でエラー
      const postError = new Error('クリップ投稿エラー');
      mockBot.initialize.mockResolvedValue();
      mockBot.postRandomClipWithAutoReset.mockRejectedValue(postError);
      mockBot.shutdown.mockResolvedValue();

      // 実行と検証
      await expect(main()).rejects.toThrow('クリップ投稿エラー');
      
      // shutdownは呼ばれること
      expect(mockBot.shutdown).toHaveBeenCalled();
    });

    test('shutdown中にエラーが発生した場合でも、メインエラーがそのまま投げられる', async () => {
      // モックの設定：投稿とshutdownの両方でエラー
      const postError = new Error('クリップ投稿エラー');
      const shutdownError = new Error('Shutdown エラー');
      mockBot.initialize.mockResolvedValue();
      mockBot.postRandomClipWithAutoReset.mockRejectedValue(postError);
      mockBot.shutdown.mockRejectedValue(shutdownError);

      // 実行と検証：メインエラー（クリップ投稿エラー）が投げられること
      await expect(main()).rejects.toThrow('クリップ投稿エラー');
    });
  });
});