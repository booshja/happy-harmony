import type { Meta, StoryObj } from "@storybook/react";

import { SelectorResult } from "./SelectorResult";
import { ACTIVITY_TIMES } from "../../../../helpers";

const meta: Meta<typeof SelectorResult> = {
    component: SelectorResult,
};

export default meta;
type Story = StoryObj<typeof SelectorResult>;

export const RandomSelectorResult: Story = {
    args: {
        activity: {
            name: "Listen to a record",
            category: "Music",
            time: ACTIVITY_TIMES[60],
        },
        selectorType: "random",
    },
};

export const CategorySelectorResult: Story = {
    args: {
        activity: {
            name: "Listen to a record",
            category: "Music",
            time: ACTIVITY_TIMES[60],
        },
        selectorType: "category",
    },
};

export const ListSelectorResult: Story = {
    args: {
        activityList: [
            {
                name: "Example activity 1",
                category: "Music",
                time: ACTIVITY_TIMES[60],
            },
            {
                name: "Example activity 2",
                category: "Music",
                time: ACTIVITY_TIMES[60],
            },
            {
                name: "Example activity 3",
                category: "Music",
                time: ACTIVITY_TIMES[60],
            },
        ],
        selectorType: "list",
    },
};
