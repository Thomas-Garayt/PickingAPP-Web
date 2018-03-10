import React from 'react';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';
import { Form, Icon, Button, Tooltip, Popconfirm, Row, Col } from 'antd';
import FormItem from 'components/forms/FormItems';
import DeleteButton from 'components/forms/DeleteButton.jsx';
import Label from 'components/forms/Label.jsx';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';

export default class BankForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.bank,
            formClass: BankFormContent,
        };
    }
}

class BankFormContent extends FormBase {
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

            const bank = this.getBankFromValues(values);

            this.props.onSubmit(bank);
        });
    };

    getBankFromValues = (values) => {
        const bank = {};
        for (const k in values) {
            bank[k] = values[k];
        }
        return bank;
    };

    render() {
        const { onSubmit, onDelete } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        return (
            <Form hideRequiredMark>
                <div className="full-size-form">
                    <div className="form-content">

                        <FormItem.Input
                            id="name"
                            required
                            label={Locale.trans('bank.name')}
                            initialValue={getFieldValue('name')}
                            form={this.props.form}
                        />

                        <Row gutter={8}>
                            <Col span={12}>
                                <FormItem.Input
                                  id="iban"
                                  required
                                  label={Locale.trans('bank.iban')}
                                  initialValue={getFieldValue('iban')}
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={12}>
                                <FormItem.Input
                                  id="bic"
                                  required
                                  label={Locale.trans('bank.bic')}
                                  initialValue={getFieldValue('bic')}
                                  form={this.props.form}
                                />
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={12}>
                                <FormItem.Input
                                  id="establishmentCode"
                                  required
                                  label={Locale.trans('bank.establishmentCode')}
                                  initialValue={getFieldValue('establishmentCode')}
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={12}>
                                <FormItem.Input
                                    id="accountNumber"
                                    required
                                    label={Locale.trans('bank.accountNumber')}
                                    initialValue={getFieldValue('accountNumber')}
                                    form={this.props.form}
                                />
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={12}>
                                <FormItem.Input
                                    id="sortCode"
                                    required
                                    label={Locale.trans('bank.sortCode')}
                                    initialValue={getFieldValue('sortCode')}
                                    form={this.props.form}
                                />
                            </Col>
                            <Col span={12}>
                                <FormItem.Input
                                    id="riceCode"
                                    required
                                    label={Locale.trans('bank.riceCode')}
                                    initialValue={getFieldValue('riceCode')}
                                    form={this.props.form}
                                />
                            </Col>
                        </Row>

                        <FormItem.Checkbox
                            id="isDefaultCreditBank"
                            initialValue={getFieldValue('isDefaultCreditBank')}
                            label={Locale.trans('bank.isDefaultCreditBank')}
                            form={this.props.form}
                        />

                        <FormItem.Input
                            id="street"
                            label={Locale.trans('bank.street')}
                            initialValue={getFieldValue('street')}
                            form={this.props.form}
                        />

                        <Row gutter={8}>
                            <Col span={12}>
                                <FormItem.Input
                                    id="city"
                                    label={Locale.trans('bank.city')}
                                    initialValue={getFieldValue('city')}
                                    form={this.props.form}
                                />
                            </Col>
                            <Col span={12}>
                                <FormItem.Input
                                  id="postalCode"
                                  label={Locale.trans('bank.postalCode')}
                                  initialValue={getFieldValue('postalCode')}
                                  form={this.props.form}
                                />
                            </Col>
                        </Row>

                        <FormItem.Input
                          id="country"
                          required
                          label={Locale.trans('bank.country')}
                          initialValue={getFieldValue('country')}
                          form={this.props.form}
                        />
                        <FormItem.Input
                          id="phone"
                          label={Locale.trans('bank.phone')}
                          initialValue={getFieldValue('phone')}
                          form={this.props.form}
                        />
                        <FormItem.Input
                          id="email"
                          label={Locale.trans('bank.email')}
                          initialValue={getFieldValue('email')}
                          form={this.props.form}
                        />
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
                        &nbsp;
                        {this.props.onDelete ? (
                            <DeleteButton onDelete={this.props.onDelete} />
                        ) : null}
                    </div>
                </div>
            </Form>
        );
    }

}
