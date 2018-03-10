import React from 'react';
import { Form, Button } from 'antd';
import { InputItem, DatePickerItem } from 'components/forms/FormItems';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';
import DateConstants from 'constants/DateConstants';

import MathService from 'services/utils/MathService';
import StringService from 'services/utils/StringService';

class CreateBusinessPaymentTermFormContent extends FormBase {
    constructor() {
        super();
        Locale.initMoment();
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

            const paymentTerm = this.getPaymentTermFromValues(values);

            this.props.onSubmit(paymentTerm);
        });
    };

    getPaymentTermFromValues = (values) => {
        const paymentTerm = {};
        const keys = Object.keys(values);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            switch (k) {
            case 'realfcdate-picker':
                paymentTerm.realfcdate = values[k]
                        ? values[k].format(DateConstants.API_DATE_FORMAT)
                        : null;
                break;
            case 'realreceiptdate-picker':
                paymentTerm.realreceiptdate = values[k]
                        ? values[k].format(DateConstants.API_DATE_FORMAT)
                        : null;
                break;
            default:
                paymentTerm[k] = values[k];
                break;
            }
        }

        return paymentTerm;
    };

    updateAmountET = (percentage) => {
        const { business } = this.props;
        const ratio = Number.isNaN(percentage) ? 0 : percentage / 100;
        const amountET = business.amountQuote * ratio;
        this.props.form.setFieldsValue({
            etprice: amountET,
            atiprice: amountET * 1.2,
        });
    };

    updatePercentage = (amountET) => {
        const { business } = this.props;
        const ratio = Number.isNaN(amountET) ? 0 : amountET / business.amountQuote;
        const percentage = 100 * ratio;
        this.props.form.setFieldsValue({
            percentage,
            atiprice: amountET * 1.2,
        });
    };

    getAmountATI = () => {
        const amountET = this.props.form.getFieldValue('etprice');
        const amountATI = amountET * 1.2;
        return Number.isNaN(amountATI) ? '-' : MathService.format(amountATI, 2);
    };

    checkReceiptDate = (rule, value, callback) => {
        const form = this.props.form;
        const fcDate = form.getFieldValue('realfcdate-picker');
        if (value && fcDate.format('YYYYMMDD') > value.format('YYYYMMDD')) {
            callback(Locale.trans('business.paymentTerm.error.receiptDateBeforeFC'));
        } else {
            callback();
        }
    };

    render() {
        const { getFieldValue } = this.props.form;
        const { business, client } = this.props;

        const billingAddress = client.addresses.find(a => a.isBilling);
        return (
            <Form hideRequiredMark>
                <div className="full-size-form business-payment-term">
                    <div className="form-content">
                        <h1>Nouvelle Facture</h1>
                        <div className="dates">
                            <div className="label">
                                {Locale.trans('business.paymentTerm.forecastBillingDate')}
                            </div>
                            <DatePickerItem
                              id="realfcdate-picker"
                              initialValue={getFieldValue('realfcdate')}
                              form={this.props.form}
                            />
                            <br />
                            <div className="label">
                                {Locale.trans('business.paymentTerm.forecastCollectionDate')}
                            </div>
                            <DatePickerItem
                              id="realreceiptdate-picker"
                              initialValue={getFieldValue('realreceiptdate')}
                              form={this.props.form}
                              rules={[
                                  {
                                      validator: this.checkReceiptDate,
                                  },
                              ]}
                            />
                        </div>

                        <div className="client">
                            <p>{client.name}</p>
                            {billingAddress && (
                                <div className="address">
                                    <p>{StringService.nl2br(billingAddress.street)}</p>
                                    <p>
                                        {billingAddress.postalCode} {billingAddress.city}
                                    </p>
                                    <p>{billingAddress.country}</p>
                                </div>
                            )}
                        </div>

                        <div className="business-info">
                            <div>
                                <div className="label">Référence client</div>
                                {business.referenceQuote}
                            </div>
                            <div>
                                <div className="label">Libellé affaire</div>
                                {business.title}
                            </div>
                            <div>
                                <div className="label">Contact</div>
                                {business.representative.lastname}{' '}
                                {business.representative.firstname}
                            </div>
                        </div>

                        <h2>Informations de Facturation</h2>

                        <div className="payment-info">
                            <InputItem
                              id="description"
                              required
                              placeholder={Locale.trans('business.paymentTerm.description')}
                              initialValue={
                                    getFieldValue('description')
                                        ? getFieldValue('description').toString()
                                        : null
                                }
                              form={this.props.form}
                            />
                            <div className="details">
                                <div>
                                    <div className="label">
                                        {Locale.trans('business.paymentTerm.percentage')}
                                    </div>
                                    <InputItem
                                      id="percentage"
                                      required
                                      addonAfter="%"
                                      initialValue={
                                            getFieldValue('percentage')
                                                ? getFieldValue('percentage').toString()
                                                : null
                                        }
                                      form={this.props.form}
                                      onChange={(e) => {
                                          this.updateAmountET(e.target.value);
                                      }}
                                    />
                                </div>
                                <div>
                                    <div className="label">
                                        {Locale.trans('business.paymentTerm.etprice')}
                                    </div>
                                    <InputItem
                                      id="etprice"
                                      required
                                      addonAfter="€ HT"
                                      initialValue={getFieldValue('etprice')}
                                      form={this.props.form}
                                      onChange={(e) => {
                                          this.updatePercentage(e.target.value);
                                      }}
                                    />
                                </div>
                                <div>
                                    <div className="label">Montant TTC</div>
                                    {this.getAmountATI()} € TTC
                                </div>
                            </div>
                        </div>
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

export default class CreateBusinessPaymentTermForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.paymentTerm,
            formClass: CreateBusinessPaymentTermFormContent,
        };
    }
}
