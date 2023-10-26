import { ACTIVITY_TIMES } from "../../../../helpers";
import type { ActivityKeys, ActivityTime } from "../../../../types";
import type { Dispatch, FormEvent, SetStateAction } from "react";

interface SelectTimeProps {
    handleNextStep: () => void;
    setTime: Dispatch<SetStateAction<ActivityTime | null>>;
}

export const SelectTime = ({ handleNextStep, setTime }: SelectTimeProps): JSX.Element => {
    const activityKeys = Object.keys(ACTIVITY_TIMES) as ActivityKeys[];

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleNextStep();
    };

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor="time">Time</label>
            <select required id="time" name="time" onChange={(e) => setTime(e.target.value as ActivityTime)}>
                <option value="">--Select time--</option>
                <optgroup label="Times">
                    {activityKeys.map((time) => (
                        <option key={time} value={ACTIVITY_TIMES[time]}>
                            {ACTIVITY_TIMES[time]}
                        </option>
                    ))}
                </optgroup>
            </select>
            <button>Choose</button>
        </form>
    );
};
