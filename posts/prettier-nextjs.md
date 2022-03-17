---
title: 'Next.js に Prettier を導入する'
date: '2022-02-28'
---

前回の投稿で ESLint を導入したので、今回は Prettier を導入していきます。  

Prettier を使うとインデントや改行、セミコロンの有無などの記述スタイルを統一できてとても便利です。

ただ、ESLint と Prettier を併用する際は、コンフリクトする部分があるので注意が必要になります。

前置きはその辺にしておいて、早速導入していきましょう。

## Prettier のセットアップ

### パッケージのインストール

ESLint 導入済みの環境に Prettier を加えるためには次の2つのパッケージが必要です。

- `prettier` – Prettier 本体
- `eslint-config-prettier` – Prettier と競合する可能性のある ESLint の各種ルールを無効にする共有設定

```bash
yarn add -D prettier eslint-config-prettier
```

Prettier 本体に加えて、 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) というパッケージが必要なのは、コンフリクトするルールを無効にするためです。

`eslint-config-prettier` のリポジトリには次のように書かれています。

> [Turns off all rules that are unnecessary or might conflict with Prettier.](https://github.com/prettier/eslint-config-prettier#cli-helper-tool)

### ESLint の設定に `prettier` を追加

次に `.eslintrc.json` の `"extends"` に `"prettier"` を追加しましょう。

```json
extends: [
    ︙
  'prettier',
  ],
```

 `eslint-config-prettier` の共有設定を書くのは一番最後にしてください。

これは、 `eslint-config-prettier` が「他と競合するルール設定を上書きして調整するもの」だからです。

公式ドキュメントでも次のように言っています。

> [Then, add "prettier" to the "extends" array in your .eslintrc.* file. Make sure to put it last, so it gets the chance to override other configs.](https://github.com/prettier/eslint-config-prettier)

### コンフリクトするルールがないかチェックする

ちなみに `eslint-config-prettier` には、 CLI のヘルパーツールがあって、それを使うと Prettier とコンフリクトするルールを教えてくれます。

ここでは試しに `.eslintrc.json` にコンフリクトするルールを追加してみます。

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "indent": "error"
  }
}
```

この状態で試しに実行してみます。対象は拡張子が js, jsx, ts, tsx のファイルとします。

```bash
npx eslint-config-prettier '**/*.{js,jsx,ts,tsx}'
```

 すると次のように注意されます。

 ```bash
 The following rules are unnecessary or might conflict with Prettier:

- indent
 ```

ここに挙げられたものは `rules` から削除しておきましょう。`eslint-config-prettier`  を実行後、次のように表示されれば問題なしです。

```bash
No rules that are unnecessary or conflict with Prettier were found.
```

## Prettier の設定

### `.prettierrc` を作成する

まずはファイルを作成し…

```bash
touch .prettierrc
```

ファイルの中身を次のようにします。

```yaml
singleQuote: true
trailingComma: "all"
semi: false
```

この辺はそれぞれの好みやルールがあると思うので [Options · Prettier](https://prettier.io/docs/en/options.html) を参考に適宜調整してください。

### `.prettierignore` を作成

Prettier に無視させたいファイルを `.prettierignore` ファイルにリストアップします。

まずはファイルを作成し…

```bash
touch .prettierignore
```

ファイルの中身は次のようにします。

```text
node_modules
.next
yarn.lock
public
posts
```

### `--check` オプションを使って走らせてみる

一旦この辺で Prettier を走らせてみましょう。

```bash
yarn prettier . --check
```

`.prettierignore` で指定した以外のファイルに対して `--check` オプションを付けて実行します。

`--check` オプションはファイルがきちんとフォーマットされているかどうかをチェックするために使います。

問題がなければ次のように表示されます。

```bash
Checking formatting...
All matched files use Prettier code style!
```

### `package.json` に script を追加

Prettier を実行するための script を `package.json` に 追加します。

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "lint:fix": "next lint -fix",
  "format": "prettier --write ."
}
```

ここでは、`yarn format`  で、`.prettierignore` に記載したもの以外の全てのファイルに対して prettier が走るようにしています。

`--write` というのは、ファイルを書き換えるためのオプションです。これを指定することでルールに反する書き方は自動で書き換えられます。  

他のオプションについては [CLI · Prettier](https://prettier.io/docs/en/cli.html) をご確認ください。

## Visual Studio Code の設定

ここで紹介する Visual Studio Code の設定を行うと、ファイル保存時に Prettier を走らせ、自動フォーマットすることができます。

まずは拡張機能のインストールから。次のリンクからインストールできます。  
[Prettier - Code formatter - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

次に、Visual Studio Code の `settings.json` に次の内容を追加します。

```json
︙
"editor.defaultFormatter": "esbenp.prettier-vscode",
"[javascript]": {
    "editor.formatOnSave": true
},
"[javascriptreact]": {
    "editor.formatOnSave": true
},
"[json]": {
    "editor.formatOnSave": true
},
"[typescript]": {
    "editor.formatOnSave": true
},
"[typescriptreact]": {
    "editor.formatOnSave": true
},
︙
```

`"editor.defaultFormatter"` で、デフォルトのフォーマッタを定義します。  Prettier をデフォルトフォーマッタにしたいので `"esbenp.prettier-vscode"` を指定します。

その後の設定は、保存時に自動フォーマットさせたい言語を指定しています。

前回の ESLint 設定時に `"editor.formatOnSave": false` を指定しているので、それを言語ごとに上書きする形で有効化しています。

設定方法は [Prettier - Code formatter - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) に書かれています。

## Prettier の自動修正を試してみる

では、最後に実験をしましょう。

`pages/index.tsx` の一部をフォーマットされていない状態にしてみます。

```tsx
const Home = ({ allPostsData }: HomeProps) => {
  return (
    <Layout home>
      <Head><title>{siteTitle}</title>      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
<h2 className={utilStyles.headingLg}>Blog</h2><ul className={utilStyles.list}>{allPostsData.map(({ id, date, title }) => (
<li className={utilStyles.listItem} key={id}><Link href={`/posts/${id}`}>
<a>{title}</a></Link><br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}</ul></section></Layout>
  )};
```

Visual Studio Code 上でファイルを保存してみます。

```tsx
const Home = ({ allPostsData }: HomeProps) => {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>{' '}
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}
```

見事にフォーマットされました。 Prettier 恐るべしですね。

## さいごに

前回の ESLint の導入に引き続き、今回も開発環境についての内容でした。

これでようやく環境が整ったので、今後は機能を追加したり、スタイルを整えたりしていこうと思います。

---

参考

- [Basic Features: ESLint | Next.js](https://nextjs.org/docs/basic-features/eslint#prettier)
- [What is Prettier? · Prettier](https://prettier.io/docs/en/index.html)
- [CLI · Prettier](https://prettier.io/docs/en/cli.html)
- [prettier/eslint-config-prettier: Turns off all rules that are unnecessary or might conflict with Prettier.](https://github.com/prettier/eslint-config-prettier)
- [Prettier - Code formatter - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Visual Studio Code User and Workspace Settings](https://code.visualstudio.com/docs/getstarted/settings#_languagespecific-editor-settings)
