---
title: 'Next.js の OGP 周りを修正する'
date: '2022-03-10'
---

前回の記事でもお話したように、このブログはまだまだ未完成です。
ほぼチュートリアルに沿って作っただけなので改善の余地がたくさんあります。

なので、このブログを改善していきながら Next.js について学んでいき、その過程を共有していこうと思っています。

同じく Next.js をこれから学んでいきたい人や「チュートリアルに沿ってブログを作ったけどこれから何をしたらいいんだろう？」と悩んでいる方の役に立てたら嬉しいです。

それでは早速本題です。

今回は OGP 周りを修正していきます。

## 現状の課題

画像の部分は一旦置いておくとして、現状の OGP 周りには次の課題があります。

- タイトルが投稿名になっていない
- URL が投稿のものになっていない

[The Open Graph protocol](https://ogp.me/) のページによると、必要なプロパティのは次の4つだそうです。

- `og:title`
- `og:type`
- `og:image`
- `og:url`

Next.js の公式チュートリアルでは、 `og:type` と `og:url` は設定していないので、それらも新たに設定していきます。

## 実際に修正していく

### `og:title` を投稿名にする

今回は投稿の `og:title` を変更したいので、`Post` コンポーネントを修正します。  
`pages/posts/[id].tsx` を開き、 `<Head>` タグ内に `og:title` を加えます。

```tsx
︙
const Post = ({ postData }: PostProps) => {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <meta property="og:title" content={postData.title} />
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
︙
```

これで、 `og:title` が投稿タイトルになります。が、このままだと `og:title` が重複してしまいます。

![og:title の重複](/images/double-og-title.jpg)

このブログでは、全ページで `Layout` コンポーネントを使い回していて、そこでも `og:title` を指定しています。そのため、重複してレンダリングされるというわけです。

これを防ぐためには `key` プロパティを使います。この対策方法については[公式ドキュメント]((https://nextjs.org/docs/api-reference/next/head))にも書かれています。

`Layout` コンポーネント側は次のように設定し、

```tsx
︙
<meta property="og:title" content={siteTitle} key="og-title" />
︙
```

`Post` コンポーネント側は次のように設定します。

```tsx
︙
<meta property="og:title" content={postData.title} key="og-title" />
︙
```

これで、重複がなくなります。

### `og:type` を設定する

`og:type` は、ページのタイプを指定するものです。  
今回はルートページには `website` 、投稿ページには `article` を指定します。

指定できるタイプについては、 [The Open Graph protocol](https://ogp.me/#types) のページで確認できます。

ルートページの修正は、 `pages/index.tsx` の `Home` コンポーネントで行います。  
`<Head>` タグ内に `og:type` を加えます。

```tsx
︙
const Home = ({ allPostsData }: HomeProps) => {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
        <meta property="og:type" content="website" />
      </Head>
      ︙
    </Layout>
  )
}
︙
```

投稿ページの修正は、`pages/posts/[id].tsx` の `Post` コンポーネントで行います。  
同じく `<Head>` タグ内に `og:type` を加えます。

```tsx
︙
const Post = ({ postData }: PostProps) => {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <meta property="og:title" content={postData.title} key="title" />
        <meta property="og:type" content="article" />
      </Head>
      ︙
    </Layout>
  )
}
︙
```

これで `og:type` は完了です。

### `og:url` を投稿 URL にする

`og:url` は動的に設定したいので、`router`  オブジェクトを使います。  `router` オブジェクトにコンポーネントからアクセスするためには、 [`useRouter`](https://nextjs.org/docs/api-reference/next/router#userouter) フックを使用します。

`router` オブジェクトとして定義されているものの一覧は、 [公式ドキュメント](https://nextjs.org/docs/api-reference/next/router#router-object)をご確認ください。

今回は `asPath` を使って、ブラウザに表示されるパスを取得し、それを `og:url` の値として使います。

`og:url` の設定は、 `components/layout.tsx` で行います。次のようなコードを追加しました。

```tsx
import { useRouter } from 'next/router'
︙
const siteUrl = 'https://shogooshima.com'
︙
const Layout = ({ children, home }: LayoutProps) => {
  const router = useRouter()
  const path = router.asPath
  const fullUrl = siteUrl + path

  return (
    <div className={styles.container}>
      <Head>
        ︙
        <meta property="og:url" content={fullUrl} key="og-url" />
        ︙
      </Head>
      ︙
    </div>
  )
}
```

まず `useRouter` をインポートし、次に  `siteUrl` として本ブログのルートにあたる URL を指定しています。

そして `Layout` コンポーネント内で `useRouter` を使い、 `asPath` の値を `path` に格納。その値と `siteUrl` を結合し、 `fullUrl` に入れています。

最後に、コンポーネントの `og:url` として `fullUrl` を渡せば完了です。

ルートページの修正後は次のようになります。

![ホームの修正後 og:url](/images/og_home.jpg)

投稿ページは次のようになります。

![投稿の修正後 og:url](/images/og_post.jpg)

## さいごに

以上で最低限の OGP 周りの修正が完了しました。

これらの修正は、 Next.js の仕組みを学ぶために自身で試行錯誤した結果に行き着いたものです。なので、もっとスマートな方法があればご教示いただければ嬉しいです。

[`next-seo`](https://github.com/garmeeh/next-seo) という SEO 関連の管理が簡単にできるプラグインもあるようなので、その辺も試してみたいですね。

---

参考

- [The Open Graph protocol](https://ogp.me/)
- [next/head | Next.js](https://nextjs.org/docs/api-reference/next/head)
- [next/router | Next.js](https://nextjs.org/docs/api-reference/next/router)
- [garmeeh/next-seo: Next SEO is a plug in that makes managing your SEO easier in Next.js projects.](https://github.com/garmeeh/next-seo)
