# FINALS Discord Bot - プロジェクト概要

## プロジェクトの目的
MDファイルから読み取ったFINALSゲームのクリップを週1回自動でDiscordに投稿するBot。永続循環システムにより、全クリップ投稿完了後も自動で再開始される。

## 主要機能
- MDファイルからランダムクリップ選択・投稿
- 毎週金曜日18:30（JST）自動投稿
- 永続循環システム（全クリップ投稿後、自動リセット）
- 投稿済みクリップ管理（重複防止）
- 周回完了時の特別通知メッセージ
- ヘルスチェック機能

## 技術スタック
### バックエンド
- **Node.js** + **TypeScript** (ES2020)
- **Discord.js v14** - Discord Bot API
- **node-cron** - スケジュール管理
- **Express** - ヘルスチェック用サーバー
- **dotenv** - 環境変数管理

### 開発・テスト
- **Jest** - テスティングフレームワーク
- **ts-jest** - TypeScript用Jest設定
- **ESLint** - 静的解析
- **ts-node** - 開発時TypeScript実行

## コードベース構造
```
src/
├── services/
│   ├── discordService.ts      # Discord API操作
│   ├── scheduler.ts           # cron スケジュール管理
│   └── __tests__/            # サービス層テスト
├── parsers/
│   ├── markdownParser.ts      # MDファイル解析
│   └── __tests__/            # パーサーテスト
├── app.ts                    # メインアプリケーションクラス
├── index.ts                  # エントリーポイント
└── __tests__/               # 統合テスト
```

## デプロイ
- **Railway** (推奨) - 自動デプロイ
- **Docker** - コンテナ化対応

## データファイル
- `data/posts.md` - 投稿データ（Markdownリンク形式）
- 投稿済みデータの自動管理