import { intToStr } from '../number';

import { timeToYMDHMS } from './time-to-YMDHMS.util';

export const timeToHMEpochStr = (timestamp: number) => {
    const { hours, minutes } = timeToYMDHMS(timestamp);

    const displayHours = hours % 12 || 12;

    const hoursStr = intToStr({ int: displayHours, numDigits: 2 });
    const minutesStr = intToStr({ int: minutes, numDigits: 2 });

    const epoch = hours >= 12 ? 'PM' : 'AM';

    return `${hoursStr}:${minutesStr} ${epoch}`;
};
