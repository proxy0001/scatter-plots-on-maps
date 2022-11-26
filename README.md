
## 前言

做個基於地圖的散佈圖 Side Project 來學習新工具，主要用到 React, TypeScript, Tailwind, mapbox, deck.gl 這幾個。

## 目標
- 學習使用新工具建構應用
- 針對大量資料進行效能優化

### 次要目標
此次的主要目標是個人學習新工具，因此將團隊規範與後續維護放在次要目標，主要目標完成再考慮回來進行。

- 建構協作規範如: Coding Style, Lint, etc
- 建構測試如: Unit Test, Integrated Testing, etc


## 規劃
- 先用少量資料做一個可以運作的版本，熟悉一下 React, TypeScript, Tailwind CSS 的寫法
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

最後選擇直接上 Nuxt.js + Tailwind CSS，用了一下 create-react-app + Tailwind，還是有一些小地方要自己處理，反而直接照著 [Install Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs) 走完，就把我要的東西都建置好了，~~順便直接變成全端框架~~。除了不小心多了 Next，其他 React, TypeScript, Eslint, Tailwind CSS 就都搞定了，後端資料的部分，到時候也可以直接用 Nuxt 做。

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

### Day 2

自己寫一個 Multi Range Slider Component，初步熟悉一下 React 跟 TypeScript 的實作結合以及 ...CSS，然後就花了一整天。

