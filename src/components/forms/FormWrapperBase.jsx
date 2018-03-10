// @flow

import React from 'react';
import { Form } from 'antd';

type Props = {
    onSubmit: ()=>void,
    onCancel: ()=>void,
};
type State = {
    entity: ?Object,
    formClass: *,
};

/**
 * Base component to wrap AntDesign forms and hide its complexity.
 */
export default class FormWrapperBase extends React.Component<void, Props, State> {
    state: State;
    areFieldsChanged: boolean;

    shouldComponentUpdate() {
        return !this.areFieldsChanged;
    }

    /**
     * If the fields changed inside the form, we force the wrapper to not render.
     * This way, we avoid loosing data when the user is editing the form.
     */
    handleFieldsChange = () => {
        this.areFieldsChanged = true;
    };

    /**
     * Method used to convert any Entity to a valid "Form Fields" to mapPropsToFields.
     */
    entityToFormFields(e: ?Object) {
        if (!e) {
            return null;
        }

        const f = {};
        const keys = Object.keys(e);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            const v = e[k];
            f[k] = Form.createFormField({ value: v });
        }
        return f;
    }

    handleSubmit(...args: *) {
        this.areFieldsChanged = false;
        if (this.props.onSubmit) {
            this.props.onSubmit(...args);
        }
    }

    handleCancel = () => {
        const { onCancel } = this.props;
        this.areFieldsChanged = false;
        onCancel();
    }

    render() {
        const { onSubmit, onCancel } = this.props;
        const { formClass, entity } = this.state;
        const contactFields = this.entityToFormFields(entity);
        const WrappedContactForm = Form.create({
            mapPropsToFields: () => contactFields,
            onValuesChange: this.handleFieldsChange,
        })(formClass);
        return (
            <WrappedContactForm
              {...this.props}
              onSubmit={onSubmit}
              onCancel={onCancel ? this.handleCancel : null}
            />
        );
    }
}
