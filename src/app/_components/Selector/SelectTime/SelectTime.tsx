import { ACTIVITY_TIMES, testingIds } from "../../../../helpers";
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
        <form onSubmit={(e) => handleSubmit(e)} data-client-id={selectTimeIds.form}>
            <label htmlFor="time" data-client-id={selectTimeIds.label}>
                Time
            </label>
            <select
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
            </select>
            <button data-client-id={selectTimeIds.chooseButton}>Choose</button>
        </form>
    );
};
