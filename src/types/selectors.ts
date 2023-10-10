import { SELECTORS } from "../helpers";

export type Selector =
    | typeof SELECTORS.RANDOM_SELECTOR
    | typeof SELECTORS.CATEGORY_SELECTOR
    | typeof SELECTORS.LIST_SELECTOR;
