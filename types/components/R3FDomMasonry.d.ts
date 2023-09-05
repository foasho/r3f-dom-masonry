import React from "react";
export declare const r3f: {
    In: ({ children }: {
        children: React.ReactNode;
    }) => null;
    Out: () => JSX.Element;
};
export type UniformsProps = {
    [Key: string]: {
        value: number;
    };
};
export type R3FDomMasonryProps = {
    isBorderRadius?: boolean;
    borderRadius?: number;
    borderColor?: string;
    borderWidth?: number;
    items?: Array<DomItemProps>;
    columns?: [number, number, number];
    gap?: [number, number, number];
    media?: [number, number, number];
    hideScrollBar?: boolean;
    centerDom?: boolean;
};
export declare const R3FDomMasonry: ({ isBorderRadius, borderRadius, borderColor, borderWidth, items, columns, gap, media, hideScrollBar, centerDom, }: R3FDomMasonryProps) => import("react/jsx-runtime").JSX.Element;
export type DomItemProps = {
    height?: number;
    element?: React.JSX.Element;
    src?: string;
    vertexShader?: string;
    fragmentShader?: string;
};
