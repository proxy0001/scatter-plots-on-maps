
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


## 第一週小結

[Online Demo](https://scatter-plots-on-maps.vercel.app/)
基本只完成了第一個目標：學習使用新工具建構 Scatter Map，第二個目標都沒有動到。幾個心得如下：
1. TypeScript 是大魔王，要找時間好好學習。
2. Tailwind 用起來很方便，但是那個 style 都擠在 class 裡面，不太好看，也很容易跟其他東西搞在一起。有些情況用 css 處理感覺還是比較順手，寫作風格還要再想一下。可以將 style 進行模組化，但目前沒太多琢磨這塊。
3. React 的生命週期與原理可以再看熟悉一點。


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

另外把 value 呈現的 format 開放出來可以自定義。
```javascript
<MultiRangeSlider min={periodConfig.min} max={periodConfig.max} name="period"
    onChange={onRangeChange}
    format={val => {
    const hour = (Math.floor(periodConfig.hoursHandler(val))).toString().padStart(2, '0')
    const minute = (periodConfig.minutesHandler(val)).toString().padStart(2, '0')
    return `${hour}:${minute}`
    }}/>
```
配合另外一隻函式，將 unixTimestamp 轉換，放入資料的 properties 裡面，讓之後可以篩選。兩者一起就可以容易地調整成 by hour or by minute 的篩選方式。

```javascript
export const unixTimestampToTimeOfDate = (unixTimestamp: number, unit:TimeUnit = 'minute') => {
    const datetime = new Date(unixTimestamp * 1000)
    const hours = datetime.getHours()
    const minutes = datetime.getMinutes()
    if (unit === 'minute') return hours * 60 + minutes
    if (unit === 'hour') return hours
}
```

根據 time unit 產生 config 設置
```typescript
const periodUnit: TimeUnit = 'hour'
const periodConfig = ((unit: TimeUnit): periodConfig => {
  const periodConfigs = {
    hour: {
      min: 0,
      max: 24,
      unit: 'hour',
      hoursHandler: (v: number) => v,
      minutesHandler: (v: number) => 0
    } as periodConfig,
    minute: {
      min: 0,
      max: 60 * 24,
      unit: 'hour',
      hoursHandler: (v: number) => v / 60,
      minutesHandler: (v: number) => v % 60
    } as periodConfig,
  }
  return periodConfigs[unit]
})(periodUnit)
```

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
```javascript
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

然後導入 tailwind 的 colors，動態產生不同類別的對應顏色時還一直報錯，主要就是當我們使用 Object.keys() 對 Object 進行 for loop 操作時，使用 obj[key] 去取得對應值時，TypeScript 就會報錯，原因是 string 這個 Type 不能當作索引使用，也就是說我們需要知道 這些 Keys 除了 string 之外的合法 Type。解決方法是，先用 typeof 取得 Ojbect 所有的 types，然後再用 keyof 將其轉換成 union of literal types，就是 Keys 的 Type 了，詳細可以看[這篇](https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b)跟[這篇](https://juejin.cn/post/7023238396931735583)

#### 實現 Tooltip
基本上用 react-map-gl 的 [Popup](https://visgl.github.io/react-map-gl/docs/api-reference/popup) 搭配 Map 的 [onMouseMove](https://visgl.github.io/react-map-gl/docs/api-reference/map#onmousemove) 一起實現。另外包了一個 Tooltip，裡面的 Content 由外部提供。有一個地方要注意，在 Map 要指定 interactiveLayerIds ，這裡要放我們畫 Point 的 Layer ID。上面有設置的話，event 裡面就會有一或多個叫 [Feature](https://docs.mapbox.com/help/glossary/features/) 的東西，就是我們現在碰到的 Points。然後將當前的座標位置記錄下來，傳給 tooltip 讓他知道要基於哪個座標顯示。

用 Popup 的時候，他初始的位置老是跑在很奇怪的地方，搞不太懂為什麼，後來就自己加 CSS 處理了。

```javascript
<Popup
    longitude={position[0]}
    latitude={position[1]}
    offset={[4, -12]}
    anchor="bottom"
    maxWidth={maxWidth}
    className="fixed top-0 left-0 transform-none ..."
/>
```

然後就是 onMouseMove 得到的座標會是當前滑鼠的位置，如果把這個直接傳給 tooltip，就會發生 Tooltip 有點飄離 Point 的感覺。所以後來就加了一層判斷，如果當前的 Feature 跟 之前的一樣，就不要改變位置，並且改從 Feature 裡面拿他的座標，丟給 Tooltip。為了方便判斷，我們輸入 Source 的時候，將 generateId 設為 true, 就可以比較前後的 feature.id 是否一致。

```typescript
const [showTooltip, setShowTooltip] = useState(false)
const [lastId, setLastId] = useState<number | null>(null)
const [tooltipPosition, setTooltipPosition] = useState<Position>([0, 0])

const onMouseMove: (evt: MapLayerMouseEvent) => void = evt => {
    const newFeature: Feature | undefined = evt.features && evt.features[0]
    if (newFeature === undefined) return toggleTooltip(false)
    if (newFeature.id === lastId) return
    const featureId: Feature['id'] = newFeature.id
    const properties: HoverInfo['properties'] = newFeature.properties || {}
    const [lon, lat]: Position = (newFeature.geometry as Point).coordinates
    const geoJsonProperties = newFeature as GeoJsonProperties
    const circleColor = geoJsonProperties && geoJsonProperties.layer.paint['circle-color']
    setTooltipPosition([lon, lat])
    setLastId(newFeature.id as number)
    toggleTooltip(true, { lon, lat, properties, featureId, circleColor })
}

```

#### 其他收穫
- [How to import a JSON file in JavaScript (ES6 Modules)](https://bobbyhadz.com/blog/javascript-import-json-file)
- 經緯度的資料通常是長這樣
    ```
    [longitude: max/min +180 to -180,
    latitude: max/min +90 to -90]
    ```

### Day 5 & 6

主要就是做讓控制項 (Filter) 生效去影響地圖上出現的資料，以及整理 Code，調整一些細節。第一點本身不難做，就是要看一下文檔提供哪些方法，第二點主要是思考如何將邏輯拆分，各司何職。

#### 讓控制項可以篩選資料
看一下官網，mapbox-gl 有提供 Filter 的功能，針對 Layer，可以用他的 expressions 的形式輸入篩選條件，就只會呈現篩選後的資料了。[文檔](https://docs.mapbox.com/help/glossary/filter/)的範例如下：
```javascript
map.addLayer({
  id: layerID,
  type: 'symbol',
  source: 'places',
  layout: {
    'icon-image': symbol + '-15',
    'icon-allow-overlap': true
  },
  filter: ['==', 'icon', symbol]
});
```
我們的情境下，有兩個以上的條件並存，所以還要看多條件的表達方式，[文檔](https://docs.mapbox.com/mapbox-gl-js/style-spec/other/#other-filter)在這，範例如下：
```javascript
[
    "all",
    ["==", "class", "street_limited"],
    [">=", "admin_level", 3],
    ["!in", "$type", "Polygon"]
]
```
然後 react-map-gl 也有支援，依樣畫葫蘆輸入即可，[文檔](https://visgl.github.io/react-map-gl/docs/api-reference/layer)在此。

因此我們的流程就是：
1. 使用者從 UI 上改變條件
2. 將條件轉換成 mapbox-gl 的 expressions 格式
3. 用 setState 紀錄 filter 條件狀態
4. 綁到 Layer 的組件上

最麻煩的是第二點，那個 expressions 的格式比較複雜一點，我們做了一個小幫手 filterProducer 幫我們。小幫手提供增加跟減少條件的方法，回傳最終組合出的 expressions。內部會將條件存著，並處理一些格式上的差異。使用上像這樣：
```javascript
/**
 * 
 * @param idx 條件要放在第幾位，如果對同樣位子增加條件的話，會覆寫該位子的條件。
 * @param args 後面要照 expression 的順序放入，有兩種不同的狀況，如果沒有 key，就放入 undefined。
 *  1. operator, property key, value1, value2 ,...
 *  2. operator, value1, value2, ...
 * @returns 
 */
filterProducer.addFilter(1, 'in', 'country', ...['Taiwan', 'US'])
filterProducer.addFilter(2, '>=', 'timeOfDate', 300)
filterProducer.addFilter(3, '<=', 'timeOfDate', 1000)
```

接下來就是要把一些接口拉出來給外部控制使用。這裡就開始涉及到要怎麼拆分的問題，最主要是讓 ScactterMap 跟資料解耦，不然換一份資料，這個 Component 基本上就不能用了，復用性太糟。最終我們定義的介面如下，還可以更好，但需要再深入多看一下 TypeScript。

我們期待 data 的格式是 array of objects，至於 objects 裡面有哪些 properties，我們希望 ScactterMap 不需要知道，取而代之的是，當要操作這些 properties 時，就會需要使用者提供方法。

```typescript
export interface ScatterMapProps {
    data: any[] // array of objects
    filter?: mapboxgl.Expression // to filter points
    categoryItems?: string[] // In order to make different categories appear in different colors
    categoryName?: string // the key that represent categories in the properties
    getLongitude?: (d: object) => number // how to get logitude from each object in data array
    getLatitude?: (d: object) => number // how to get latitude from each object in data array
    propertiesHandler?: (d: object) => object // convert each object in the data array into properties that will be fed into the point layer in ScatterMap
    children?: React.ReactNode 
    tooltipContent?: React.ReactNode // for the tooltip content
    onMouseOn?: (hoverInfo: HoverInfo) => void // when mouse hover on the point
    onMouseOut?: () => void // when mouse hover out the point
}
```

最後再到 index.tsx 上面，把 controller 的邏輯寫完，基本上都只需要用到 useState 跟 eventHandler 就可以完成。

#### 其他的整理與拆分

上面的 ScatterMap 基本拆好了，剩下的是一些零散的東西，看一下檔案結構還多了哪些
```
- @types
    - app.d.ts // 放一些共用的 Type
- components // 放 components
- utils // 放一些小工具
    - helper // 實在不知道要放哪了，先放這
    - palette // 調色盤，提供 tailwind 內建的顏色組跟一些自定義的方法
```

helper 裡面就一些很單純的工具，例如 rgba -> hex 的轉換，時間格式的顯示方法與轉換方法，以及上面提到的 filterProducer。

palette 本身就只是提供一些顏色組合，但是反而花了超多時間在這個上面，原本想要提供類似 Array 的方式，但東搞西搞，就是搞不出我們希望讓使用者用的方式，最後折衷換一種方式實現。最主要想要提供兩個函式，第一個達成循環取用同一組顏色的效果，第二個是跳著取用顏色的效果。原本是希望提供一個增強的 Array ，讓使用者使用，但後來實在不知道怎麼用 JavaScript Functional Inheritance 的寫法，來自定義一個自己的 Array (不改變原生 Array )，希望改寫 Array[idx] 取用資料的方式，改成循環取用，並且另外提供一個 jumpget 的 Method。是有看到如何用 Class 實現，但基於風格一致性，不太希望用到 Class。最後放棄用 Array 的方式回傳，而是回傳物件具有兩個操作方法，然後用 Proxy 去攔截 array 的 get，將輸入的 index 改為 index % length。

關於這部分的一些參考文章
- [JavaScript Inheritance without ES6 classes](https://rajeshnaroth.medium.com/javascript-inheritance-without-es6-classes-6ff546c0d58b)
- [Getter/setter on javascript array?](https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array)

#### component 一直被調用?

主要就是常常會看到重複的 console.log 被調用感到非常不解，尤其是當 setState 之後。state 改變之後，React Component 就會被調用，然後跑出 console.log。一直以為是自己寫法有問題，但從這篇看起來，好像是一種正常的情況？

[Why does React call my component more times than needed?](https://stackoverflow.com/questions/68666070/why-does-react-call-my-component-more-times-than-needed)

#### 其他收穫
- [rgba2hex 的方法](https://stackoverflow.com/questions/49974145/how-to-convert-rgba-to-hex-color-code-using-javascript): 基本邏輯就是先將 0 ~ 1 的值投影成 0 ~ 255，然後再轉成 16 進位，最後依照 rgba 的順序，拼接起來。大概邏輯是這樣，但還有一些操作沒看得很明白，總之可以用了。
- unixtimestamp 轉換的時候要 * 1000 再用
- getTimezoneOffset 返回格林威治時間和本地時間之間的時差，以分鐘為單位。


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
