# トラブルシューティング

## DiscordAPIError[50001]: Missing Access

### 原因
1. **Botの権限不足**
2. **チャンネルアクセス権限なし**
3. **不正なチャンネルID**

### 解決手順

#### 1. Discord Developer Portalでの設定確認
- https://discord.com/developers/applications
- あなたのBotアプリケーションを選択
- Bot設定で以下を確認：
  - `Send Messages` 権限が有効
  - `View Channels` 権限が有効

#### 2. Discordサーバーでの招待URL作成
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_CLIENT_ID&permissions=2048&scope=bot
```
- `YOUR_BOT_CLIENT_ID`を実際のIDに置換
- `permissions=2048`は「Send Messages」権限

#### 3. チャンネルIDの取得方法
1. Discord設定 → 詳細設定 → 開発者モード ON
2. 投稿したいチャンネルを右クリック
3. 「IDをコピー」を選択

#### 4. 環境変数の確認
```bash
# .envファイルの内容確認
cat .env

# 必要な形式:
DISCORD_TOKEN=your_bot_token_here
CHANNEL_ID=123456789012345678
```

#### 5. 権限テスト
```bash
# まずは権限確認
npm run test:manual
```

### よくあるミス
- ❌ BotトークンとUserトークンを混同
- ❌ チャンネルIDではなくサーバーIDを使用
- ❌ Botがサーバーに招待されていない
- ❌ Botに送信権限がない