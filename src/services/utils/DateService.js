// @flow

import moment from 'moment';
import DateConstants from 'constants/DateConstants';
import Locale from 'locale/LocaleFactory';

function isEventDate(date: moment, eventDates): boolean {
    for (let i = 0; i < eventDates.length; i++) {
        const eventDate = eventDates[i];

        if (date.month() === eventDate.month && date.date() === eventDate.date) {
            return true;
        }
    }
    return false;
}

function getEaster(Y: number): moment {
    const C = Math.floor(Y / 100);
    const N = Y - 19 * Math.floor(Y / 19);
    const K = Math.floor((C - 17) / 25);
    let I = C - Math.floor(C / 4) - (Math.floor((C - K) / 3) + 19 * N + 15);
    I -= 30 * Math.floor(I / 30);
    I -=
        Math.floor(I / 28) *
        (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
    let J = Y + Math.floor(Y / 4) + I + 2 - C + Math.floor(C / 4);
    J -= 7 * Math.floor(J / 7);
    const L = I - J;
    const M = 3 + Math.floor((L + 40) / 44);
    const D = L + 28 - 31 * Math.floor(M / 4);

    return moment(`${Y}-${M}-${D}`, 'YYYY-MM-DD');
}

function isSpecialEventFr(date: moment): boolean {
    const eventDates = [
        { date: 1, month: 0 },
        { date: 1, month: 4 },
        { date: 8, month: 4 },
        { date: 14, month: 6 },
        { date: 15, month: 7 },
        { date: 1, month: 10 },
        { date: 11, month: 10 },
        { date: 25, month: 11 },
        { date: 31, month: 11 },
    ];

    const easter: moment = getEaster(date.year());
    easter.add(1, 'days');
    const isEaster: moment = date.isSame(easter);

    const ascension: moment = easter.clone();
    ascension.add(38, 'days');
    const isAscension: boolean = date.isSame(ascension);

    const pentecote: moment = easter.clone();
    pentecote.add(49, 'days');
    const isPentecote: boolean = date.isSame(pentecote);

    const mondayPentecote: moment = easter.clone();
    mondayPentecote.add(50, 'days');
    const isMondayPentecote: boolean = date.isSame(mondayPentecote);

    const isChristianEvent: boolean = isEaster || isAscension || isPentecote || isMondayPentecote;

    return isChristianEvent || isEventDate(date, eventDates);
}

function isSpecialEventEn(date: moment): boolean {
    return isSpecialEventFr(date);
}

function isSpecialEvent(date: moment, locale: string) {
    let isEvent;
    switch (locale) {
    case 'en':
        isEvent = isSpecialEventEn(date);
        break;
    case 'fr':
        isEvent = isSpecialEventFr(date);
        break;
    default:
        isEvent = false;
        break;
    }
    return isEvent;
}

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
