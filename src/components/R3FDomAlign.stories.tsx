import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { R3FDomAlign, R3FDomAlignProps } from "./R3FDomAlign";

const meta: Meta<typeof R3FDomAlign> = {
  title: "R3FDomAlign",
  component: R3FDomAlign,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
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
          width: "80%",
          margin: "0 auto",
          minWidth: "520px",
          height: "100vh",
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
      element: <div>Sample</div>,
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
  ],
  borderColor: "#1f2a33",
  borderWidth: 2,
  borderRadius: 20,
};

const Template: StoryFn<typeof R3FDomAlign> = (args: R3FDomAlignProps) => <R3FDomAlign {...args} />;

export const SimpleDoms: Story = {
  render: Template,
  args: {
    ...defaultProps,
  },
};
