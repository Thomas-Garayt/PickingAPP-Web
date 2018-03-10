// @flow

import moment from 'moment';
import DateConstants from 'constants/DateConstants';
import Locale from 'locale/LocaleFactory';

export default class DateService {
    /**
     * Check if the date is a working date.
     * @param {Date} d The date we're looking for.
     * @returns {boolean} TRUE if the date is a working date, else FALSE.
     */
    static isWorkingDay(date: Date): boolean {
        return !isSpecialEvent(moment(date), Locale.getLocale());
    }

    /**
     * Get a list of each dates in a month.
     * @param {number} year The year we're looking for.
     * @param {number} month The month we're looking for.
     * @returns {Array<Date>} The list of dates.
     */
    static getDaysInMonth(year: number, month: number): Array<Date> {
        const daysInMonth = [];
        const numberOfDaysInMonth = new Date(year, month, 0).getDate();
        for (let i = 1; i <= numberOfDaysInMonth; i++) {
            daysInMonth.push(new Date(year, month - 1, i));
        }
        return daysInMonth;
    }

    /**
     * Format a date to the API date format.
     * @param {Date} date The date to format.
     * @returns {string} The formatted date with API format.
     */
    static formatApi(date: Date | moment): string {
        return moment(date).format(DateConstants.API_DATE_FORMAT);
    }

    /**
     * Format a string date with API format to a string date with Display format.
     * @param  {string} dateFormatApi The date to format.
     * @return {string}               The date with display format.
     */
    static formatApiToDisplay(dateFormatApi: string): string {
        return moment(dateFormatApi, DateConstants.API_DATE_FORMAT).format(
            DateConstants.DISPLAY_DATE_FORMAT,
        );
    }

    /**
     * Format a string date with API format to a string date with Display format.
     * @param  {string} dateFormatApi The date to format.
     * @return {string}               The date with display format.
     */
    static formatApiTimeToDisplay(dateFormatApi: string): string {
        return moment(dateFormatApi, DateConstants.API_DATE_FORMAT).format(
            DateConstants.API_TIME_FORMAT,
        );
    }

    /**
     * Parse a string ofa date with API format (YYY-MM-DD) to a Date.
     * @param  {string} dateFormatApi
     * @return {Date}
     */
    static parseApi(dateFormatApi: string): Date {
        return moment(dateFormatApi, DateConstants.API_DATE_FORMAT).toDate();
    }

    /**
     * Check if a date is between two dates.
     * Note that the two dates are included.
     * @param {Date | string} date It can be a Date object or a string in format YYYY-MM-DD.
     * @param {Date | string} from It can be a Date object or a string in format YYYY-MM-DD.
     * @param {Date | string} to   It can be a Date object or a string in format YYYY-MM-DD.
     * @return {boolean}  TRUE if the date is between, else FALSE.
     */
    static isBetween(date: Date | string, from: Date | string, to: Date | string): boolean {
        const d = typeof date === 'string' ? DateService.parseApi(date) : date;
        const f = typeof from === 'string' ? DateService.parseApi(from) : from;
        const t = typeof to === 'string' ? DateService.parseApi(to) : to;
        return moment(d).isBetween(f, t, 'day', '[]');
    }
}
