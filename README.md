# Weekly Discord Bot

スプレッドシートからデータを取得して週1でDiscordに投稿するBot（MDファイル版）

## 機能

- MDファイルからランダムに1つのクリップを選択
- 週1回自動でDiscordに投稿（FINALSクリップ専用フォーマット）
- 投稿済みクリップの自動管理（重複防止）
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
| `CRON_EXPRESSION` | 実行スケジュール | `0 9 * * 1` |

## 開発ルール

本プロジェクトは`t-wada`推奨のテスト駆動開発を採用しています。
詳細は[DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md)を参照してください。

## 無料運用

- Google Sheets API: 不要
- Discord Bot: 無料
- ホスティング: Render/Railway等の無料プラン

完全無料で運用可能です！