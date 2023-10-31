import type { Meta, StoryObj } from "@storybook/react";

import { ListSelector } from "./ListSelector";

const meta: Meta<typeof ListSelector> = {
    component: ListSelector,
};

export default meta;
type Story = StoryObj<typeof ListSelector>;

export const Primary: Story = {
    args: {},
};
