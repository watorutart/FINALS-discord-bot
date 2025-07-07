# 自動デプロイ設定ガイド

## 🚀 Railway自動デプロイ

### 1. Railwayアカウント作成
1. [Railway](https://railway.app/) にアクセス
2. GitHubアカウントでサインアップ
3. 無料プランを選択

### 2. プロジェクト作成
1. 「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. `FINALS-discord-bot` リポジトリを選択

### 3. 環境変数設定
Railway ダッシュボードで以下を設定:

```
DISCORD_TOKEN=your_discord_bot_token_here
CHANNEL_ID=your_channel_id_here
DATA_FILE_PATH=./data/posts.md
CRON_EXPRESSION=30 18 * * 5
NODE_ENV=production
```

### 4. 自動デプロイ確認
- GitHubにプッシュすると自動でデプロイ開始
- ビルドログでエラーがないか確認
- ヘルスチェック: `https://your-app.railway.app/health`

## ⚙️ 運用設定

### 週次投稿スケジュール
- **投稿時間**: 毎週金曜日 18:30 JST
- **投稿内容**: ランダムなFINALSクリップ1つ
- **継続期間**: 80週間（約1年半）

### 監視機能
- **ヘルスチェック**: `/health` エンドポイント
- **ステータス確認**: `/` エンドポイント  
- **自動再起動**: エラー時の自動復旧

### ログ確認
Railway ダッシュボードの「Logs」タブで確認:
- 起動ログ
- 投稿ログ
- エラーログ

## 🔧 トラブルシューティング

### デプロイ失敗時
1. ビルドログを確認
2. 環境変数が正しく設定されているか確認
3. GitHubリポジトリのアクセス権限確認

### Bot動作不良時
1. `/health` エンドポイントでステータス確認
2. Discordトークンの有効性確認
3. チャンネルIDとBot権限確認

### 投稿されない場合
1. cron設定が正しいか確認 (`30 18 * * 5`)
2. タイムゾーンの確認（JST）
3. posts.mdに投稿可能なクリップがあるか確認

## 📊 運用開始後
- 毎週金曜日18:30に自動投稿開始
- 80個のクリップを順次消化
- 約1年半の完全自動運用
- メンテナンス不要