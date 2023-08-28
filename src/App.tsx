import { R3FDomAlign, DomItemProps } from "./R3FDomAlign";

const items: Array<DomItemProps> = [
  {
    height: 250,
    title: "1"
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
