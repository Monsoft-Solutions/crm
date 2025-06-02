export function intToOneDigitStr(n: number) {
    return n < 10 ? n.toString() : `9+`;
}
