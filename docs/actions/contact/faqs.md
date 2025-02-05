# Server Actions: FAQs

## 概要

`faqs` テーブルに対する Server Actions を定義します。
FAQ の作成、取得、更新、削除、カテゴリ別FAQ取得などの操作を提供します。

## Server Actions 一覧

### `createFaq`

**役割**: 新しい FAQ を作成する

**関数定義**:

```typescript
async function createFaq(categoryId: string, question: string, answer: string): Promise<Faq>
```

**引数**:

*   `categoryId` (`string`): カテゴリID (UUID) (必須)
*   `question` (`string`): 質問内容 (必須)
*   `answer` (`string`): 回答内容 (必須)

**返り値**: `Promise<Faq>` - 作成された FAQ のデータ

**実装例 (`app/actions/contact/faqs.ts`)**:

```typescript
// TODO: 実装
```

**使用例 (コンポーネント)**:

```typescript jsx
// TODO: 使用例
```

**RLSポリシー**:

*   Adminロールを持つユーザーのみ作成可能 (TODO: RLSポリシーを定義する必要があるか検討)
*   参照は誰でも可能 (`Enable read access for all users` ポリシー)

**エラーハンドリング**:

*   バリデーションエラー (例: `question` が空) の場合、エラーレスポンスを返す (TODO)
*   無効な UUID フォーマット (例: `categoryId`) の場合、エラーレスポンスを返す (TODO)
*   データベースエラーの場合、エラーレスポンスを返す

---

### `getFaq`

**役割**: IDで FAQ を取得する

**関数定義**:

```typescript
async function getFaq(id: string): Promise<Faq | null>
```

**引数**:

*   `id` (`string`): FAQ ID (UUID)

**返り値**: `Promise<Faq | null>` - FAQ データ。存在しない場合は `null`

**実装例 (`app/actions/contact/faqs.ts`)**:

```typescript
// TODO: 実装
```

**使用例 (コンポーネント)**:

```typescript jsx
// TODO: 使用例
```

**RLSポリシー**:

*   誰でも参照可能 (`Enable read access for all users` ポリシー)

**エラーハンドリング**:

*   無効な UUID フォーマットの場合、エラーレスポンスを返す (TODO)
*   データベースエラーの場合、エラーレスポンスを返す

---

### `updateFaq`

**役割**: FAQ 情報を更新する

**関数定義**:

```typescript
async function updateFaq(id: string, categoryId?: string, question?: string, answer?: string): Promise<Faq>
```

**引数**:

*   `id` (`string`): FAQ ID (UUID) (必須)
*   `categoryId` (`string`, optional): 更新後のカテゴリID
*   `question` (`string`, optional): 更新後の質問内容
*   `answer` (`string`, optional): 更新後の回答内容

**返り値**: `Promise<Faq>` - 更新された FAQ のデータ

**実装例 (`app/actions/contact/faqs.ts`)**:

```typescript
// TODO: 実装
```

**使用例 (コンポーネント)**:

```typescript jsx
// TODO: 使用例
```

**RLSポリシー**:

*   Adminロールを持つユーザーのみ更新可能 (TODO: RLSポリシーを定義する必要があるか検討)

**エラーハンドリング**:

*   バリデーションエラー (例: `question` が空) の場合、エラーレスポンスを返す (TODO)
*   無効な UUID フォーマットの場合、エラーレスポンスを返す (TODO)
*   データベースエラーの場合、エラーレスポンスを返す

---

### `deleteFaq`

**役割**: IDで FAQ を削除する

**関数定義**:

```typescript
async function deleteFaq(id: string): Promise<Faq>
```

**引数**:

*   `id` (`string`): FAQ ID (UUID) (必須)

**返り値**: `Promise<Faq>` - 削除された FAQ のデータ

**実装例 (`app/actions/contact/faqs.ts`)**:

```typescript
// TODO: 実装
```

**使用例 (コンポーネント)**:

```typescript jsx
// TODO: 使用例
```

**RLSポリシー**:

*   Adminロールを持つユーザーのみ削除可能 (TODO: RLSポリシーを定義する必要があるか検討)

**エラーハンドリング**:

*   無効な UUID フォーマットの場合、エラーレスポンスを返す (TODO)
*   データベースエラーの場合、エラーレスポンスを返す

---

### `getFaqsByCategory`

**役割**: カテゴリIDで FAQ のリストを取得する

**関数定義**:

```typescript
async function getFaqsByCategory(categoryId: string): Promise<Faq[]>
```

**引数**:

*   `categoryId` (`string`): カテゴリID (UUID) (必須)

**返り値**: `Promise<Faq[]>` - FAQ データ

**実装例 (`app/actions/contact/faqs.ts`)**:

```typescript
// TODO: 実装
```

**使用例 (コンポーネント)**:

```typescript jsx
// TODO: 使用例
```

**RLSポリシー**:

*   誰でも参照可能 (`Enable read access for all users` ポリシー)

**エラーハンドリング**:

*   無効な UUID フォーマットの場合、エラーレスポンスを返す (TODO)
*   データベースエラーの場合、エラーレスポンスを返す

---


### `getFaqsByCategory`

**役割**: カテゴリIDで FAQ のリストを取得する

**関数定義**:

```typescript
async function getFaqsByCategory(categoryId: string): Promise<Faq[]>
```

**引数**:

*   `categoryId` (`string`): カテゴリID (UUID) (必須)

**返り値**: `Promise<Faq[]>` - FAQ データ

**実装例 (`app/actions/contact/faqs.ts`)**:

```typescript
// TODO: 実装
```

**使用例 (コンポーネント)**:

```typescript jsx
// TODO: 使用例
```

**RLSポリシー**:

*   誰でも参照可能 (`Enable read access for all users` ポリシー)

**エラーハンドリング**:

*   無効な UUID フォーマットの場合、エラーレスポンスを返す (TODO)
*   データベースエラーの場合、エラーレスポンスを返す

---
    