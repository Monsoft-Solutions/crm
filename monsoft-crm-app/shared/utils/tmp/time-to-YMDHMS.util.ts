export const timeToYMDHMS = (timestamp: number) => {
    const date = new Date(timestamp);

    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
    };
};
