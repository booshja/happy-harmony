import type { Meta, StoryObj } from "@storybook/react";

import { SelectCategory } from "./SelectCategory";

const meta: Meta<typeof SelectCategory> = {
    component: SelectCategory,
};

export default meta;
type Story = StoryObj<typeof SelectCategory>;

export const Primary: Story = {
    args: {
        handleNextStep: () => console.log("Next step!"),
        setCategory: (category) => console.log(`Category is now ${category}`),
        categories: ["Music", "Plants", "Dogs"],
    },
};
