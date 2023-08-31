import { R3FDomAlign, DomItemProps } from "./R3FDomAlign";

const items: Array<DomItemProps> = [
  {
    height: 250,
    title: "1"
  },
  {
    height: 210,
    title: "2"
  },
  {
    height: 250,
    title: "3"
  },
  {
    height: 250,
    title: "4"
  },
  {
    height: 250,
    title: "5"
  },
  {
    height: 250,
    title: "6"
  },
  {
    height: 250,
    title: "7"
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
