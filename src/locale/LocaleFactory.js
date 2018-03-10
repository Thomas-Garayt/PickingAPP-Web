/* global navigator */

import moment from 'moment';

import en from 'locale/messages.en';
import fr from 'locale/messages.fr';

import { Table, Pagination } from 'antd';

const Translations = {
    en,
    fr,
};

class LocaleFactory {
    constructor() {
        this.locale = this._getNavigatorLocale();
        this.initMoment();
        this._initializeLocales();
    }

    _getNavigatorLocale() {
        const navLanguage = navigator.language || navigator.browserLanguage || 'en';
        return navLanguage.split('-')[0];
    }

    _initializeLocales() {
        const translations = Translations[this.locale] || Translations.en;

        // Ant Design
        this.Table = translations.Table;
        this.Modal = translations.Modal;
        this.Popconfirm = translations.Popconfirm;
        this.Transfer = translations.Transfert;
        this.Select = translations.Select;
        this.Pagination = translations.Pagination;
        this.TimePicker = translations.TimePicker;
        this.DatePicker = {
            lang: translations.DatePicker.lang,
            timePickerLocale: this.TimePicker,
        };
        this.Calendar = this.DatePicker;

        // This initialization allow us to globaly set the locale of AntD Tables.
        Pagination.prototype.getLocale = () => this.Pagination;

        this.Trans = this._compileTranslations(translations.Trans);
    }

    _compileTranslations(translations, prefix) {
        const compiledTrans = [];

        prefix = prefix || '';
        for (const k in translations) {
            if (translations.hasOwnProperty(k)) {
                if (typeof translations[k] === 'string') {
                    compiledTrans[prefix + k] = translations[k];
                } else {
                    const children = this._compileTranslations(translations[k], `${prefix + k}.`);
                    Object.assign(compiledTrans, children);
                }
            }
        }

        return compiledTrans;
    }

    trans = (key, params) => {
        params = params || [];
        let msg = this.Trans[key] ? this.Trans[key] : key;

        for (const k in params) {
            if (params.hasOwnProperty(k)) {
                msg = msg.replace(`__${k}__`, params[k]);
            }
        }

        return msg;
    };

    getLocale = () => this.locale;

    setLocale = (locale) => {
        this.locale = locale;
        this._initializeLocales();
    };

    initMoment = () => {
        moment.locale(this.locale);
    };
}

export default new LocaleFactory();
