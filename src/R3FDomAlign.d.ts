import React from "react";
export interface UniformsProps {
    [Key: string]: {
        value: number;
    };
}
export interface R3FDomAlignProps {
    isBorderRadius?: boolean;
    borderRadius?: number;
    borderColor?: string;
    borderWidth?: number;
    items: Array<DomItemProps>;
}
export declare const R3FDomAlign: ({ ...props }: R3FDomAlignProps) => import("react/jsx-runtime").JSX.Element;
export interface DomItemProps {
    height: number;
    type: "image" | "element";
    element?: React.JSX.Element;
    src?: string;
    vertexShader?: string;
    fragmentShader?: string;
}
