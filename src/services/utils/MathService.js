// @flow

export default class MathService {
    /**
     * Round a number with a certain precision.
     * @param {number} num The number to round.
     * @param {number} precision The number of number after to the coma. (Default: 0)
     * @returns {number} The rounded number
     */
    static round(num: number, precision: number): number {
        const multiplicator: number = Math.pow(10, precision || 0);
        return Math.round(num * multiplicator) / multiplicator;
    }

    /**
     * Format a number to display.
     * @param {number} num The number to round.
     * @param {number} precision The number of number after to the coma. (Default: 0)
     * @returns {number} The formatted number
     */
    static format(num: number, precision: number): string {
        const roundedNum = MathService.round(num, precision).toFixed(precision || 0);
        return MathService.addThousandSeparator(roundedNum, ' ', '.');
    }

    static addThousandSeparator(
        num: number | string,
        thousandSeparator: string,
        decimalSeparator: string,
    ): string {
        const nStr = num.toString();
        const x = nStr.split('.');
        let x1 = x[0];
        const x2 = x.length > 1 ? `${decimalSeparator}${x[1]}` : '';
        const rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, `$1${thousandSeparator}$2`);
        }
        return x1 + x2;
    }
}
