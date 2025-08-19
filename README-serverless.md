# Discord Bot - サーバーレス移行ガイド

このドキュメントでは、FINALS Discord Botのサーバーレスアーキテクチャへの移行について説明します。

## 概要

Botは常時稼働サーバーからGitHub Actionsを使用したサーバーレスアーキテクチャに移行されました。これにより24/7のサーバーホスティングが不要となり、同じ機能を維持しながらコストを削減できます。

## アーキテクチャの変更

### 移行前（サーバーベース）
- Railway/サーバー上でBot常時稼働
- node-cronによるスケジューリング
- ヘルスチェック用Expressサーバー
- Discord Gatewayへの永続接続

### 移行後（サーバーレス）
- GitHub Actionsによるスケジューリング
- 永続サーバー不要
- スケジュール実行時のみワンタイム実行
- Discord REST APIのみ使用

## 作成・変更されたファイル

### GitHub Actions ワークフロー
- `.github/workflows/discord-cron.yml` - 毎週金曜18:30 JSTの定期実行設定

### サーバーレススクリプト
- `src/cron/post.ts` - クリップ投稿用スタンドアロンスクリプト
- `package.json` - サーバーレス実行用npmスクリプト追加

## 設定方法

### GitHub Secrets の設定
リポジトリのGitHub Secretsに以下を設定してください：

```
DISCORD_TOKEN=あなたのDiscord_Botトークン
CHANNEL_ID=投稿先のDiscordチャンネルID
```

### 環境変数
以下の環境変数が使用されます：
- `DISCORD_TOKEN` - Discord Botトークン
- `CHANNEL_ID` - 投稿先チャンネルID
- `DATA_FILE_PATH` - Markdownデータファイルのパス（デフォルト: './data/posts.md'）

## 使用方法

### 自動実行
GitHub Actionsにより毎週金曜日18:30 JSTに自動実行されます。

### 手動実行
ワークフローを手動で実行する場合：
1. GitHubリポジトリのActionsタブに移動
2. "Discord Clip Bot - Weekly Post"を選択
3. "Run workflow"をクリック

### ローカルテスト
```bash
# 開発モード
npm run cron:post:dev

# 本番モード（ビルド後実行）
npm run build
npm run cron:post
```

## メリット

1. **コスト削減**: サーバーホスティング費用が不要
2. **メンテナンスフリー**: サーバー管理が不要
3. **高い信頼性**: GitHubのインフラによる安定したスケジューリング
4. **スケーラビリティ**: 必要な時のみ実行
5. **監視の容易さ**: GitHub Actionsによる実行ログ提供

## 移行手順

1. GitHub SecretsにDISCORD_TOKEN、CHANNEL_IDを設定
2. 新しいファイルをリポジトリにコミット
3. 従来のサーバーベースデプロイメントを無効化
4. 最初の数回のスケジュール実行を監視

## ロールバック計画

サーバーベース方式に戻す必要がある場合：
1. Railwayデプロイメントを再有効化
2. GitHub Actionsワークフローを削除または無効化
3. 元の`src/index.ts`ファイルはそのまま機能します

## 監視方法

実行状況の確認：
- GitHub ActionsタブでワークフローRunを確認
- 各実行の詳細ログを提供
- 実行失敗時はメール通知（設定した場合）