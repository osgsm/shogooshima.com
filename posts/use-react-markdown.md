---
title: 'react-markdown を使って安全に Markdown をレンダリングする'
date: '2022-03-23'
---

このブログは Next.js の公式チュートリアルをもとに作成しています。

ブログ記事は Markdown ファイルで作成し、その Markdown ファイルの内容を HTML 文字列に変換し、 `dangerouslySetInnerHTML` を使って表示させています。

`dangerouslySetInnerHTML` は名前の通り XSS の危険性があって、あまり使うべきでないものです。と言ってもこのブログのように、個人で使うアプリケーションの場合は問題ないですが。

まあ問題がないとは言え、「`dangerouslySetInnerHTML` を使わないに越したことはないよな」と思って色々調べてるうちに `react-markdown` というパッケージを知りました。

これを使った方がいろいろ便利だし、何より勉強になりそうだと思ったので、今回は `react-markdown` を使って Markdown ファイルをレンダリングするように修正していきます。

## `react-markdown` とは

`react-markdown` は、Markdown 文字列を渡すことで、それを React 要素に安全にレンダリングする React コンポーネントです。

ビギナーでも React で安全に Markdown を扱えるようにできることにフォーカスしたパッケージのようです。

ざっくりと特徴をリストアップすると……

- `dangerouslySetInnerHTML` に依存していない
- 仮想 DOM を構築するのにシンタックスツリーを使う
- CommonMark 準拠
- GitHub Flavored Markdown などの構文拡張もサポート
- カスタムコンポーネントを使って出力を変更できる

乱暴に特徴を要約すると「安全でパフォーマンスもよく、拡張にも対応している」といった感じでしょうか。

## なぜ `react-markdown` を使うか

`dangerouslySetInnerHTML` を使わずに安全に Markdown をレンダリングできるからというのはもちろんありますが、個人的な一番の理由は「勉強のため」です。

Next.js 公式チュートリアルでも [Render Markdown - Dynamic Routes | Learn Next.js](https://nextjs.org/learn/basics/dynamic-routes/render-markdown) というセクションがあるのですが、結構サラッとしていて詳しくは解説されていません。

なので、「Next.js のチュートリアルで紹介されているものとは異なる方法を使って、自分で調べたり考えたりしてコードを書いていけば勉強になるじゃん」と思ったわけです。

そんなことをぼんやりと思いながら、冒頭でも書いた `dangerouslySetInnerHTML` を使わない方法を探しているときに `react-markdown` と出会いました。

他にも……

- 導入が簡単
- 利用されてる数が多い
- メンテナンスされている
- 拡張しながら色々学べそう

辺りも採用のポイントです。

## `react-markdown` を使用する

それでは、実際にプロジェクトで使用していきます。

まずはパッケージをインストール。

```bash
yarn add react-markdown
```

### `lib/posts.ts` の修正

修正前のコードは次のようになっています。

```tsx
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

︙

export const getPostData = async (id: string) => {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const matterResult = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    id,
    contentHtml,
    ...(matterResult.data as MatterResultData),
  }
}
```

 本ブログでは、タイトルや投稿日などのメタデータをパースするために `gray-matter` というライブラリを使用しています。

Markdown ファイルのコンテンツを `gray-matter` に渡し、返り値を `matterResult` に格納しています。

`matterResult` には、次のようなメタデータとコンテンツに分けられたオブジェクトが入ります。※値はサンプルです。

```js
{
  content: '\nThis is content.',
  data: {
    title: 'Post title',
    date: '2022-03-23'
  }
}
```

その `matterResult.content` を `remark` と `remark-html` で処理したものを `contentHtml` に格納し `getPostData` の返り値としています。

ただ、今回の修正後は Markdown の処理を `react-markdown` に任せるので、この辺りを修正していきます。

修正後のコードは次のようになります。

```tsx
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

︙

export const getPostData = (id: string) => {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const matterResult = matter(fileContents)
  const contentMarkdown = matterResult.content

  return {
    id,
    contentMarkdown,
    ...(matterResult.data as MatterResultData),
  }
}
```

`matterResult.content` を `remark` や `remark-html` で処理せずに `contentMarkdown` に格納し、それを `getPostData` の返り値としています。

`remark` と `remark-html` は使わないので `yarn remove` で削除しておきましょう。

```bash
yarn remove remark remark-html
```

これで、`lib/posts.ts` の修正は完了です。

### `pages/posts/[id].tsx` を修正

次に `react-markdown` を使うために `pages/posts/[id].tsx` を修正します。

変更前のコードは次のようになっています。

```tsx
type PostProps = {
  postData: {
    title: string
    date: string
    contentHtml: string
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id as string)
  return {
    props: {
      postData,
    },
  }
}

︙

const Post = ({ postData }: PostProps) => {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <meta property="og:title" content={postData.title} key="og-title" />
        <meta property="og:type" content="article" />
      </Head>
      <article>
        <h1 className={utilStyle.headingXl}>{postData.title}</h1>
      </article>
      <div className={utilStyle.lightText}>
        <Date dateString={postData.date} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </Layout>
  )
}
```

`dangerouslySetInnerHTML` を使って、 `postData.contentHtml` を表示している部分を `react-markdown` に置き換えていきます。

変更後は次のようになります。`react-markdown` をインポートするのをお忘れなく。

```tsx
︙
import ReactMarkdown from 'react-markdown'

type PostProps = {
  postData: {
    title: string
    date: string
    contentMarkdown: string
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id as string)
  return {
    props: {
      postData,
    },
  }
}

︙

const Post = ({ postData }: PostProps) => {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <meta property="og:title" content={postData.title} key="og-title" />
        <meta property="og:type" content="article" />
      </Head>
      <article>
        <h1 className={utilStyle.headingXl}>{postData.title}</h1>
      </article>
      <div className={utilStyle.lightText}>
        <Date dateString={postData.date} />
      </div>
      <div>
        <ReactMarkdown>{postData.contentMarkdown}</ReactMarkdown>
      </div>
    </Layout>
  )
}
```

`dangerouslySetInnerHTML` を使っていた部分を `<ReactMarkdown>` コンポーネントに置き換え、子要素として `postData.contentMarkdown` を渡します。

あと、 `Post` コンポーネントの props の型（ `PostProps` ）の内容も修正します。

修正前は `contentHtml: string` だったところを `contentMarkdown: string` に置き換えます。

以上で完了です。

これで、 `react-markdown` を使って、安全に Markdown をレンダリングできるようになりました。

## おわりに

`react-markdown` を使うと、とても簡単に Markdown のレンダリングができますね。

今後はプラグインを導入してみたり、カスタムコンポーネントを使ってシンタックスハイライトを適用してみたり、いろいろと実験してみたいと思っています。

---

参考

- [react-markdown/readme.md at main · remarkjs/react-markdown](https://github.com/remarkjs/react-markdown/blob/main/readme.md)
