---
title: 'XML サイトマップを手動で作成する'
date: '2022-03-30'
---

本ブログは、執筆時点では Google にインデックスされていません。

それもそのはずで、このブログのリンクをどこにも貼っていませんし、 XML サイトマップを Google に送信したりもしていません。

Google がこのページにたどり着く術がないので、インデックスされないのは当たり前ですね。

というわけで、今回は手動で XML サイトマップを作成し、 Google に送信するところまでを行っていきたいと思います。

サイトマップを自動で作成してくれるツールもありますが、今回は勉強も兼ねて手動で作っていきます。

## XML サイトマップの書き方

XML サイトマップは、その名の通り XML ファイルです。

まずは簡単なサンプルをお見せします。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 <url>
   <loc>http://www.example.com/foo</loc>
   <lastmod>2022-03-30</lastmod>
 </url>
</urlset>
```

このようにシンプルな構成となっています。

### サイトマップのルール

ファイルは UTF-8 エンコードで作成する必要があり、データ値の `&`, `'`, `"`, `>`, `<` はエスケープする必要があります。

記述ルールは次のようになっています。

- `<urlset>` タグで始め、`</urlset>` タグで閉じる
- `<urlset>`タグ内にネームスペース (プロトコル標準) を指定する
- 各 URL に `<url>` エントリを XML 親タグとして含める
- 各親タグ `<url>`に子エントリ `<loc>` を含める

上記に挙げたもの以外に使用できるタグとして、 `<lastmod>`, `<changefreq>`, `<priority>`  があります。

ただ、Google は `<changefreq>` と `<priority>`  の値を無視するようなので、この2つについての説明は省略します。

### サイトマップで使うタグ

Google が利用するものに限定すると、使用するタグは次の4つになります。

- `<urlset>`
- `<url>`
- `<loc>`
- `<lastmod>`

### `<urlset>`

必須です。ネームスペースを指定します。  
標準のものを使う場合は次のように指定します。

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
```

拡張する場合は次のように指定します。詳しくは [動画サイトマップとサンプル | Google 検索セントラル  |  ドキュメント  |  Google Developers](https://developers.google.com/search/docs/advanced/sitemaps/video-sitemaps?hl=ja) を参考に。

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
   <url>
     <loc>http://www.example.com/videos/some_video_landing_page.html</loc>
     <video:video>
       ︙
     </video:video>
   </url>
</urlset>
```

### `<url>`

必須です。各 URL エントリの親タグ。この中に `<loc>` や `<lastmod>` などを含めます。

### `<loc>`

必須です。ページの URL を指定するもので、 https などのプロトコルから始める必要があります。

### `<lastmod>`

ページの最終更新日。 W3C の [Date and Time Formats](https://www.w3.org/TR/NOTE-datetime) の形式で記述してください。時刻の部分を省略して YYYY-MM-DD の形式でも可。

## XML サイトマップを作成する

本ブログは Next.js を使っているので、サイトマップファイルは `public` ディレクトリ内に作成します。 `sitemap.xml` というファイルを新規作成します。

```bash
touch public/sitemap.xml
```

内容を追加していきます。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://shogooshima.com/</loc>
    <lastmod>2021-03-30</lastmod>
  </url>
  <url>
    <loc>https://shogooshima.com/posts/first-post</loc>
    <lastmod>2021-02-16</lastmod>
  </url>
  <url>
    <loc>https://shogooshima.com/posts/set-up-eslint-nextjs</loc>
    <lastmod>2021-03-02</lastmod>
  </url>
  <url>
    <loc>https://shogooshima.com/posts/prettier-nextjs</loc>
    <lastmod>2021-03-17</lastmod>
  </url>
  <url>
    <loc>https://shogooshima.com/posts/fix-meta-ogp</loc>
    <lastmod>2021-03-17</lastmod>
  </url>
  <url>
    <loc>https://shogooshima.com/posts/use-react-markdown</loc>
    <lastmod>2021-03-24</lastmod>
  </url>
</urlset>
```

## サイトマップを Google に送信する

サイトマップができたら Search Console の [サイトマップ レポート](https://support.google.com/webmasters/answer/7451001#zippy=%2C%E3%82%B5%E3%82%A4%E3%83%88%E3%83%9E%E3%83%83%E3%83%97%E3%81%AE%E9%80%81%E4%BF%A1) を使って、サイトマップを送信します。

サイトマップレポートに移動し、プロパティを選択すると次のような画面に移るので、「新しいサイトマップを追加」欄にサイトマップの場所を入力します。

![サイトマップレポートのサイトマップ URL の入力欄](/images/create-sitemap-manual-1.jpg)

次の画像のように「送信されたサイトマップ」のステータスが「成功しました」になれば OK です。

![サイトマップレポートでサイトマップの送信に成功した状態](/images/create-sitemap-manual-2.jpg)

以上で、 XML サイトマップの作成から Google への送信が完了しました。

## さいごに

今回は勉強のために手動でサイトマップを用意しましたが、手動で管理していくのはやっぱり面倒ですよね。

Next.js では、 `getServerSideProps` を使って動的にサイトマップを生成する手段もあるようなので、ゆくゆくはそのようにしていきたいと思います。

---

参考

- [サイトマップの概要 | Google 検索セントラル  |  ドキュメント  |  Google Developers](https://developers.google.com/search/docs/advanced/sitemaps/overview)
- [サイトマップの作成と送信 | Google 検索セントラル  |  ドキュメント  |  Google Developers](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap)
- [sitemaps.org - プロトコル](https://www.sitemaps.org/ja/protocol.html)
- [XML Sitemaps - Crawling and Indexing | Learn Next.js](https://nextjs.org/learn/seo/crawling-and-indexing/xml-sitemaps)
