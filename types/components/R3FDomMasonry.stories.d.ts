import type { Meta, StoryObj } from "@storybook/react";
import { R3FDomMasonry } from "./R3FDomMasonry";
declare const meta: Meta<typeof R3FDomMasonry>;
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * Plane Geometry && Dom Alignment
 */
export declare const Default: Story;
/**
 * Random Heights && Dom Alignment
 */
export declare const RandomHeights: Story;
/**
 * Image && Dom Alignment
 */
export declare const Image: Story;
/**
 * Image && Random Heights && Dom Alignment
 */
export declare const ImageRandomHeights: Story;
