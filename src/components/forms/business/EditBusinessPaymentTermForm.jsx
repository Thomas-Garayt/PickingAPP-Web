import React from 'react';
import { Form, Icon, Button, Tooltip } from 'antd';
import { InputItem, SelectItem, DatePickerItem } from 'components/forms/FormItems';
import DeleteButton from 'components/forms/DeleteButton.jsx';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';
import DateConstants from 'constants/DateConstants';
import WindowActions from 'actions/WindowActions';

import PaymentTermConstants from 'constants/business/PaymentTermConstants';
import moment from 'moment';

import MathService from 'services/utils/MathService';
import StringService from 'services/utils/StringService';

class EditBusinessPaymentTermFormContent extends FormBase {
    constructor(props) {
        super();
        Locale.initMoment();
        this.state = {
            paymentState: props.paymentTerm.state,
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
            case 'bankToCreditId':
                paymentTerm.bankToCredit = values[k];
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
        const amountATI = this.props.form.getFieldValue('atiprice');
        return Number.isNaN(amountATI) ? '-' : MathService.format(amountATI, 2);
    };

    isBillingDone = () => {
        const state = this.props.form.getFieldValue('state');
        return state !== PaymentTermConstants.WAITING_BILLING;
    };

    isCollectionDone = () => {
        const state = this.props.form.getFieldValue('state');
        return state === PaymentTermConstants.CASHED;
    };

    updatePaymentState = (s) => {
        this.props.form.setFieldsValue({
            state: s,
        });
    };

    editContact = (contact) => {
        WindowActions.createWindow('EDIT_CONTACT', { contact });
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
        const { getFieldValue, getFieldDecorator } = this.props.form;
        const { paymentTerm, business, client } = this.props;

        getFieldDecorator('state');
        getFieldDecorator('atiprice');

        // const readOnly = this.isBillingDone();
        const readOnly = false;

        const billingAddress = client ? client.addresses.find(a => a.isBilling) : null;
        return (
            <Form hideRequiredMark>
                <div className="full-size-form business-payment-term">
                    <div className="form-content">
                        <h1>Facture : N° {paymentTerm.reference}</h1>
                        <div className="dates">
                            <div className="label">
                                {Locale.trans('business.paymentTerm.forecastBillingDate')}
                            </div>
                            <DatePickerItem
                              id="realfcdate-picker"
                              initialValue={getFieldValue('realfcdate')}
                              form={this.props.form}
                              readOnly={readOnly}
                            />
                            {this.renderEmissionButton()}
                            {this.renderBillingAlert()}

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
                              ref={n => this.realreceiptdatepicker = n}
                            />
                            {this.renderCollectionButton()}
                            {this.renderCollectionAlert()}
                        </div>

                        <div className="client">
                            <p>{client ? client.name : null}</p>
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
                            {business.representative ? (
                                <div>
                                    <div className="label">Contact</div>
                                    <a
                                      role="button"
                                      tabIndex={0}
                                      onClick={(e) => {
                                          this.editContact(business.representative);
                                          e.stopPropagation();
                                      }}
                                    >
                                        {business.representative.lastname}{' '}
                                        {business.representative.firstname}
                                    </a>
                                </div>
                            ) : null}
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
                              readOnly={readOnly}
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
                                      readOnly={readOnly}
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
                                      readOnly={readOnly}
                                    />
                                </div>
                                <div>
                                    <div className="label">Montant TTC</div>
                                    {this.getAmountATI()} € TTC
                                </div>

                                <div className="bankToCredit">
                                    <div className="label">
                                        {Locale.trans('business.paymentTerm.bankToCredit')}
                                    </div>
                                    {this.renderBankToCreditField()}
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
                        &nbsp;
                        {this.props.onDelete && !this.isBillingDone() ? (
                            <DeleteButton onDelete={this.props.onDelete} />
                        ) : null}
                        {this.props.onDownload ? (
                            <Button className="pull-right" onClick={this.props.onDownload}>
                                {Locale.trans('download')}
                            </Button>
                        ) : null}
                    </div>
                </div>
            </Form>
        );
    }

    handleEmissionButtonclick = () => {
        this.props.form.setFieldsValue({
            'realfcdate-picker': moment(),
        });

        // This dirty code is here the force the validation of the
        // receipt date field.
        const v = this.props.form.getFieldValue('realreceiptdate-picker')
        this.realreceiptdatepicker.input.props.onChange(v);

        this.updatePaymentState(PaymentTermConstants.WAITING_RECEIPT);
    };

    renderEmissionButton() {
        return (
            <Button
              className={this.isBillingDone() ? 'done' : null}
              disabled={this.isBillingDone()}
              icon={this.isBillingDone() ? 'check' : null}
              onClick={this.handleEmissionButtonclick}
            >
                Emission
            </Button>
        );
    }

    renderBillingAlert() {
        // We don't show alerts if the billing is done.
        if (this.isBillingDone()) {
            return null;
        }

        const forcastBillingDate = this.props.paymentTerm.realfcdate;
        const initialBillingDate = this.props.paymentTerm.initialfcdate;
        const today = moment().format(DateConstants.API_DATE_FORMAT);

        let alert = null;
        if (forcastBillingDate < today) {
            alert = 'La date prévis de facturation est dépassée.';
        } else if (initialBillingDate !== forcastBillingDate) {
            alert = 'La date prévis de facturation a été modifiée.';
        }

        // TODO
        return alert ? (
            <Tooltip title={alert}>
                <Icon type="exclamation-circle" />
            </Tooltip>
        ) : null;
    }

    renderCollectionButton() {
        return (
            <Button
              className={this.isCollectionDone() ? 'done' : ''}
              disabled={!this.isBillingDone() || this.isCollectionDone()}
              icon={this.isCollectionDone() ? 'check' : null}
              onClick={() => {
                  this.updatePaymentState(PaymentTermConstants.CASHED);
              }}
            >
                Encaissement
            </Button>
        );
    }

    renderCollectionAlert() {
        // We don't show alerts if the collection is done.
        if (this.isCollectionDone()) {
            return null;
        }
        const forcastCollectionDate = this.props.paymentTerm.realreceiptdate;
        const today = moment().format(DateConstants.API_DATE_FORMAT);

        let alert = null;
        if (forcastCollectionDate < today) {
            alert = "La date prévis d'encaissement est dépassée.";
        }
        return alert ? (
            <Tooltip title={alert}>
                <Icon type="exclamation-circle" />
            </Tooltip>
        ) : null;
    }

    renderBankToCreditField() {
        const { banks } = this.props;
        const { getFieldValue } = this.props.form;
        return (
            <SelectItem
              id="bankToCreditId"
              showSearch
              initialValue={
                    getFieldValue('bankToCredit')
                        ? getFieldValue('bankToCredit').id.toString()
                        : null
                }
              options={banks.map(c => ({ value: c.id, label: c.name }))}
              form={this.props.form}
            />
        );
    }
}

export default class EditBusinessPaymentTermForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.paymentTerm,
            formClass: EditBusinessPaymentTermFormContent,
        };
    }
}
