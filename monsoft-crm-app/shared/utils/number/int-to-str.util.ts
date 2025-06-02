export function intToStr({
    int,
    numDigits,
}: {
    int: number;
    numDigits: number;
}): string {
    return int.toLocaleString('en-US', {
        minimumIntegerDigits: numDigits,
        maximumFractionDigits: 0,
        useGrouping: false,
    });
}
