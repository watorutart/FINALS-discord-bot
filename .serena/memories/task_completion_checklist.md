# タスク完了時のチェックリスト

## 必須実行コマンド（順序重要）

### 1. テスト実行
```bash
npm test                     # 全テスト実行
npm run test:coverage       # カバレッジ確認（100%目標）
```
**確認項目**:
- ✅ 全テストがPASS
- ✅ カバレッジが適切（新規コードは100%）
- ✅ テストが日本語で書かれている

### 2. 静的解析
```bash
npm run lint                # ESLint実行
npm run lint:fix           # 自動修正（必要に応じて）
```
**確認項目**:
- ✅ Lint エラーが0件
- ✅ TypeScript型エラーが0件

### 3. ビルド確認
```bash
npm run build              # TypeScriptコンパイル
```
**確認項目**:
- ✅ ビルドエラーが無い
- ✅ dist/ ディレクトリに正常な出力

### 4. 手動テスト（必要に応じて）
```bash
npm run test:manual        # 統合テスト実行
```

## TDD準拠チェック

### Red-Green-Refactor サイクル
- ✅ テストファーストで実装
- ✅ 最初にテストが失敗することを確認
- ✅ 最小限のコードでテストを通した
- ✅ リファクタリングを実施

### コード品質
- ✅ 単一責任の原則に準拠
- ✅ 依存性注入を適切に実装
- ✅ 外部依存をモック化
- ✅ エラーハンドリングを実装・テスト

## Git コミット前チェック

### コミットメッセージ
- ✅ Conventional Commits形式
- ✅ Gitmoji使用
- ✅ 日本語で記述
- ✅ 形式: `type: emoji 本文`

### 例
```
feat: ✨ ランダムクリップ選択機能を追加
test: ✅ MarkdownParserの異常系テストを追加  
fix: 🐛 Discord投稿時のエラーハンドリングを修正
```

## 品質保証最終確認

### ファイル・ディレクトリ確認
```bash
# 不要ファイルが含まれていないか
ls -la
git status

# テストファイル構造が正しいか
find src -name "*.test.ts" | head -5
```

### 環境設定確認
- ✅ `.env.example` が最新
- ✅ `README.md` が最新の機能を反映
- ✅ 依存関係が `package.json` に正しく記載

## 実行結果例（成功パターン）
```bash
$ npm test
 PASS  src/services/__tests__/discordService.test.ts
 PASS  src/parsers/__tests__/markdownParser.test.ts
 PASS  src/__tests__/app.test.ts

Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        2.5 s
Ran all test suites.

$ npm run lint
✨  Done in 0.8s.

$ npm run build
✨  Done in 3.2s.
```

この全てのステップが完了してから、コミット・プッシュを実行する。