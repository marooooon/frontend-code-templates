# 俺の最強pug+scss+js+jquery環境

# node version

v20.3.1

# npm version

9.6.7

# SCSS

## SCSS設計について

- Foundation：ベースとなるCSSやリセットCSSなど。
- Layout：ヘッダーやフッター、共通で使用するレイアウト部分のCSS。
- Component：共通で使用したいパーツ部分のCSS。
- Project：そのページのみで使用する部分のCSS。
- Utility：わずかなスタイル調整のCSS。

## SCSS使用方法

- 基本はBEM記法で進めてください。
- どうしてもUniqueなスタイリング（marginなど）があれば、Utilityから参照してください。
