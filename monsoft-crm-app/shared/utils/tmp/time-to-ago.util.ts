import { timeToYMDHMS } from './time-to-YMDHMS.util';

export const timeToAgo = (timestamp: number) => {
    const { year, month, day } = timeToYMDHMS(timestamp);

    const {
        year: nowYear,
        month: nowMonth,
        day: nowDay,
    } = timeToYMDHMS(Date.now());

    if (year === nowYear && month === nowMonth && day === nowDay)
        return 'Today';

    if (year === nowYear && month === nowMonth && day === nowDay - 1)
        return 'Yesterday';

    if (year === nowYear && month === nowMonth)
        return `${(nowDay - day).toString()} days ago`;

    if (year === nowYear && month === nowMonth - 1) return 'Last month';

    if (year === nowYear) return `${(nowMonth - month).toString()} months ago`;

    if (year === nowYear - 1) return 'Last year';

    return `${(nowYear - year).toString()} years ago`;
};
