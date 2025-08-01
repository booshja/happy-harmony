import type { ReactElement, ReactNode } from "react";

import { render, type RenderOptions } from "@testing-library/react";

const AllTheProviders = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
    render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
