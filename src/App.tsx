import { R3FDomAlign, DomItemProps } from "./R3FDomAlign";

const items: Array<DomItemProps> = [
  {
    height: 250,
    title: "1"
  },
  {
    height: 250,
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
    <>
      <R3FDomAlign items={items} />
    </>
  )
}

export default App
