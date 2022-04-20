---
title: 'Git エイリアスで Git コマンドを省略する'
date: '2022-04-15'
---

Git を使っていると、 `git commit` とか `git status` を何度も何度も打ちますよね。

一回打つだけなら問題ないですが、繰り返し打ってると面倒になります。

「これってどうにかならんもんかね」と思って、ググっていると、 [個人開発者のためのコマンドラインGit使いこなし術. コマンドエイリアス, Commitizen, tig… | by Takuya Matsuyama | 週休７日で働きたい](https://blog.craftz.dog/a-productive-command-line-git-workflow-for-indie-app-developers-a043b56e7e93) という記事に出会いました。

この記事で紹介されている Git エイリアスを使えば、 `commit` とか `status` とかを逐一打たなくてもよくなります。

というわけで、早速 Git エイリアスを導入していきましょう。

## Git エイリアスを追加する

Git エイリアスは、 `git config` を使って設定します。ここでは `git br` と打つと `git branch` になるように設定しています。

```shell
% git config --global alias.br branch
```

Git エイリアスを設定すると、 `.gitconfig` に追記されていきます。中身を見てみると `[alias]` の下に `br = branch` と確認できます。

```shell
% cat ~/.gitconfig

︙
[alias]
  br = branch
```

このように簡単に Git コマンドにエイリアスを追加できます。

これだけでも十分便利ですが、複数の Git コマンドの組み合わせに対して、ひとつのエイリアスを設定することも可能です。

## コマンドの組み合わせに Git エイリアスを設定する

コマンドの組み合わせや外部コマンドに対して Git エイリアスを設定したいときは、コマンドの先頭に `!` を付けます。

例えば、 `git add -A` してから `git commit -a` するまでの一連にエイリアスを設定したいときは次のように設定します。

```text
[alias]
  ︙
  ca = !git add -A && git commit -a
```

これで、 `git ca` と実行するだけで、全てのファイルをインデックスに追加し、全てのファイルをコミットできます。

## 個人的な Git エイリアスの設定

さいごに、個人的な Git エイリアスの設定値を載せておきます。

```.gitconfig
[alias]
  ad = add -u
  br = branch
  cm = commit -m
  l = log --pretty=oneline -n 20 --graph --abbrev-commit
  ps = "!git push origin $(git rev-parse --abbrev-ref HEAD)"
  pl = "!git pull origin $(git rev-parse --abbrev-ref HEAD)"
  rs = restore
  rss = restore --staged
  s = status -s
  sw = switch
  swc = switch -c
```

`ps` と `pl` は、現在使っているブランチ名が自動でセットされるようにしています。

`rev-parse --abbrev-ref HEAD` で現在使っているブランチ名を取得し、 その出力結果を `$(...)` を使って置換しています。

`main` ブランチで作業中なら、 `git push origin main` に、 `feature` ブランチで作業中なら、 `git push origin feature` に、プッシュ先のブランチがセットされるようになっています。

## おまけ

Git エイリアスについては以上ですが、おまけとして、さらにコマンドを短縮する方法を紹介します。

Git エイリアスを使う場合、必ず `git` と打つ必要がありますが、コマンドエイリアスを使えば `git` を `g` に短縮できます。

コマンドエイリアスを設定するには `alias` コマンドを使います。

```shell
% alias g=git
```

ただし、コマンドエイリアスはシェルを終了してしまうと消えてしまうので、いつも使いたい場合は、シェルの設定ファイルに追記する必要があります。

Z Shell を使っている場合は、 `.zshrc` に追記します。 `cat` コマンドを使って入力内容を `.zshrc` に追記します。

```shell
% cat >> ~/.zshrc

alias g="git"
```

これで、 `g` と打つだけで `git` コマンドを実行できます。 `git status` は `g s`になります。素晴らしいですね！

---

参考

- [Git - Git エイリアス](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E5%9F%BA%E6%9C%AC-Git-%E3%82%A8%E3%82%A4%E3%83%AA%E3%82%A2%E3%82%B9)
- [個人開発者のためのコマンドラインGit使いこなし術. コマンドエイリアス, Commitizen, tig… | by Takuya Matsuyama | 週休７日で働きたい](https://blog.craftz.dog/a-productive-command-line-git-workflow-for-indie-app-developers-a043b56e7e93)
- [Git - git-rev-parse Documentation](https://git-scm.com/docs/git-rev-parse#Documentation/git-rev-parse.txt---abbrev-refstrictloose)
