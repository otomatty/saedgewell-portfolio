# Server Actions: Categories

## 概要

`categories` テーブルに対する Server Actions を定義します。
カテゴリの作成、取得、更新、削除などの操作を提供します。

## Server Actions 一覧

### `createCategory`

**役割**: 新しいカテゴリを作成する

**関数定義**:

```typescript
async function createCategory(name: string, description: string, icon: string): Promise<Category>
```

**引数**:

*   `name` (`string`): カテゴリ名 (必須)
*   `description` (`string`): カテゴリの説明
*   `icon` (`string`): カテゴリアイコン

**返り値**: `Promise<Category>` - 作成されたカテゴリのデータ

**実装例 (`app/actions/contact/categories.ts`)**:

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

*   バリデーションエラー (例: `name` が空) の場合、エラーレスポンスを返す (TODO: エラーレスポンスの形式を定義)
*   データベースエラー (例: UNIQUE制約違反) の場合、エラーレスポンスを返す

---

### `getCategory`

**役割**: IDでカテゴリを取得する

**関数定義**:

```typescript
async function getCategory(id: string): Promise<Category | null>
```

**引数**:

*   `id` (`string`): カテゴリID (UUID)

**返り値**: `Promise<Category | null>` -  カテゴリデータ。存在しない場合は `null`

**実装例 (`app/actions/contact/categories.ts`)**:

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

### `updateCategory`

**役割**: カテゴリ情報を更新する

**関数定義**:

```typescript
async function updateCategory(id: string, name?: string, description?: string, icon?: string): Promise<Category>
```

**引数**:

*   `id` (`string`): カテゴリID (UUID) (必須)
*   `name` (`string`, optional): 更新後のカテゴリ名
*   `description` (`string`, optional): 更新後のカテゴリの説明
*   `icon` (`string`, optional): 更新後のカテゴリのアイコン

**返り値**: `Promise<Category>` - 更新されたカテゴリのデータ

**実装例 (`app/actions/contact/categories.ts`)**:

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

*   バリデーションエラー (例: `name` が空) の場合、エラーレスポンスを返す (TODO)
*   無効な UUID フォーマットの場合、エラーレスポンスを返す (TODO)
*   データベースエラーの場合、エラーレスポンスを返す

---

### `deleteCategory`

**役割**: IDでカテゴリを削除する

**関数定義**:

```typescript
async function deleteCategory(id: string): Promise<Category>
```

**引数**:

*   `id` (`string`): カテゴリID (UUID) (必須)

**返り値**: `Promise<Category>` - 削除されたカテゴリのデータ

**実装例 (`app/actions/contact/categories.ts`)**:

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

### `getAllCategories`

**役割**: 全てのカテゴリを取得する

**関数定義**:

```typescript
async function getAllCategories(): Promise<Category[]>
```

**引数**:  なし

**返り値**: `Promise<Category[]>` - カテゴリデータの配列

**実装例 (`app/actions/contact/categories.ts`)**:

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

*   データベースエラーの場合、エラーレスポンスを返す

---

**備考**:

*   `Category` 型定義は `types/contact.ts` で定義する (TODO)。
*   エラーレスポンスの形式、共通エラーハンドリング関数 (`utils.ts` に実装予定) については、別途定義する (TODO)。
*   RLSポリシーについては、管理者機能の実装範囲に合わせて、詳細を検討する (TODO)。
*   各 Server Action の実装、使用例は TODO コメントとして記述。後で実装する。

---
