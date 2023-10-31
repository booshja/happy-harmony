import { Dispatch, SetStateAction } from "react";
import { testingIds } from "../../../../helpers";

import { Category } from "../../../../../zzzAlgorithm/activities";

interface SelectCategoryProps {
    categories: Category[];
    setCategory: Dispatch<SetStateAction<Category | null>>;
    handleNextStep: () => void;
}

const categoriesIds = testingIds.selectors.categories;

export const SelectCategory = ({
    categories,
    setCategory,
    handleNextStep,
}: SelectCategoryProps) => {
    const categoryKeys = Object.keys(categories);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleNextStep();
    };

    return (
        <form onSubmit={(e) => handleSubmit(e)} data-client-id={categoriesIds.form}>
            <label htmlFor="category" data-client-id={categoriesIds.label}>
                Category
            </label>
            <select
                required
                id="category"
                name="category"
                onChange={(e) => setCategory(e.target.value as Category)}
                data-client-id={categoriesIds.select}
            >
                <option data-client-id={categoriesIds.selectOptions} value="">
                    --Select category--
                </option>
                <optgroup label="Categories">
                    {categoryKeys.map((category) => (
                        <option
                            data-client-id={categoriesIds.selectOptions}
                            key={+category}
                            value={categories[+category]}
                        >
                            {categories[+category]}
                        </option>
                    ))}
                </optgroup>
            </select>
            <button data-client-id={categoriesIds.chooseButton}>Choose</button>
        </form>
    );
};
