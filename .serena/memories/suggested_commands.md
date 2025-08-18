# 開発で使用する推奨コマンド集

## 基本開発コマンド

### セットアップ
```bash
npm install                    # 依存関係インストール
cp .env.example .env          # 環境変数ファイル作成
```

### 開発・実行
```bash
npm run dev                   # 開発モードで実行（ts-node）
npm run build                 # TypeScriptコンパイル
npm start                     # 本番モードで実行（コンパイル後）
```

### テスト関連
```bash
npm test                      # 全テスト実行
npm run test:watch           # テスト監視モード
npm run test:coverage        # カバレッジ付きテスト実行
npm run test:manual          # 手動テスト実行
npm run test:random          # ランダムクリップテスト投稿
```

### コード品質
```bash
npm run lint                  # ESLint実行
npm run lint:fix             # ESLint自動修正
```

## システムコマンド (macOS Darwin)

### 基本的なUnixコマンド
```bash
/usr/bin/git                 # Gitバージョン管理
/bin/ls                      # ファイル一覧
/usr/bin/grep               # テキスト検索
/usr/bin/find               # ファイル検索
/bin/cat                    # ファイル内容表示
/bin/mkdir                  # ディレクトリ作成
/bin/rm                     # ファイル削除
/usr/bin/curl               # HTTP リクエスト
```

### プロジェクト固有の便利コマンド
```bash
# ログ確認
tail -f logs/app.log

# 環境変数確認
cat .env

# データファイル編集
vim data/posts.md

# Dockerコンテナ操作
docker build -t finals-bot .
docker run -d --env-file .env finals-bot

# プロセス確認
ps aux | grep node
```

## 開発ワークフロー

### 新機能開発
1. `git checkout -b feature/新機能名`
2. テスト作成: `npm run test:watch`
3. 実装
4. テスト実行: `npm test`
5. Lint実行: `npm run lint`
6. コミット（Conventional Commits形式）
7. プッシュ・プルリクエスト

### デバッグ
1. `npm run dev` で開発サーバー起動
2. `npm run test:manual` で手動テスト
3. ログ確認で問題特定

### デプロイ
1. `git push origin main`
2. Railway自動デプロイ
3. ヘルスチェック確認: `curl http://localhost:3000/health`