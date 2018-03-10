import React from 'react';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';
import { Form, Icon, Button, Tooltip, Popconfirm, Row, Col, Tag } from 'antd';
import FormItem from 'components/forms/FormItems';
import DeleteButton from 'components/forms/DeleteButton.jsx';
import Label from 'components/forms/Label.jsx';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';

export default class ReferenceForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.reference,
            formClass: ReferenceFormContent,
        };
    }
}

class ReferenceFormContent extends FormBase {
    constructor() {
        super();
        this.state = {
        };
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = () => {
        const { form } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const reference = this.getReferenceFromValues(values);

            this.props.onSubmit(reference);
        });
    };

    getReferenceFromValues = (values) => {
        const reference = {};
        for (const k in values) {
            reference[k] = values[k];
        }
        return reference;
    };

    clickTag = () => {
        console.log("CLICK TAG");
    }

    render() {
        const { onSubmit } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        return (
            <Form hideRequiredMark>
                <div className="full-size-form">
                    <div className="form-content">

                        <Row gutter={8}>
                            <h2>Référence {Locale.trans('reference.type.' + getFieldValue('type'))}</h2>
                        </Row>

                        <FormItem.Input
                            id="format"
                            required
                            initialValue={getFieldValue('format')}
                            form={this.props.form}
                        />
                        {/*
                        <Row gutter={8}>
                            <h4>Ajouter des variables</h4>
                        </Row>

                        <Button type="normal" size="small" onClick={this.clickTag}>Chrono 2 chiffres</Button>
                        <Button type="normal" size="small" onClick={this.clickTag}>Chrono 3 chiffres</Button>
                        <Button type="normal" size="small" onClick={this.clickTag}>Référence Affaire</Button>
                        <Button type="normal" size="small" onClick={this.clickTag}>Mois</Button>
                        <Button type="normal" size="small" onClick={this.clickTag}>Année</Button>
                        */}
                    </div>

                    <div className="form-action-barre">
                        {this.props.onSubmit ? (
                            <Button
                              type="primary"
                              onClick={this.handleSubmit}
                              disabled={this.hasErrors()}
                            >
                                {Locale.trans('save')}
                            </Button>
                        ) : null}
                    </div>

                </div>
            </Form>
        );
    }

}