#### 如何自製 Multi Range Slider？
參考這篇文章 [Building a Multi-Range Slider in React From Scratch](https://dev.to/sandra_lewis/building-a-multi-range-slider-in-react-from-scratch-4dl1)，研究他的思路自己做一個。

拖拉的按鈕直接借用原生 Range Input 來實現，就是把兩個 Range Input 疊在一起，產生兩個拖拉的按鈕。使用 pointer-events: none 讓上層的事件觸發無效，然後用偽元素選擇到瀏覽器實現的拖拉按鈕，設置 pointer-events: all 。到此就實現了兩個可以拖拉的按鈕。詳細參考[這篇](https://www.minwt.com/webdesign-dev/css/20208.html)以及[這篇](https://www.oxxostudio.tw/articles/201503/html5-input-range-style.html)改變樣式的方法

剩下的邏輯跟畫面，大致上就可以自己實現了。他的版本還用到了 useRef, useEffect, useCallback 等對 DOM 進行操作或是等待 state 更新之後再進行資料操作，感覺比較複雜。自己實現的版本只需要用到 useState 就可以了，先把要做的資料操作函式定義好，輸入接受 state，直接綁在 JSX 裡面即可。

#### 初步使用 React + TypeScript 的心得

React 16.8 之後，就不用寫 Class 了，一律寫 Functional Component 即可。要注意 state 不會立即更新，會等到 comonentDidUpdate 之後才會更新，一般要寫 Callback 或是使用 useEffect 去監聽 state 的變化。詳細可以看官網或是這篇 [Why React doesn’t update state immediately](https://blog.logrocket.com/why-react-doesnt-update-state-immediately/)。以及在 React 中，組件要影響父層組件的話，習慣是直接傳入函式給子組件，而不是由子組件 Emit Event 出來給父層。React 的實踐方式跟最佳解，隨著版本迭代，有很多不同，查找資料時要特別注意。例如[這篇](https://pjchender.blogspot.com/2020/07/typescript-react-using-typescript-in.html)提到的，不再建議使用 React.FC。

TypeScript 一開始用會非常不習慣，因為有好多東西不熟悉，不先搞懂 Code 就會動不了。定義函式跟複雜的資料結構的型別時，比較複雜，還要多熟悉情境應用跟 TypeScript 的功能。

- useState 這個 Hook 的型別定義可以了解一下
- 有很多原生常用的格式，例如 HTML 的 Input Change Event，透過 IDE 滑鼠移上去可以看型別定義。
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) 很有幫助！
- Compoenent Props 跟 default value 的定義方式，在看了[這篇](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/default_props)跟[這篇](https://pjchender.blogspot.com/2020/07/typescript-react-using-typescript-in.html)跟[這篇](https://stackoverflow.com/questions/37282159/default-property-value-in-react-component-using-typescript)之後，自己目前是這樣寫：

``` typescript
interface MultiRangeSliderProps {
    min?: number
    max?: number 
    onChange?: (min: number, max: number) => void
    format?: (val: number) => string
}
const MultiRangeSlider = ({
    min: defaultMin = 0,
    max: defaultMax = 60 * 24,
    onChange,
    format
}: MultiRangeSliderProps) => {
    const [min, setMin] = useState<number>(defaultMin)
    const [max, setMax] = useState<number>(defaultMax)
    ...
}
```

#### 其他收穫
- [字符串補全可用 padStart, padEnd](https://kknews.cc/code/empkroq.html)
- [ES6 exporting/importing in index file](https://stackoverflow.com/questions/34072598/es6-exporting-importing-in-index-file)
- [不要直接改變 state](https://stackoverflow.com/questions/37755997/why-cant-i-directly-modify-a-components-state-really)

### Day 3

#### 改 checkbox 的原生樣式
希望樣式統一，就想著也把 checkbox 改一下樣式，就開始研究怎麼修改原生 checkbox 的 style，主要思路參考[這篇](https://stackoverflow.com/questions/4148499/how-to-style-a-checkbox-using-css)，但實際樣式自己改了一版。方法是把原生的藏起來，然後用偽元素 :before 畫一個新的，有這幾種狀態變化： :checked, :disabled, :not(:disabled):hover。
- 藏起來現在可以使用 appearance: none 實現，比較簡單。
- 偽元素的樣式調整起來好不順，主要卡在了 content 有值跟沒值時，高度一直變來變去，後來受不了，直接都讓他有值，改用文字顏色控制勾勾的顯示與否。

#### 做一個 Panel Component
這個很簡單，主要是要了解 Vue 的 slot 在 React 中的實現思路。React 本身會把被 Component 包起來的 JSX 傳入該 Component，可以從 Props.children 取得，然後直接 Render 出來。就這個範例來說，只需要了解 children 的 type 就好了。參考[這篇](https://www.carlrippon.com/react-children-with-typescript/)，直接定義為 ReactNode 就好。
```typescript
interface PanelProps {
    title?: string,
    children?: React.ReactNode,
}
const Panel = ({ title = '', children }: PanelProps) => {
    return <div className="my-2">
        <legend className="text-lg pt-2 pb-4">{title}</legend>
        {children}
    </div>
}
```

#### 第一次用 mapbox 作地圖呈現!

有兩種作法，一種是參考官網的文件直接用 mapbox-gl 實作，一種是用 react-map-gl。這裡使用 react-map-gl 來建構，項目是 Uber 的團隊建立的，主要是用起來比較方便，缺點是相關資料較少，很容易都只搜尋到 mapbox-gl 的範例，不論是哪個，其實比較靠譜的還是只有官方的 Docs 跟 Examples，一旦官網沒提到，就有點難查。

照著範例建立 Map，第一個範例參考[這個](https://visgl.github.io/react-map-gl/docs/api-reference/map)

首先要先有 mapboxAccessToken，去 mapbox 官網註冊即可，然後將 token 放在環境變數裡傳入。[這裡](https://visgl.github.io/react-map-gl/docs/get-started/mapbox-tokens)寫說可以直接建立環境變數就可以用了，但我們用的是 Next.js，它定義的那兩個名稱不能直接抓到，所以就乖乖自己傳入了。參考[Next.js 官網說明](https://www.nextjs.cn/docs/basic-features/environment-variables)設定，暴露給瀏覽器，就可以在 process.env 底下取得你的變量了。

mapStyle 可以挑自己喜歡的，有 [online gallery](https://www.mapbox.com/gallery/)，但連結到底在哪 🙄

照著[這裡](https://visgl.github.io/react-map-gl/docs/api-reference/map)設置一些事件，當使用者移動、縮放的時候可以取得 viewState 的變化，做相對應的事情。或是透過 vscode 直接跳進去看 react-map-gl 的原始碼也可以，這時候忽然發現 TypeScript 的好處就是查找原始碼的定義很方便，缺點就是一定要打破沙鍋問到底，把格式定義確認清楚 code 才能動，搞起來也是費勁。

一開始還不太知道一些要用的 Type 要去哪裡引入，找了半天，原來大部分都可以直接從 react-map-gl 直接取得。

```typescript
import { Map, ViewStateChangeEvent, Source, SourceProps, Layer, LayerProps } from 'react-map-gl'
```

開始準備把資料丟到 Map 裡，首先是怎麼放入資料？ mapbox-gl 的設計上，資料是透過 addSource 放入 Map， Source 是專門提供資料用的，要顯示的話，要另外設置 Style Layer 去顯示，好處是同一個 Source 就可以用不同的顯示方式呈現，範例如[這個](https://docs.mapbox.com/mapbox-gl-js/example/geojson-line/)，然後 react-map-gl 的範例是[這個](https://visgl.github.io/react-map-gl/docs/api-reference/source)，詳細解說可以看[這篇](https://www.lostcreekdesigns.co/writing/a-complete-guide-to-sources-and-layers-in-react-and-mapbox-gl-js/)。

接著定義資料，看範例基本上都是用 GeoJSON ，一種專門處理地理資訊(GIS) 結構的JSON 標準格式。從 Map 的定義裡面往下查找，可以發現 GeoJSON 這個格式定義，這個檔案實體上是放在 node_modules/@types/geojson/index.d.ts，那要怎麼引入呢？直接 import from 'geojson'，原理看這個 [How TypeScript resolves modules](https://www.typescriptlang.org/docs/handbook/module-resolution.html#how-typescript-resolves-modules)
    ```typescript
    import { FeatureCollection } from 'geojson'
    ```

終於可以在地圖上顯示出資料點了！

#### 其他小收穫
- [HTML fieldset](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/fieldset)
- [Types vs. interfaces in TypeScript](https://blog.logrocket.com/types-vs-interfaces-in-typescript/)
    - Interfaces are better when you need to define a new object or method of an object.
    - Types are better when you need to create functions.

### Day 4
開始試著把所有資料都顯示出來，並且根據資料做些顯示上的差異。第一是要如何比較好的進行資料呈現的初始化？第二個問題是根據資料不同改變顯示方式。

#### 初始的 viewState 要如何不寫死，而是根據資料自動進行初始化？
一開始先自己算中心點，但這樣不容易計算正確的 zoom 是多少，感覺這應該是很常見的需求，於是開始找範例。首先可以先看看[這個](https://visgl.github.io/react-map-gl/examples/zoom-to-bounds)，進去 github 看 code 用到了幾個東西，第一個是 Map 的 Prop initialViewState，第二個是 mapRef.current.fitBounds 這個方法。但這個範例是要點擊之後，才自動根據給予的 Bounds 進行 fit，但我們希望的是 init 的時候便自動根據資料進行 fit。然後找半天最後乖乖去看 Map 的定義，發現 initialViewState 有擴充這兩個 props: bounds 跟 fitbBoundsOptions，於是再回去官網文件看這兩個的解釋，在[這裡](https://visgl.github.io/react-map-gl/docs/api-reference/map#initialviewstate)，不太好找。

基本上就是要提供一組範圍邊界，type 可以直接從 react-map-gl 引入，有兩種支援的格式如下：
```typescript
    // 第一種
    // 第一位放 sw, 最西南的座標
    // 第二位放 ne, 最東北的座標
    [[longitude, latitude],[longitude, latitude]] 
    // 第二種
    // 東南西北都是數字，應該也是經緯度的四個最大、最小值
        [west, south, east, north] 
```

接著 fitbBoundsOptions 可以放一些其他的設定，這裡只用了 paading 而已。最後根據資料自已算一下 bounds 的四個值，一起丟入即可。

#### mapRef
之後實作互動，應該還是需要用到 map 的 ref，所以也先設置起來。但 useRef<MapRef>()，綁上去 map 的 ref 時，一直告訴我型別錯誤，後來初始化放了 null 進去就可以了，總覺得怪怪的，但先這樣。

```typescript
    const mapRef = useRef<MapRef>(null)
    return <Map ref={mapRef} />
```

#### 接下來是根據資料改變 circle 的顏色！
首先根據格式定義將其他屬性放到 properties 裡面，然後照著這個[範例](https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/)學習設置，主要就是看 paint 的部分，然後去找 react-map-gl 對應的輸入格式定義即可，但我卡最久的還是在 TypeScript 的各種報錯，當用一些 function 去動態產生 props 的時候，遇到了許多次沒有正確定義好格式的狀況，導致一直需要去查看細節的格式定義是什麼，然後乖乖定義好各個步驟之間的輸入跟輸出的 type，不能有衝突，這部分滿需要加強 TypeScript 的基礎概念的。

然後還自作孽地去導入 tailwind 的 colors，動態產生不同類別的對應顏色，其中一直報錯的地方就是當我們使用 Object.keys() 對 Object 進行 for loop 操作時，使用 obj[key] 去取得對應值時，TypeScript 就會報錯，原因是 string 這個 Type 不能當作索引使用，也就是說我們需要知道 這些 Keys 除了 string 之外的合法 Type。解決方法是，先用 typeof 取得 Ojbect 所有的 types，然後再用 keyof 將其轉換成 union of literal types，就是 Keys 的 Type 了，詳細可以看[這篇](https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b)跟[這篇](https://juejin.cn/post/7023238396931735583)


#### 其他收穫
- [How to import a JSON file in JavaScript (ES6 Modules)](https://bobbyhadz.com/blog/javascript-import-json-file)
- 經緯度的資料通常是長這樣
    ```
    [longitude: max/min +180 to -180,
    latitude: max/min +90 to -90]
    ```

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
