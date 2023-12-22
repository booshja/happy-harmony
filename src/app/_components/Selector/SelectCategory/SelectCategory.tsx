import {
    CategoryFormButtonStyled,
    CategoryFormInputLabelStyled,
    CategoryFormSelectStyled,
    CategoryFormStyled,
} from "./SelectCategoryStyled";
import { testingIds } from "../../../../helpers";
import type { Dispatch, SetStateAction } from "react";

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
        <CategoryFormStyled
            onSubmit={(e) => handleSubmit(e)}
            data-client-id={categoriesIds.form}
        >
            <CategoryFormInputLabelStyled
                htmlFor="category"
                data-client-id={categoriesIds.label}
            >
                Choose a Category
            </CategoryFormInputLabelStyled>
            <CategoryFormSelectStyled
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
            </CategoryFormSelectStyled>
            <CategoryFormButtonStyled data-client-id={categoriesIds.chooseButton}>
                Choose
            </CategoryFormButtonStyled>
        </CategoryFormStyled>
    );
};
