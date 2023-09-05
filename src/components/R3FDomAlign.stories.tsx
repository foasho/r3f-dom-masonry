import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { R3FDomAlign, R3FDomAlignProps } from "./R3FDomAlign";

const meta: Meta<typeof R3FDomAlign> = {
  title: "R3FDomAlign",
  component: R3FDomAlign,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    borderColor: {
      control: {
        type: "color",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          height: "90vh",
          width: "90vw",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof R3FDomAlign>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultProps: R3FDomAlignProps = {
  items: [
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
    },
    {
      element: <div>Dom10</div>,
    },
    {
      element: <div>Dom11</div>,
    },
    {
      element: <div>Dom12</div>,
    },
    {
      element: <div>Dom13</div>,
    },
    {
      element: <div>Dom14</div>,
    },
    {
      element: <div>Dom15</div>,
    },
    {
      element: <div>Dom16</div>,
    },
    {
      element: <div>Dom17</div>,
    },
    {
      element: <div>Dom18</div>,
    },
    {
      element: <div>Dom19</div>,
    },
  ],
  borderColor: "#1f2a33",
  borderWidth: 2,
  borderRadius: 20,
};

const imageItemProps: R3FDomAlignProps = {
  items: [
    {
      src: "https://picsum.photos/200/300",
    },
    {
      src: "https://picsum.photos/300/300",
    },
    {
      src: "https://picsum.photos/300/200",
    },
    {
      src: "https://picsum.photos/500/300",
    },
    {
      src: "https://picsum.photos/400/300",
    },
    {
      src: "https://picsum.photos/200/300",
    },
  ],
};

const Template: StoryFn<typeof R3FDomAlign> = (args: R3FDomAlignProps) => <R3FDomAlign {...args} />;

const RandomHeightsTemplate: StoryFn<typeof R3FDomAlign> = (args: R3FDomAlignProps) => {
  const items = args.items!.map((item) =>{
    let randomHeight = Math.random() * 520;
    if (randomHeight < 240) {
      randomHeight = 240;
    }
    return {
      ...item,
      height: randomHeight,
    }
  });
  return <R3FDomAlign {...args} items={items} />;
};

const ImageTemplate: StoryFn<typeof R3FDomAlign> = (args: R3FDomAlignProps) => <R3FDomAlign {...args} />;


/**
 * Plane Geometry && Dom Alignment
 */
export const Default: Story = {
  render: Template,
  args: {
    ...defaultProps,
  },
};

/**
 * Random Heights && Dom Alignment
 */
export const RandomHeights: Story = {
  render: RandomHeightsTemplate,
  args: {
    ...defaultProps,
  },
};

/**
 * Image && Dom Alignment
 */
export const Image: Story = {
  render: ImageTemplate,
  args: {
    ...imageItemProps,
  },
};
