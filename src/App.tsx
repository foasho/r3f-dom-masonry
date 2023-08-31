import { R3FDomAlign, DomItemProps } from "./R3FDomAlign";

const items: Array<DomItemProps> = [
  {
    height: 250,
    element: <div>Sample</div>,
    type: "element",
    // src: "https://picsum.photos/200/300",
  },
  {
    height: 210,
    element: <div>Sample</div>,
    type: "element",
  },
  {
    height: 250,
    element: <div>Sample</div>,
    type: "element",
  },
  {
    height: 250,
    element: <div>Sample</div>,
    type: "element",
  },
  {
    height: 250,
    element: <div>Sample</div>,
    type: "element",
  },
  {
    height: 250,
    element: <div>Sample</div>,
    type: "element",
  },
  {
    height: 250,
    element: <div>Sample</div>,
    type: "element",
  },
];

function App() {
  return (
    <div style={{
      width: "80%",
      height: "100vh",
      margin: "0 auto",
      // paddingTop: "20px",
    }}>
      <R3FDomAlign items={items} />
    </div>
  )
}

export default App
