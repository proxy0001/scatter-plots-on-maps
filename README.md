
## 前言

做個基於地圖的散佈圖 Side Project 來學習新工具，主要用到 React, Typescript, Tailwind, mapbox, deck.gl 這幾個。

## 目標
- 學習使用新工具建構應用
- 針對大量資料進行效能優化

### 次要目標
此次的主要目標是個人學習新工具，因此將團隊規範與後續維護放在次要目標，主要目標完成再考慮回來進行。

- 建構協作規範如: Coding Style, Lint, etc
- 建構測試如: Unit Test, Integrated Testing, etc


## 規劃
- 先用少量資料做一個可以運作的版本，熟悉一下 React, Typescript, Tailwind CSS 的寫法
- 簡單接入大量資料到地圖上呈現，釐清效能狀況
- 參考 Mapbox, deck.gl 的建議進行效能優化
- 確認效能是否有正確提升



## 每日進度紀錄

### Day 0

- 快速研究一下 Mapbox 跟 deck.gl 在幹嘛。
    - [Mapbox](https://www.mapbox.com/): 基於 WebGL 的地圖工具
    - [deck.gl](https://deck.gl/): 基於 WebGL 用來做大量資料的視覺化呈現，經常搭配 WebGL 地圖工具一起使用
- 看了一下官網跟其他人所提到的優化策略
    - [deck.gl Performance Optimization](https://deck.gl/docs/developer-guide/performance)
    - [Improve the performance of Mapbox GL JS maps](https://docs.mapbox.com/help/troubleshooting/mapbox-gl-js-performance/)
    - [algorithmic thinking](https://speakerdeck.com/mourner/fast-by-default-everyday-algorithmic-thinking-for-developers): 減少非必要的記憶體使用、減少非必要的迴圈操作等
    - 最小化資料變更、選擇合適的地方進行資料操作，尤其避免在資料渲染的階段進行。
    - 避免過於複雜的 Layer 渲染，考慮使用疊加 Layer 達成同樣的視覺效果，但數量要控制在百位數內
    - Uncremental Data Loading
    - [Web Worker](https://www.ruanyifeng.com/blog/2018/07/web-worker.html): 前端多線程，會在 Javascript 主線程之外進行。
    - Use [Binary Data](https://blog.techbridge.cc/2017/09/24/binary-data-manipulations-in-javascript/)
- 然後又多了好多個新工具要學習
- 還要研究一下效能檢驗的方式跟指標
- 記錄一下這個學習過程

另外還有一些思路是從更底層翻掉，例如 [mapbox-gl-rs](https://lib.rs/crates/mapboxgl) 是用 Rust 翻寫 mapbox-gl-js，透過編譯成 WebAssembly，在 Web 瀏覽器上以接近原生應用程式的效能運行，但這個專案還在很早期，也離題太遠。倒是在一些計算上有明顯效能瓶頸的地方，或許可以考慮用 WebAssembly 改寫試試？


### Day 1

建立了環境以及看一下 Tailwind 的官方文件，拉了一下簡單的 Layout，把昨天跟今天的筆記都記錄一下。然後就是在沒有 UI Framework 的情況下，有些組件得自己想辦法，列進待辦事項。

#### 環境建置

最後選擇直接上 Nuxt.js + Tailwind CSS，用了一下 create-react-app + Tailwind，還是有一些小地方要自己處理，反而直接照著 [Install Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs) 走完，就把我要的東西都建置好了，~~順便直接變成全端框架~~。除了不小心多了 Next，其他 React, Typescript, Eslint, Tailwind CSS 就都搞定了，後端資料的部分，到時候也可以直接用 Nuxt 做。

### 建構畫面

- 主要畫面呈現地圖
- 旁邊有面板可以設定篩選條件

#### Tailwind

稍微看了一下官網，也試著用了下，感受滿不錯的。
- 作為一個 utility-first 的工具，做得很好。
- 有現成的 Components & Templates 但是基本上需要付費取得。
- 因為粒度很細，全部熟悉一次頗花時間，但不熟悉又寫不出來，有一種在全部重新複習一次 CSS 語法的感覺。
- 寫作上的感覺也有點變化，以往經常會需要為每一層 Eelement 命名 Class，通常會根據 Element 本身的用途命名，再指定 CSS 上去。但現在好像不太一樣了，反而更需要思考，這些只跟 Style 有關的 Classes，他們聚集在一起的抽象概念是什麼？
- 推薦安裝 VS Code Plugin: Tailwind CSS IntelliSense，可以快速搜尋可用的語法

#### 待辦事項增加
- Multi Range Slider
- Tooltip



## Getting Started
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
