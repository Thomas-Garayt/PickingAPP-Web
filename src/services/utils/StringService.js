// @flow
import React from 'react';

export default class StringService {
    /**
     * Capitalize a string. It means that the first letter is uppercase and the rest is lowercase.
     * @param   {number} string The string to capitalize.
     * @returns {string}        The capitalized string.
     */
    static capitalize(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static compareCaseInsensitive(s1: string, s2: string) {
        const nameA = s1.toUpperCase();
        const nameB = s2.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    static nl2br(str: string) {
        return str.split('\n').map((item, key) => (
            <span key={key}>
                {item}
                <br />
            </span>
        ));
    }
}
