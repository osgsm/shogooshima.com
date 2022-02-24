---
title: 'Next.js で既存のプロジェクトに ESLint を導入する'
date: '2022-02-18'
---

このブログは、 Next.js の公式チュートリアルに沿って作っています。

2022年2月18日の段階では、ほとんど公式チュートリアルを終えたままの状態で、ほとんどカスタマイズしていません。

カスタマイズどころか、ESLint なども導入していません。

ってなわけで、今回は ESLint を導入していこうと思います。

以下は、公式ドキュメントを参考に書いているので、もっと詳しく知りたい方は、そちらもチェックしてみてください。

## Next.js に ESLint を導入する

ESLint を使うとイケてないコードを指摘してくれます。コードの品質を保つために役立ちます。

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

```json
? How would you like to configure ESLint? <https://nextjs.org/docs/basic-features/eslint>
❯  Strict (recommended)
   Base
   Cancel
```

この質問に Cancel 以外で答えると、 `eslint` と `eslint-config-next` が自動的にインストールされ、 `.eslintrc.json` が自動で作成されます。

めちゃくちゃ簡単ですね。

ちなみにこの質問の選択肢は次のような違いがあります。

- **Strict** – Next.js の基本設定に加えて、より厳しい Core Web Vitals のルールセットを含む ※公式の推奨
- **Base** – Next.js の基本設定のみ
- **Cancel** – 自身で設定ファイルを作成したいときに選ぶ

この後に、 `yarn lint` を実行すると、 ESLint が動作するようになります。

## `eslint-config-next` の概要

`next lint` の初回実行時にインストールされる `eslint-config-next` には、 Next.js において ESLint を使うために必要なものがすべて含まれているようです。

`eslint-config-next` 内には、次のプラグインのルールセットが含まれています。

- [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [eslint-plugin-next](https://www.npmjs.com/package/@next/eslint-plugin-next)

詳しい内容はこちら [https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js](https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js)

`eslint-plugin-next` というのは、Next.js が提供している ESLint プラグイン。どのようなルールがあるかは、[公式ドキュメント](https://nextjs.org/docs/basic-features/eslint#eslint-plugin)に書かれています。

## `.eslintignore` の作成

デフォルトでは、すべてのファイルに対して ESLint が走ります。

なので、 ESLint を適用したくないファイルは `.eslintignore` に書いておきましょう。

```
**/node_modules/*
**/out/*
**/.next/*
```

## さいごに

以上のように、細かい設定を追加しない場合はとても簡単に ESLint の導入ができます。 Next.js すごいですね。

ESLint のルールの追加や細かい設定は、また今度やってみようと思います。あと Prettier も導入したいですね。

その辺の設定が終わったら、このブログに機能を追加していこうと思います。
