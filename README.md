# Weekly Discord Bot

スプレッドシートからデータを取得して週1でDiscordに投稿するBot（MDファイル版）

## 機能

- MDファイルからランダムに1つのクリップを選択
- 週1回自動でDiscordに投稿（FINALSクリップ専用フォーマット）
- **🔄 永続循環システム**: 全クリップ投稿完了後、自動で再開始
- 投稿済みクリップの自動管理（重複防止）
- 周回完了時の特別通知メッセージ
- TypeScriptで型安全な実装
- テスト駆動開発（TDD）によるコード品質保証

## セットアップ

1. **依存関係のインストール**
```bash
npm install
```

2. **環境変数の設定**
```bash
cp .env.example .env
# .envファイルを編集して必要な値を設定
```

3. **Discord Bot設定**
- Discord Developer Portalでbotを作成
- トークンを取得して`.env`に設定
- 投稿したいチャンネルIDを取得

4. **データファイルの準備**
```bash
# data/posts.mdを編集して投稿データを追加
```

## 使用方法

### 開発環境での実行
```bash
npm run dev
```

### 本番環境での実行
```bash
npm run build
npm start
```

### ランダムクリップのテスト投稿
```bash
npm run test:random
```

### テストの実行
```bash
npm test
npm run test:watch
npm run test:coverage
```

## データファイル形式

`data/posts.md`でMarkdown形式のリンクを管理:

```markdown
# 週間投稿データ

## 今週の投稿
- [No1 $100未満の超接戦、そして飛翔](https://clips.twitch.tv/...)
- [No23 8デスより1キルを誇れよ！！！！！！](https://clips.twitch.tv/...) 第1回最強Clip決定戦優勝Clip
- [No24 大々絶叫の阻止失敗と、戦犯の自白](https://clips.twitch.tv/...)

## 投稿済み
<!-- 投稿済みの記事は自動でここに移動 -->
```

### 投稿フォーマット
```
🎬 今週のFINALSクリップ

📺 No23 8デスより1キルを誇れよ！！！！！！
🔗 https://clips.twitch.tv/...

🏆 第1回最強Clip決定戦優勝Clip
```

## 環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `DISCORD_TOKEN` | Discord Bot Token | `MTIzNDU2...` |
| `CHANNEL_ID` | 投稿先チャンネルID | `123456789012345678` |
| `DATA_FILE_PATH` | データファイルパス | `./data/posts.md` |
| `CRON_EXPRESSION` | 実行スケジュール | `30 18 * * 5` |
| `PORT` | ヘルスチェック用ポート | `3000` |

## 🚀 自動デプロイ

### Railway (推奨)
```bash
# 1. GitHubにpush
git push origin main

# 2. Railway が自動デプロイ
# 3. 毎週金曜18:30に自動投稿開始！
```

詳細は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照

### スケジュール
- **投稿時間**: 毎週金曜日 18:30 JST  
- **継続期間**: 無制限（永続循環）
- **投稿方式**: 完全自動、メンテナンス不要

### 🔄 循環システム
```
第1周目: 80個のクリップを順次投稿 (80週間)
↓
🎉 周回完了通知
↓  
第2周目: 同じクリップを再度ランダム投稿開始
↓
新規追加されたクリップも自動で含まれる
↓
永続的に継続...
```

### 特別メッセージ
周回完了時に自動投稿:
```
🎉 サイクル完了！

✅ 第1周目が完了しました！
📊 投稿したクリップ数: 80個

🔄 第2周目を開始します！
🎮 引き続きFINALSクリップをお楽しみください！
```

## 開発ルール

本プロジェクトは`t-wada`推奨のテスト駆動開発を採用しています。
詳細は[DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md)を参照してください。

## 無料運用

- Google Sheets API: 不要
- Discord Bot: 無料
- ホスティング: Render/Railway等の無料プラン

完全無料で運用可能です！