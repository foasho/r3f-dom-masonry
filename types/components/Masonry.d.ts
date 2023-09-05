import * as React from "react";
export declare function useMediaValues(medias: number[] | undefined, columns: number[], gap: number[]): {
    columns: number;
    gap: number;
};
export type MasonryProps<T> = React.ComponentPropsWithoutRef<"div"> & {
    items: T[];
    render: (item: T, idx: number) => React.ReactNode;
    config: {
        columns: number | number[];
        gap: number | number[];
        media?: number[];
    };
};
export declare function createSafeArray(data: number | number[]): number[];
export declare function Masonry<T>({ items, render, config, ...rest }: MasonryProps<T>): import("react/jsx-runtime").JSX.Element;
export declare function MasonryRow({ children, gap, }: {
    children: React.ReactNode;
    gap: number;
}): import("react/jsx-runtime").JSX.Element;
export declare function createChunks<T>(data?: T[], columns?: number): T[][];
export declare function createDataColumns<T>(data?: T[][], columns?: number): T[][];
