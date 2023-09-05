import { R3FDomAlign, DomItemProps } from "./components/R3FDomAlign";

const items: Array<DomItemProps> = [
  {
    height: 250,
    element: <div>Dom1</div>,
  },
  {
    height: 250,
    element: <div>Dom2</div>,
  },
  {
    height: 250,
    element: <div>Dom3</div>,
  },
  {
    height: 250,
    element: <div>Dom4</div>,
  },
  {
    height: 250,
    element: <div>Dom5</div>,
  },
  {
    height: 250,
    element: <div>Dom6</div>,
  },
  {
    height: 250,
    element: <div>Dom7</div>,
  },
  {
    height: 250,
    element: <div>Dom8</div>,
  },
  {
    height: 250,
    element: <div>Dom9</div>,
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
