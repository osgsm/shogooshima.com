---
title: 'Next.js で既存のプロジェクトに ESLint を導入する'
date: '2022-02-18'
---

このブログは、 Next.js の公式チュートリアルに沿って作っています。

2022年2月18日の段階では、ほとんど公式チュートリアルを終えたままの状態で、ほとんどカスタマイズしていません。

カスタマイズどころか、ESLint なども導入していません。

ってなわけで、今回は ESLint を導入していこうと思います。

## ESLint のセットアップ

ESLint を使うとダメなコードを指摘してくれます。プログラミングに熟達していなくても、ある程度のコードの質を保てるためとても役立ちます。

それでは、早速導入していきましょう。

Next.js v11.0.0 からは、 ESLint の導入が手軽にできるようになったようです。

> Since version **11.0.0**, Next.js provides an integrated [ESLint](https://eslint.org/) experience out of the box. Add `next lint` as a script to `package.json`:  
> *引用元: [https://nextjs.org/docs/basic-features/eslint](https://nextjs.org/docs/basic-features/eslint)*

`package.json` に次のようにスクリプトを追加して `yarn lint` を実行します。

```json
"scripts": {
  "lint": "next lint"
}
```

すると、ESLint の設定がされていない場合は、次のように質問されます。

```bash
? How would you like to configure ESLint? <https://nextjs.org/docs/basic-features/eslint>
❯  Strict (recommended)
   Base
   Cancel
```

この質問に Cancel 以外で答えると、 `eslint` と `eslint-config-next` が自動的にインストールされ、 `.eslintrc.json` が自動で作成されます。

めちゃくちゃ簡単ですね。

ちなみにこの質問の選択肢には、次のような違いがあります。

- **Strict** – Next.js の基本設定に加えて、より厳しい Core Web Vitals のルールセットを含む ※公式推奨
- **Base** – Next.js の基本設定のみ
- **Cancel** – 自身で設定ファイルを作成したいときに選ぶ

この後に、 `yarn lint` を実行すると、 ESLint が動作するようになります。

ちなみにデフォルトでは、 Next.js は `pages/`, `components/`, `lib/` ディレクトリ内のすべてのファイルに対して ESLint を走らせます。

`yarn lint` を実行し、次のように表示されれば問題なしです。

```bash
✔ No ESLint warnings or errors
```

## ESLint の設定を追加する

次に、よく使われているルールセットを有効化するための設定を行います。  
次の2つのルールセットを継承するための設定を追加していきます。

- `"eslint:recommended"`
- `"plugin:@typescript-eslint/recommended"`

ひとつめは ESLint 推奨、 ふたつめは TypeScript ESLint が推奨するルールセットです。

### `"eslint:recommended"` を追加する

 `.eslintrc.json` の `"extends"`  に `"eslint:recommended"` を追加します。

 ```json
{
  "extends": ["eslint:recommended", "next/core-web-vitals"]
}
```

どのようなルールセットが有効化されるかは、 [List of available rules - ESLint - Pluggable JavaScript linter](https://eslint.org/docs/rules/#possible-problems) からチェックできます。

共有設定を追加したい場合は、 `next/core-web-vitals` の前に追加してください。

なぜなら、 `next/core-web-vitals` では、パーサーやプラグインなどの設定がなされていて、その設定が上書きされないようにする必要があるからです。

公式ドキュメントには次のように書かれています。

> [If you include any other shareable configurations, **you will need to make sure that these properties are not overwritten or modified**.](https://nextjs.org/docs/basic-features/eslint#additional-configurations)

### TypeScript ESLint を導入する

`"eslint:recommended"` の追加が終わったら、 TypeScript 用の推奨ルールを追加します。

[TypeScript ESLint](https://typescript-eslint.io/docs/linting/) のドキュメントによると、まずは次のパッケージをインストールする必要があります。  

```bash
yarn add -D eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

※ただ、`typescript` と `@typescript-eslint/parser` はすでにインストール済みなので、 `@typescript-eslint/eslint-plugin` だけで構いません。

一応それらがインストールされているかをチェックしましょう。  
`yarn list` を使って `"typescript"` にマッチするパッケージがインストールされているか確認します。

```bash
yarn list --pattern="typescript"
yarn list v1.22.17
├─ @typescript-eslint/parser@5.12.0
├─ @typescript-eslint/scope-manager@5.12.0
├─ @typescript-eslint/types@5.12.0
├─ @typescript-eslint/typescript-estree@5.12.0
├─ @typescript-eslint/visitor-keys@5.12.0
├─ eslint-import-resolver-typescript@2.5.0
└─ typescript@4.5.5
```

`@typescript-eslint/parser` が確認できましたね。

では、 `@typescript-eslint/eslint-plugin` をインストールしていきたいのですが、ここでひとつ注意点があります。

公式ドキュメントによると……

> [It is important that you use the same version number for `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`.](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin)

ということで、 `@typescript-eslint/parser` と同じバージョンの `@typescript-eslint/eslint-plugin` をインストールします。

さきほど `yarn list` で確認した通り、バージョンは `5.12.0` です。なので、次のようにインストールします。

```bash
yarn add -D @typescript-eslint/eslint-plugin@5.12.0
```

インストールができたら、そのプラグインを読み込むために `.eslintrc.json` の `"plugins"` に `"@typescript-eslint"` を追加します。

```json
{
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "next/core-web-vitals", "prettier"]
}

```

これで TypeScript ESLint のルールが使えるようになります。

### `"plugin:@typescript-eslint/recommended"` を追加する

次に、`"plugin:@typescript-eslint/recommended"` を `.eslintrc.json` に追加していきます。

`"plugin:@typescript-eslint/recommended"` は、TypeScript ESLint 推奨のルールセットを有効化するための設定です。

`.eslintrc.json` の `"extends"` に追加しましょう。

```json
{
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals"
  ]
}
```

どのようなルールが有効化されるかは、 [typescript-eslint/packages/eslint-plugin at main · typescript-eslint/typescript-eslint](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin#supported-rules) に書かれています。

## ESLint の動作確認をする

以上でひとまず ESLint の設定は完了です。実際の動作を確認してみましょう。  
あえて ESLint に怒られるような記述をしてテストしてみます。

`pages/index.tsx` の適当な箇所に次のコードを追加し、 `yarn lint` を実行してみます。

```tsx
var foo
interface bar {}
```

すると、次のように起こられます。

```bash
./pages/index.tsx
17:1  Error: Unexpected var, use let or const instead.  no-var
17:5  Warning: 'foo' is defined but never used.  @typescript-eslint/no-unused-vars
18:11  Error: An empty interface is equivalent to `{}`.  @typescript-eslint/no-empty-interface
18:11  Warning: 'bar' is defined but never used.  @typescript-eslint/no-unused-vars
```

しっかりと ESLint が動作しているようです。

ESLint の動作については OK ですが、毎回 ESLint を走らせるためのコマンドを打つのは面倒ですよね。

次に紹介する設定を行えば、 Visual Studio Code でのファイル保存時に ESLint が自動で修正してくれます。

## Visual Studio Code で ESLint の設定をする

まずは拡張機能のインストールから。次のリンクからインストールできます。  
[ESLint - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

次に、Visual Studio Code の `settings.json` に次の内容を追加します。

```json
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
},
"editor.formatOnSave": false,
```

`"editor.codeActionsOnSave"` の `"source.fixAll.eslint"` を `true` にすることで、ファイル保存時に修正可能な ESLint エラーが自動修正されます。

また、 ESLint をデフォルトのフォーマッタとしている場合、二重で修正がかからないように `"editor.formatOnSave"` を `false` にしています。

他の設定オプションについて知りたい方は、 [microsoft/vscode-eslint: VSCode extension to integrate eslint into VSCode](https://github.com/microsoft/vscode-eslint) をご覧ください。

では、この状態で、さきほど起こられた `pages/index.tsx` を保存してみます。すると `var` で変数を宣言していた箇所が `let` に自動で書き換わります。

他のエラーについては自動修正ができないのでそのままになります。自動修正できない部分は手動で書き換えましょう。  
今回は試しにコードを追加しただけなので、それらは削除しておきます。

最後に、一応 `eslint-config-next` についても簡単に紹介しておきます。

## `eslint-config-next` の概要

`next lint` の初回実行時にインストールされる `eslint-config-next` には、 Next.js において ESLint を使うために必要なものがすべて含まれているようです。

`eslint-config-next` 内には、次のプラグインのルールセットが含まれています。

- [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [eslint-plugin-next](https://www.npmjs.com/package/@next/eslint-plugin-next)

詳しい内容はこちら [https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js](https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js)

`eslint-plugin-next` というのは、Next.js が提供している ESLint プラグイン。どのようなルールがあるかは、[Basic Features: ESLint | Next.js](https://nextjs.org/docs/basic-features/eslint#eslint-plugin) に書かれています。

## さいごに

基本的に公式ドキュメントや GitHub リポジトリを参考に書いていますが、「ここの解釈が違うよ」とか「もっとこうした方がいいよ」とかあれば、ぜひご指摘ください。

今回 ESLint の導入が終わったので、次は Prettier も導入したいですね。

その辺の設定が終わったら、このブログに機能を追加していけたらなと思っています。

---

参考

- [Basic Features: ESLint | Next.js](https://nextjs.org/docs/basic-features/eslint)
- [vercel/next.js: The React Framework](https://github.com/vercel/next.js)
- [List of available rules - ESLint - Pluggable JavaScript linter](https://eslint.org/docs/rules/)
- [Linting your TypeScript Codebase | TypeScript ESLint](https://typescript-eslint.io/docs/linting/)
- [typescript-eslint/packages/eslint-plugin at main · typescript-eslint/typescript-eslint](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin)
- [microsoft/vscode-eslint: VSCode extension to integrate eslint into VSCode](https://github.com/microsoft/vscode-eslint)
