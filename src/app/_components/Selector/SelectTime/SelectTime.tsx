import { ACTIVITY_TIMES } from "../../../../helpers";
import type { ActivityKeys, ActivityTime } from "../../../../types";
import type { Dispatch, SetStateAction } from "react";

interface SelectTimeProps {
    handleNextStep: () => void;
    setTime: Dispatch<SetStateAction<ActivityTime | null>>;
}

export const SelectTime = ({ handleNextStep, setTime }: SelectTimeProps): JSX.Element => {
    const activityKeys = Object.keys(ACTIVITY_TIMES) as ActivityKeys[];

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleNextStep();
            }}
        >
            <label htmlFor="time">Time</label>
            <select id="time" name="time" onChange={(e) => setTime(e.target.value as ActivityTime)}>
                {activityKeys.map((time) => (
                    <option key={time} value={ACTIVITY_TIMES[time]}>
                        {ACTIVITY_TIMES[time]}
                    </option>
                ))}
            </select>
            <button>Choose</button>
        </form>
    );
};
