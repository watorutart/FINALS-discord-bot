# 開発規約とコーディングスタイル

## t-wada推奨のテスト駆動開発 (TDD)
プロジェクトは厳格なTDDアプローチを採用

### TDD基本原則
1. **Red-Green-Refactor サイクル**
   - Red: 失敗するテストを書く
   - Green: テストを通す最小限のコードを書く
   - Refactor: コードを改善する

2. **テストファースト**
   - 実装前に必ずテストを書く
   - テストが仕様書の役割を果たす
   - テストが無いコードは書かない

## TypeScript設定 (tsconfig.json)
- **Target**: ES2020
- **Module**: CommonJS
- **Strict Mode**: 有効
- **厳格な型チェック**: 全て有効
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `noImplicitReturns: true`
  - `noFallthroughCasesInSwitch: true`

## ESLint設定
- **Parser**: @typescript-eslint/parser
- **Rules**:
  - `@typescript-eslint/no-unused-vars: error`
  - `@typescript-eslint/explicit-function-return-type: warn`
  - `@typescript-eslint/no-explicit-any: warn`

## テスト規約
### 命名規則
- `describe`: クラス名やモジュール名
- `it`: 具体的な動作を説明
- **テストは日本語で記述**（仕様の明確化）

### テスト構成
- 各ディレクトリに `__tests__/` フォルダ
- テストファイル: `*.test.ts`
- **モック化**: 外部サービスは必ずモック
- **エラーハンドリング**: 全ての異常系をテスト

## 実装原則
1. **単一責任の原則**: 1つのクラスは1つの責任
2. **依存性注入**: 外部依存はコンストラクタで注入
3. **型安全性**: TypeScriptの型システムを最大活用
4. **エラーハンドリング**: 適切な例外処理

## ファイル構造規約
```
src/
├── services/          # ビジネスロジック
├── parsers/           # データ変換
├── __tests__/         # 統合テスト
└── index.ts           # エントリーポイント
```

## Git運用とコミットメッセージ
### Conventional Commits + Gitmoji
- **形式**: `type: emoji 本文`
- **言語**: コミットメッセージは日本語

### 主要なType + Emoji
| Type | Emoji | 説明 |
|------|-------|------|
| `feat` | ✨ | 新機能の追加 |
| `fix` | 🐛 | バグ修正 |
| `test` | ✅ | テストの追加・修正 |
| `refactor` | ♻️ | リファクタリング |
| `docs` | 📝 | ドキュメント更新 |
| `build` | 📦 | ビルド関連 |
| `chore` | 🔧 | その他雑多な変更 |