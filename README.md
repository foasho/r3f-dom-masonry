# ReactThreeFiber + DomAlignment Masonry

**Storybookデモ↓**

**[Demo](https://main.d3iw6f1p5q2t54.amplifyapp.com/?path=/story/r3fdommasonry--default "Demo")**

## 依存ライブラリ

- Typescript
- React18
- ReactThreeFiber
- Drei

## **参考にさせていただいたソースコード**

1. NakanoMisaki さん: three-dom-alignment

   https://github.com/mnmxmx/three-dom-alignment/tree/master

2. Mr.Renato Pozzi: react-plock

   https://github.com/askides/react-plock?ref=reactjsexample.com

## 起動方法(Usage)

```
npm install r3f-dom-masonry
# or
yarn add r3f-dom-masonry
# or
pnpm install r3f-dom-masonry
```

### Easy Usage

```ts
import { R3FDomMasonry } from 'r3f-dom-masonry';

const items = [
   {
      element: <div>Dom1</div>,
   },
   {
      element: <div>Dom2</div>,
   },
   {
      element: <div>Dom3</div>,
   },
   {
      element: <div>Dom4</div>,
   },
   {
      element: <div>Dom5</div>,
   },
   {
      element: <div>Dom6</div>,
   },
   {
      element: <div>Dom7</div>,
   },
   {
      element: <div>Dom8</div>,
   },
   {
      element: <div>Dom9</div>,
   }
];

function App() {
   return (
      <R3FDomMasonry items={items} />
   );
}
```
