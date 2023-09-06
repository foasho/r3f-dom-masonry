import React from "react";
import { R3FDomMasonry, R3FDomMasonryProps } from "./lib";

const getRandomHeight = () => {
  return Math.floor(Math.random() * 320) + 50;
};

const props: R3FDomMasonryProps = {
  items: [
    {
      height: getRandomHeight(),
      element: <div>Dom1</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom2</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom3</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom4</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom5</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom6</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom7</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom8</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom9</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom10</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom11</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom12</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom13</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom14</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom15</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom16</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom17</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom18</div>,
    },
    {
      height: getRandomHeight(),
      element: <div>Dom19</div>,
    },
  ],
  borderColor: "#1f2a33",
  borderWidth: 2,
  borderRadius: 20,
};

export const App = () => {
  return (
    <div
      style={{
        width: "80%",
        height: "100vh",
        margin: "0 auto",
      }}
    >
      <R3FDomMasonry {...props} />
    </div>
  );
};
