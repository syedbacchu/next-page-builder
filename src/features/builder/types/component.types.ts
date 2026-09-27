import type { ReactNode } from "react";

export interface BuilderComponentProps {
    children?: ReactNode;
    [key: string]: unknown;
}