import type { Meta, StoryObj } from "@storybook/react";

import { RandomSelector } from "./RandomSelector";

const meta: Meta<typeof RandomSelector> = {
    component: RandomSelector,
};

export default meta;
type Story = StoryObj<typeof RandomSelector>;

export const Primary: Story = {
    args: {},
};
