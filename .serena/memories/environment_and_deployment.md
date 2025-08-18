# 環境設定とデプロイメント情報

## 環境変数設定
### 必須環境変数 (.env)
```env
# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token_here
CHANNEL_ID=your_channel_id_here

# Data Configuration  
DATA_FILE_PATH=./data/posts.md

# Schedule Configuration (cron format)
# 毎週金曜日 18:30 JST - 完璧なFINALS週末セッション開始時間！
CRON_EXPRESSION=30 18 * * 5

# Server Configuration（本番環境用）
PORT=3000
```

## データファイル構造
### posts.md フォーマット
```markdown
# 週間投稿データ

## 今週の投稿
- [No1 $100未満の超接戦、そして飛翔](https://clips.twitch.tv/...)
- [No23 8デスより1キルを誇れよ！！！！！！](https://clips.twitch.tv/...) 第1回最強Clip決定戦優勝Clip

## 投稿済み
<!-- 投稿済みの記事は自動でここに移動 -->
```

## デプロイメント

### Railway (推奨)
```bash
# 1. GitHubにプッシュ
git push origin main

# 2. Railway が自動デプロイ
# 3. 毎週金曜18:30に自動投稿開始！
```

### Docker デプロイ
```bash
# ビルド
docker build -t finals-bot .

# 実行
docker run -d --env-file .env -p 3000:3000 finals-bot

# ヘルスチェック
curl http://localhost:3000/health
```

## 運用スケジュール
- **投稿時間**: 毎週金曜日 18:30 JST  
- **継続期間**: 無制限（永続循環）
- **投稿方式**: 完全自動、メンテナンス不要

## 循環システム
```
第1周目: N個のクリップを順次投稿 (N週間)
↓
🎉 周回完了通知 + 統計情報
↓  
第2周目: 同じクリップを再度ランダム投稿開始
↓
新規追加されたクリップも自動で含まれる
↓
永続的に継続...
```

## 監視・ヘルスチェック
### エンドポイント
- `GET /health` - アプリケーション状態確認
- `GET /status` - Bot稼働状況とスケジュール情報

### ログ監視
```bash
# アプリケーションログ
tail -f logs/app.log

# エラーログ
grep ERROR logs/app.log
```

## トラブルシューティング
### よくある問題と解決方法
1. **Discord認証エラー**
   - `DISCORD_TOKEN` を確認
   - Botの権限設定を確認

2. **チャンネル投稿エラー** 
   - `CHANNEL_ID` が正しいか確認
   - Botがチャンネルにアクセス権限を持つか確認

3. **スケジュール実行されない**
   - `CRON_EXPRESSION` 形式を確認
   - タイムゾーン設定を確認

### デバッグコマンド
```bash
# 手動テスト実行
npm run test:manual

# 開発モードで詳細ログ出力
DEBUG=* npm run dev
```