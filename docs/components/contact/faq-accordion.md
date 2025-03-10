# FAQAccordion コンポーネント

## 役割

`FAQAccordion` コンポーネントは、チャットUI内で**よくある質問と回答**をアコーディオン形式で表示するコンポーネントです。
ユーザーの質問内容に関連するFAQを表示し、即座に回答を提供することで、ユーザー体験を向上させます。

## ユーザーフロー

1. **FAQ表示のトリガー**:
   * ユーザーの質問内容に基づいて、LLMが関連するFAQを検出
   * FAQボタンのクリックによるユーザーからの明示的な表示リクエスト

2. **FAQの表示**:
   * 関連性の高いFAQがアコーディオンリストとして表示
   * 各FAQは質問（アコーディオンヘッダー）と回答（アコーディオンコンテンツ）で構成

3. **FAQの操作**:
   * アコーディオンヘッダーをクリックすると回答が展開/折りたたみ
   * 複数のFAQを同時に展開可能

4. **回答の活用**:
   * 表示された回答で解決しない場合は、チャットでの質問を継続可能
   * 回答内容をチャットメッセージとして引用することも可能

## 関連コンポーネント

### 親コンポーネント
* **`ContactChat`**: FAQAccordionを表示・制御する親コンポーネント

### 子コンポーネント
* **`Accordion` (shadcn/ui)**: アコーディオンUIの基本コンポーネント
* **`AccordionItem` (shadcn/ui)**: 個々のFAQ項目を表示するコンポーネント

## 実装TODO

* [ ] `FAQAccordion` コンポーネントの作成 (TypeScript, React)
* [ ] FAQ データの型定義
* [ ] アコーディオンUIの実装 (shadcn/ui の `Accordion` コンポーネントをベース)
* [ ] FAQ検索・フィルタリング機能の実装
* [ ] LLMによる関連FAQ検出ロジックの実装
* [ ] FAQの表示/非表示アニメーションの実装
* [ ] FAQコンテンツのマークダウン対応
* [ ] チャットメッセージへのFAQ引用機能の実装
* [ ] ストーリーブックによるUI部品確認
* [ ] レスポンシブ対応の検証 