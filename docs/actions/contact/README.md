# Server Actions (Contact)

## 役割と設計思想

このディレクトリには、お問い合わせチャット機能に関連する Server Actions を配置します。
Server Actions は、クライアントサイドからサーバーサイドの処理 (データベース操作、API呼び出しなど) を安全かつ効率的に行うための仕組みです。

**設計思想:**

*   **CRUD原則**: 各 Server Action は、原則として各テーブルに対する基本的な CRUD (Create, Read, Update, Delete) 操作を提供します。
*   **責務の分離**:  Server Actions は、データ操作ロジックに特化し、ビジネスロジック (例:  チャットAIとの連携、管理者へのエスカレーション処理) は、Server Actions から呼び出すサービスレイヤー (またはユーティリティ関数) に分離します。
*   **型安全**: TypeScript を使用し、引数と返り値の型を厳密に定義することで、型安全性を確保します。
*   **エラーハンドリング**:  Server Actions 内でエラーハンドリングを行い、適切なエラーレスポンスをクライアントに返します。
*   **再利用性**:  複数のコンポーネントから共通の Server Actions を呼び出すことを想定し、再利用性を高めます。
*   **セキュリティ**:  Server Actions はサーバーサイドで実行されるため、クライアントサイドに機密情報 (APIキー、データベース接続情報など) を露出することなく、安全なデータ操作を実現します。また、RLS (Row Level Security) ポリシーと組み合わせることで、データへのアクセス制御を行います。

## ディレクトリ構成と命名規則

```
app/
  actions/
    contact/
      categories.ts        // categories テーブル関連の Server Actions
      faqs.ts              // faqs テーブル関連の Server Actions
      profiles.ts          // profiles テーブル関連の Server Actions
      chats.ts             // chats テーブル関連の Server Actions
      chat-messages.ts     // chat_messages テーブル関連の Server Actions
      files.ts             // files テーブル関連の Server Actions
      utils.ts             // 複数の Server Actions で共通利用するユーティリティ関数 (例: エラーレスポンス生成)
```

*   **ディレクトリ**:  `app/actions/contact`
*   **ファイル名**:  テーブル名 (複数形) をベースに、`.ts` 拡張子で作成 (例: `categories.ts`, `chat-messages.ts`)
*   **関数名**:  CRUD 操作 + テーブル名 (単数形) をキャメルケースで記述 (例: `createCategory`, `getChatMessage`, `updateChatStatus`, `deleteFaq`)
*   **ユーティリティ関数**:  `utils.ts` ファイルにまとめ、必要に応じて名前空間 (例: `ContactActionsUtils.createErrorResponse`) を使用

## Server Actions の共通処理

*   **エラーハンドリング**:  `try...catch` ブロックで囲み、エラー発生時は `utils.ts` で定義するエラーレスポンス生成関数 (`createErrorResponse` など - TODO: 後で実装) を使用して、クライアントにエラー情報を返します。
*   **型定義**:  引数と返り値の型を明確に定義し、`types` ディレクトリに型定義ファイル (`types/contact.ts` など - TODO: 後で作成) を作成して管理します。
*   **認証**:  必要に応じて、Server Actions 内でユーザー認証 (Supabase Auth の `auth()` 関数などを使用) を行い、認可されたユーザーのみが操作を実行できるようにします。 (今回のチャット機能では、未認証ユーザーも利用できるため、認証処理は必要に応じて実装します。)
*   **RLSポリシー**:  データベース操作を行う Server Actions は、必ず RLSポリシーを考慮し、意図しないデータアクセスや操作が行われないように注意します。

## Server Actions の利用方法 (コンポーネントからの呼び出し方)

1.  **Server Action のインポート**:  使用するコンポーネントで、Server Action 関数をインポートします。

    ```typescript
    import { createCategory } from '@/app/actions/contact/categories';
    ```

2.  **Server Action の呼び出し**:  イベントハンドラー (例: ボタンクリック) などから、Server Action 関数を呼び出します。

    ```typescript
    const handleSubmit = async () => {
      try {
        const category = await createCategory(categoryName, categoryDescription, categoryIcon);
        // ... 成功時の処理
        console.log('カテゴリ作成成功:', category);
      } catch (error) {
        // ... エラーハンドリング
        console.error('カテゴリ作成エラー:', error);
      }
    };
    ```

    *   `await` を使用して非同期処理の完了を待ち、`try...catch` ブロックでエラーハンドリングを行います。
    *   Server Action の返り値 (Promise) は、成功時はデータ、エラー時はエラー情報を含むレスポンスを返します。

## 今後のステップ

*   各テーブル (`categories`, `faqs`, `profiles`, `chats`, `chat_messages`, `files`) ごとの Server Actions ドキュメント (`categories.md`, `faqs.md` など) を作成し、各 Server Action の詳細 (関数定義、引数、返り値、実装例など) を記述します。
*   `app/actions/contact` ディレクトリに、各テーブルごとの Server Actions の実装ファイル (`categories.ts`, `faqs.ts` など) を作成します (TODOコメント付きで実装例を記述)。
*   `types/contact.ts` ファイルを作成し、Server Actions で使用する型定義を記述します (TODO)。
*   `utils.ts` ファイルを作成し、Server Actions で共通利用するユーティリティ関数 (エラーレスポンス生成関数など) を実装します (TODO)。
*   コンポーネントから Server Actions を呼び出す実装例を各ドキュメントに追記します (TODOを実装例に置き換え)。

---