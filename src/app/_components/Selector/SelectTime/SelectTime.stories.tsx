import type { Meta, StoryObj } from "@storybook/react";

import { SelectTime } from "./SelectTime";

const meta: Meta<typeof SelectTime> = {
    component: SelectTime,
};

export default meta;
type Story = StoryObj<typeof SelectTime>;

export const Primary: Story = {
    args: {
        handleNextStep: () => console.log("Next step!"),
        setTime: (time) => console.log(`Time is now ${time}`),
    },
};
