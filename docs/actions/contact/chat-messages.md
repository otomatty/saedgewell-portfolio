# Server Actions: Chat Messages

## 概要

`chat_messages` テーブルに対する Server Actions を定義します。
チャットメッセージの作成、取得、更新 (部分的な更新 - 例: `faq_id` の紐付け)、削除、チャットID別メッセージ取得などの操作を提供します。

## Server Actions 一覧

### `createChatMessage`

**役割**: 新しいチャットメッセージを作成する

**関数定義**:

```typescript
async function createChatMessage(chatId: string, senderType: SenderType, messageText: string, fileId?: string, faqId?: string, isEscalationRequest?: boolean): Promise<ChatMessage>
```

**引数**:

*   `chatId` (`string`): チャットセッションID (UUID) (必須)
*   `senderType` (`SenderType`): 送信者のタイプ (`'user'`, `'assistant'`, `'admin'`) (必須)
*   `messageText` (`string`): メッセージ本文 (必須)
*   `fileId` (`string`, optional): 添付ファイルID (UUID)
*   `faqId` (`string`, optional): 関連FAQ ID (UUID)
*   `isEscalationRequest` (`boolean`, optional): エスカレーションリクエストフラグ

**返り値**: `Promise<ChatMessage>` - 作成されたチャットメッセージのデータ

**実装例 (`app/actions/contact/chat-messages.ts`)**:

```typescript
// TODO: 実装
```

**使用例 (コンポーネント)**:

```typescript jsx
// TODO: 使用例
```

**RLSポリシー**:

*   認証済みユーザーは、自分のチャットセッションにメッセージを作成可能 (TODO: RLSポリシーを定義する必要があるか検討)
*   管理者 (Adminロール) は全てのチャットセッションにメッセージを作成可能 (TODO: RLSポリシーを定義する必要があるか検討)

**エラーハンドリング**:

*   バリデーションエラー (例: `messageText` が空、`senderType` が不正) の場合、エラーレスポンスを返す (TODO)
*   無効な UUID フォーマット (例: `chatId`, `fileId`, `faqId`) の場合、エラーレスポンスを返す (TODO)
*   データベースエラーの場合、エラーレスポンスを返す

---

### `getChatMessage`

**役割**: IDでチャットメッセージを取得する

**関数定義**:

```typescript
async function getChatMessage(id: string): Promise<ChatMessage | null>
```

**引数**:

*   `id` (`string`): チャットメッセージID (UUID)

**返り値**: `Promise<ChatMessage | null>` - チャットメッセージデータ。存在しない場合は `null`

**実装例 (`app/actions/contact/chat-messages.ts`)**:

```typescript
// TODO: 実装
```

**使用例 (コンポーネント)**:

```typescript jsx
// TODO: 使用例
```

**RLSポリシー**:

*   認証済みユーザーは、自分のチャットセッションのメッセージのみ参照可能 (`Enable read access for authenticated users` ポリシー)
*   管理者 (Adminロール) は全てのチャットメッセージを参照可能 (TODO: RLSポリシーを定義する必要があるか検討)

**エラーハンドリング**:

*   無効な UUID フォーマットの場合、エラーレスポンスを返す (TODO)
*   データベースエラーの場合、エラーレスポンスを返す

---

### `updateChatMessage` (部分更新 - 例: `faqId` 紐付け)

**役割**: チャットメッセージ情報を部分的に更新する (例: FAQ ID を紐付ける)

**関数定義**:

```typescript
async function updateChatMessage(id: string, faqId?: string): Promise<ChatMessage>
```

**引数**:

*   `id` (`string`): チャットメッセージID (UUID) (必須)
*   `faqId` (`string`, optional): 紐付ける FAQ ID (UUID)

**返り値**: `Promise<ChatMessage>` - 更新されたチャットメッセージのデータ

**実装例 (`app/actions/contact/chat-messages.ts`)**:

```typescript
// TODO: 実装
```

**使用例 (コンポーネント)**:

```typescript jsx
// TODO: 使用例
```

**RLSポリシー**:

*   管理者 (Adminロール) のみ更新可能 (TODO: RLSポリシーを定義する必要があるか検討)
*   または、特定の条件 (例:  送信者が assistant または admin) の場合に更新可能 (TODO: RLSポリシーを詳細に検討)

**エラーハンドリング**:

*   無効な UUID フォーマット (例: `id`, `faqId`) の場合、エラーレスポンスを返す (TODO)
*   データベースエラーの場合、エラーレスポンスを返す

---

### `deleteChatMessage`

**役割**: IDでチャットメッセージを削除する

**関数定義**:

```typescript
async function deleteChatMessage(id: string): Promise<ChatMessage>
```

**引数**:

*   `id` (`string`): チャットメッセージID (UUID) (必須)

**返り値**: `Promise<ChatMessage>` - 削除されたチャットメッセージのデータ

**実装例 (`app/actions/contact/chat-messages.ts`)**:

```typescript
// TODO: 実装
```

**使用例 (コンポーネント)**:

```typescript jsx
// TODO: 使用例
```

**RLSポリシー**:

*   管理者 (Adminロール) のみ削除可能 (TODO: RLSポリシーを定義する必要があるか検討)
*   または、特定の条件 (例:  送信者が assistant または admin、かつ一定時間以内のメッセージ) の場合に削除可能 (TODO: RLSポリシーを詳細に検討)

**エラーハンドリング**:

*   無効な UUID フォーマットの場合、エラーレスポンスを返す (TODO)
*   データベースエラーの場合、エラーレスポンスを返す

---

### `getChatMessagesByChat`

**役割**: チャットIDでチャットメッセージのリストを取得する

**関数定義**:

```typescript
async function getChatMessagesByChat(chatId: string): Promise<ChatMessage[]>
```

**引数**:

*   `chatId` (`string`): チャットセッションID (UUID) (必須)

**返り値**: `Promise<ChatMessage[]>` - チャットメッセージデータの配列

**実装例 (`app/actions/contact/chat-messages.ts`)**:

```typescript
// TODO: 実装
```

**使用例 (コンポーネント)**:

```typescript jsx
// TODO: 使用例
```

**RLSポリシー**:

*   認証済みユーザーは、自分のチャットセッションのメッセージのみ参照可能 (`Enable read access for authenticated users` ポリシー)
*   管理者 (Adminロール) は全てのチャットセッションのメッセージを参照可能 (TODO: RLSポリシーを定義する必要があるか検討)

**エラーハンドリング**:

*   無効な UUID フォーマットの場合、エラーレスポンスを返す (TODO)
*   データベースエラーの場合、エラーレスポンスを返す

---

**備考**:

*   `ChatMessage`, `SenderType` 型定義は `types/contact.ts` で定義する (TODO)。
*   エラーレスポンスの形式、共通エラーハンドリング関数 (`utils.ts` に実装予定) については、別途定義する (TODO)。
*   RLSポリシーについては、管理者機能、チャットメッセージの編集・削除機能の実装範囲に合わせて、詳細を検討する (TODO)。
*   各 Server Action の実装、使用例は TODO コメントとして記述。後で実装する。

---
