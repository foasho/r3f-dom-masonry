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
  ],
  borderColor: "#1f2a33",
  borderWidth: 2,
  borderRadius: 20,
};

const Template: StoryFn<typeof R3FDomAlign> = (args: R3FDomAlignProps) => <R3FDomAlign {...args} />;

/**
 * Simple Plane Geometry && Dom Alignment
 */
export const Simple: Story = {
  render: Template,
  args: {
    ...defaultProps,
  },
};
