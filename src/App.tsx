import { R3FDomAlign, DomItemProps } from "./components/R3FDomAlign";

const items: Array<DomItemProps> = [
  {
    height: 250,
    element: <div>Sample</div>,
    src: "https://picsum.photos/200/300",
  },
  {
    height: 210,
    element: <div>Sample</div>,
  },
  {
    height: 250,
    element: <div>Sample</div>,
  },
  {
    height: 250,
    element: <div>Sample</div>,
  },
  {
    height: 250,
    element: <div>Sample</div>,
  },
  {
    height: 250,
    element: <div>Sample</div>,
  },
  {
    height: 250,
    element: <div>Sample</div>,
  },
  {
    height: 250,
    element: <div>Sample</div>,
  },
  {
    height: 250,
    element: <div>Sample</div>,
  },
  {
    height: 250,
    element: <div>Sample</div>,
  },
  {
    height: 250,
    element: <div>Sample</div>,
  },
];

export const App = () => {
  return (
    <div
      style={{
        width: "80%",
        height: "100vh",
        margin: "0 auto",
      }}
    >
      <R3FDomAlign items={items} />
    </div>
  );
};
