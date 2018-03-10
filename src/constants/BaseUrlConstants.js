import Locale from 'locale/LocaleFactory';

var BASE_URL = Parameters.ApiUrl;
export default {
    // The BASE url to access the API
    BASE_URL: BASE_URL + Locale.getLocale() + '/'
}
