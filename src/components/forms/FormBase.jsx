import React from 'react';

export default class FormBase extends React.Component {
    customErrors: {name: string, value: string};

    constructor() {
        super();
        this.customErrors = {};
    }

    setCustomFieldsError(customErrors) {
        Object.assign(this.customErrors, customErrors);
        this.forceUpdate();
    }

    hasErrors() {
        const fieldsError = this.getErrors();
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    getErrors() {
        return Object.assign({}, this.props.form.getFieldsError(), this.customErrors);
    }

    getFieldError(name) {
        return this.getErrors()[name];
    }

    getValidateStatus(name) {
        const { isFieldTouched } = this.props.form;
        if (!isFieldTouched(name)) {
            return '';
        }
        return this.getFieldError(name) ? 'error' : 'success';
    }

    getHelp(name) {
        const { isFieldTouched } = this.props.form;
        return (isFieldTouched(name) && this.getFieldError(name)) || '';
    }
}
