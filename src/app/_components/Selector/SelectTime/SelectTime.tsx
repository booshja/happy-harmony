import { ACTIVITY_TIMES, testingIds } from "../../../../helpers";
import {
    TimeFormButtonStyled,
    TimeFormInputLabelStyled,
    TimeFormSelectStyled,
    TimeFormStyled,
} from "./SelectTimeStyled";
import type { ActivityKeys, ActivityTime } from "../../../../types";
import type { Dispatch, FormEvent, SetStateAction } from "react";

interface SelectTimeProps {
    handleNextStep: () => void;
    setTime: Dispatch<SetStateAction<ActivityTime | null>>;
}

const selectTimeIds = testingIds.selectors.time;

export const SelectTime = ({
    handleNextStep,
    setTime,
}: SelectTimeProps): JSX.Element => {
    const activityTimeKeys = Object.keys(ACTIVITY_TIMES) as ActivityKeys[];

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleNextStep();
    };

    return (
        <TimeFormStyled
            onSubmit={(e) => handleSubmit(e)}
            data-client-id={selectTimeIds.form}
        >
            <TimeFormInputLabelStyled
                htmlFor="time"
                data-client-id={selectTimeIds.label}
            >
                Select how long you&apos;d like to spend on this activity
            </TimeFormInputLabelStyled>
            <TimeFormSelectStyled
                required
                id="time"
                name="time"
                onChange={(e) => setTime(e.target.value as ActivityTime)}
                data-client-id={selectTimeIds.select}
            >
                <option value="" data-client-id={selectTimeIds.selectOptions}>
                    --Select time--
                </option>
                <optgroup label="Times">
                    {activityTimeKeys.map((time) => (
                        <option
                            key={time}
                            value={ACTIVITY_TIMES[time]}
                            data-client-id={selectTimeIds.selectOptions}
                        >
                            {ACTIVITY_TIMES[time]}
                        </option>
                    ))}
                </optgroup>
            </TimeFormSelectStyled>
            <TimeFormButtonStyled data-client-id={selectTimeIds.chooseButton}>
                Choose
            </TimeFormButtonStyled>
        </TimeFormStyled>
    );
};
