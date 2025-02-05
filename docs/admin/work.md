# 実績管理機能

実績管理機能は、ポートフォリオサイトの実績を管理するための機能です。
実績の基本情報、詳細情報、技術スタック、担当業務、課題と解決策、成果、画像ギャラリーなどを管理することができます。

## 1. 画面構成

### 1.1 実績一覧ページ (`/admin/works`)

実績の一覧を表示し、基本的な管理機能を提供します。

#### 機能
- 実績の一覧表示（テーブル形式）
  - タイトル
  - カテゴリー
  - ステータス
  - 作成日時
  - 更新日時
  - アクション（編集、削除）
- フィルタリング
  - ステータス（下書き、公開済み、アーカイブ）
  - カテゴリー（企業案件、フリーランス案件、個人開発）
- 検索
  - タイトルによる検索
- 一括操作
  - 一括公開/非公開
  - 一括削除
- 新規作成
  - 新規実績作成ページへの遷移

### 1.2 実績詳細編集ページ (`/admin/works/[id]`)

実績の詳細情報を編集するためのページです。タブ形式で各セクションを管理します。

#### 1.2.1 基本情報タブ
- タイトル（必須）
- 説明（必須）
- スラッグ（必須、一意）
- サムネイル画像（必須）
- カテゴリー（必須）
  - 企業案件
  - フリーランス案件
  - 個人開発
- GitHubリンク（任意）
- Webサイトリンク（任意）
- 公開ステータス
  - 下書き
  - 公開済み
  - アーカイブ

#### 1.2.2 詳細情報タブ
- プロジェクト概要（必須）
- 担当役割（必須）
- プロジェクト期間（必須）
- チーム規模（必須）

#### 1.2.3 技術スタックタブ
- 使用技術の管理
  - 技術の追加/削除
  - 技術の並び替え
- 技術の選択（マルチセレクト）
- 技術カテゴリーによるフィルタリング

#### 1.2.4 担当業務タブ
- 担当業務リスト
  - 説明（必須）
  - 並び順
- 担当業務の追加/編集/削除
- ドラッグ&ドロップによる並び替え

#### 1.2.5 課題と解決策タブ
- 課題リスト
  - タイトル（必須）
  - 説明（必須）
  - 並び順
- 解決策リスト
  - タイトル（必須）
  - 説明（必須）
  - 関連する課題（任意）
  - 並び順
- 課題と解決策の追加/編集/削除
- ドラッグ&ドロップによる並び替え

#### 1.2.6 成果タブ
- 成果リスト
  - 説明（必須）
  - 並び順
- 成果の追加/編集/削除
- ドラッグ&ドロップによる並び替え

#### 1.2.7 画像ギャラリータブ
- 画像リスト
  - 画像URL（必須）
  - 代替テキスト（必須）
  - キャプション（任意）
  - 並び順
- 画像のアップロード
- 画像情報の編集
- 画像の削除
- ドラッグ&ドロップによる並び替え
- プレビュー表示

## 2. コンポーネント設計

### 2.1 共通コンポーネント
```typescript
// src/app/admin/works/_components
- WorksTable: 実績一覧テーブル
- WorkForm: 実績基本情報フォーム
- WorkDetailForm: 詳細情報フォーム
- TechnologySelector: 技術スタック選択
- ResponsibilitiesEditor: 担当業務エディタ
- ChallengesSolutionsEditor: 課題と解決策エディタ
- ResultsEditor: 成果エディタ
- ImageGalleryEditor: 画像ギャラリーエディタ
- SortableList: 並び替え可能なリスト
- ConfirmDialog: 確認ダイアログ
- StatusBadge: ステータスバッジ
```

### 2.2 カスタムフック
```typescript
// src/hooks/works
- useWork: 実績データの取得と更新
- useWorkDetails: 詳細情報の取得と更新
- useWorkTechnologies: 技術スタックの管理
- useWorkImages: 画像の管理
- useSortableList: 並び替え機能の管理
```

## 3. サーバーアクション

### 3.1 実績基本情報
```typescript
// src/app/_actions/works.ts
- getWorks: 実績一覧の取得
- getWorkById: 実績の取得
- createWork: 実績の作成
- updateWork: 実績の更新
- deleteWork: 実績の削除
- updateWorkStatus: 実績のステータス更新
```

### 3.2 詳細情報
```typescript
// src/app/_actions/work-details.ts
- getWorkDetails: 詳細情報の取得
- upsertWorkDetails: 詳細情報の作成/更新
```

### 3.3 技術スタック
```typescript
// src/app/_actions/work-technologies.ts
- getWorkTechnologies: 技術スタックの取得
- updateWorkTechnologies: 技術スタックの更新
```

### 3.4 担当業務
```typescript
// src/app/_actions/work-responsibilities.ts
- getWorkResponsibilities: 担当業務の取得
- createWorkResponsibility: 担当業務の作成
- updateWorkResponsibility: 担当業務の更新
- deleteWorkResponsibility: 担当業務の削除
- updateResponsibilitiesOrder: 並び順の更新
```

### 3.5 課題と解決策
```typescript
// src/app/_actions/work-challenges.ts
- getWorkChallenges: 課題の取得
- createWorkChallenge: 課題の作成
- updateWorkChallenge: 課題の更新
- deleteWorkChallenge: 課題の削除
- updateChallengesOrder: 課題の並び順更新

// src/app/_actions/work-solutions.ts
- getWorkSolutions: 解決策の取得
- createWorkSolution: 解決策の作成
- updateWorkSolution: 解決策の更新
- deleteWorkSolution: 解決策の削除
- updateSolutionsOrder: 解決策の並び順更新
```

### 3.6 成果
```typescript
// src/app/_actions/work-results.ts
- getWorkResults: 成果の取得
- createWorkResult: 成果の作成
- updateWorkResult: 成果の更新
- deleteWorkResult: 成果の削除
- updateResultsOrder: 並び順の更新
```

### 3.7 画像ギャラリー
```typescript
// src/app/_actions/work-images.ts
- getWorkImages: 画像の取得
- uploadWorkImage: 画像のアップロード
- updateWorkImage: 画像情報の更新
- deleteWorkImage: 画像の削除
- updateImagesOrder: 並び順の更新
```

## 4. 実装順序

1. 実績の基本情報の管理
   - 一覧ページ
   - 基本情報フォーム
   - ステータス管理

2. 詳細情報の管理
   - 詳細情報タブ
   - 詳細情報フォーム

3. 技術スタックの管理
   - 技術選択
   - 技術の並び替え

4. 関連情報の管理
   - 担当業務
   - 課題と解決策
   - 成果
   - 並び替え機能

5. 画像ギャラリーの管理
   - 画像アップロード
   - 画像情報編集
   - 並び替え機能
   - プレビュー表示 