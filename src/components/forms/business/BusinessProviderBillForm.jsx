import React from "react";
import { Row, Col, Form, Icon, Button, Tooltip, Radio } from "antd";
import {
    InputItem,
    SelectItem,
    DatePickerItem
} from "components/forms/FormItems";
import BusinessProdiverBillOccurenceTable from "components/forms/business/BusinessProviderBillOccurenceTable.jsx";
import DeleteButton from "components/forms/DeleteButton.jsx";
import Locale from "locale/LocaleFactory";
import FormBase from "components/forms/FormBase.jsx";
import FormWrapperBase from "components/forms/FormWrapperBase.jsx";
import DateConstants from "constants/DateConstants";

import ProviderBillConstants from "constants/business/ProviderBillConstants";
import moment from "moment";

import ProviderBillStore from "stores/business/ProviderBillStore";
import ProviderBillActions from "actions/business/ProviderBillActions";

import MathService from "services/utils/MathService";
import StringService from "services/utils/StringService";

const paymentTypes = [
    ProviderBillConstants.PAYMENT_CARD,
    ProviderBillConstants.LEVY,
    ProviderBillConstants.CHEQUE,
    ProviderBillConstants.TRANSFER
];

const periodicities = [
    ProviderBillConstants.MONTHLY,
    ProviderBillConstants.QUATERLY,
    ProviderBillConstants.BI_ANNUAL
];

const daysOfWeek = [
    DateConstants.MONDAY,
    DateConstants.TUESDAY,
    DateConstants.WEDNESDAY,
    DateConstants.THURSDAY,
    DateConstants.FRIDAY,
    DateConstants.SATURDAY,
    DateConstants.SUNDAY
];

const dayNumberOfMonth = [1, 2, 3, -1];

function getDateOfMonthByWeekDay(year, month, dayNumberOfMonth, dayOfWeek) {
    const dayOfWeekNumbers = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 0
    };
    const date = moment();
    date.year(year);
    date.month(month);
    date.date(1);
    date.day(dayOfWeekNumbers[dayOfWeek]);
    if (date.month() < month) {
        date.add(1, "w");
    }
    if (dayNumberOfMonth > 1) {
        date.add(dayNumberOfMonth - 1, "w");
    } else if (dayNumberOfMonth == -1) {
        date.add(1, "M");
        date.subtract(1, "w");
    }
    return date;
}

function cloneOccurence(occurence) {
    return {
        id: occurence.id,
        amount: occurence.amount,
        paymentDate: occurence.paymentDate
    };
}

class EditBusinessProviderBillFormContent extends FormBase {
    constructor(props) {
        super();
        Locale.initMoment();
        const occurences = props.providerBill.occurences || [];
        const business = props.business;

        this.state = {
            businessId: props.business.id,
            iasbillnumber: ProviderBillStore.getNextReference(business.id),
            paymentState: props.providerBill.state,
            shouldUpdateOccurences: false,
            editedOccurences: occurences.map(cloneOccurence)
        };
    }

    componentDidMount() {
        const { business } = this.props;

        // To disabled submit button at the beginning.
        this.props.form.validateFields();

        ProviderBillStore.addChangeListener(this.getNextReference);
    }

    componentWillUnmount() {
        ProviderBillStore.removeChangeListener(this.getNextReference);
    }

    getNextReference = () => {
        const businessId = this.state;

        this.setState({
            iasbillnumber: ProviderBillStore.getNextReference(businessId)
        });

    };

    handleSubmit = () => {
        const { form } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const providerBill = this.getProviderBillFromValues(values);

            this.props.onSubmit(providerBill, this.state.editedOccurences);
        });
    };

    getProviderBillFromValues = values => {
        const providerBill = {};
        const keys = Object.keys(values);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            switch (k) {
                case "billdate-picker":
                    providerBill.billdate = values[k]
                        ? values[k].format(DateConstants.API_DATE_FORMAT)
                        : null;
                    break;
                case "receiptdate-picker":
                    providerBill.receiptdate = values[k]
                        ? values[k].format(DateConstants.API_DATE_FORMAT)
                        : null;
                    break;
                case "disbursementdate-picker":
                    providerBill.disbursementdate = values[k]
                        ? values[k].format(DateConstants.API_DATE_FORMAT)
                        : null;
                    break;
                case "endPeriodDate-picker":
                    providerBill.endPeriodDate = values[k]
                        ? values[k].format(DateConstants.API_DATE_FORMAT)
                        : null;
                    break;
                case "companyId":
                    providerBill.company = values[k];
                    break;
                case "businessId":
                    providerBill.business = values[k];
                    break;
                case "bankToDebitId":
                    providerBill.banktodebit = values[k];
                    break;
                default:
                    providerBill[k] = values[k];
                    break;
            }
        }

        if(!providerBill.business) {
            const { business } = this.props;
            providerBill.business = business.id;
        }

        return providerBill;
    };

    isBillingDone = () => {
        const state = this.props.form.getFieldValue("state");
        return state !== ProviderBillConstants.WAITING_RECEIPT;
    };

    isPaymentDone = () => {
        const state = this.props.form.getFieldValue("state");
        return (
            state === ProviderBillConstants.PAYED ||
            state === ProviderBillConstants.DISBURSED
        );
    };

    isCollectionDone = () => {
        const state = this.props.form.getFieldValue("state");
        return state === ProviderBillConstants.DISBURSED;
    };

    updatePaymentState = s => {
        this.props.form.setFieldsValue({
            state: s
        });
    };

    getIasBillNumber = () => {
        const { business } = this.props;
        ProviderBillActions.loadNextReference(business.id)
            .then(() => {
                this.getNextReference();
                const iasbillnumber = this.state.iasbillnumber;
                this.props.form.setFieldsValue({
                    iasbillnumber: iasbillnumber
                });
            });
    };

    checkReceiptDate = (rule, value, callback) => {
        const form = this.props.form;
        const billDate = form.getFieldValue("billdate-picker");
        if (value && billDate.format("YYYYMMDD") > value.format("YYYYMMDD")) {
            callback(
                Locale.trans(
                    "business.providerBill.error.receiptDateBeforeBill"
                )
            );
        } else {
            callback();
        }
    };

    isPeriodicity = () => {
        const periodicity = this.props.form.getFieldValue("periodicity");
        return periodicity && periodicity.length > 0;
    };

    updateOccurences = () => {
        const { shouldUpdateOccurences, editedOccurences } = this.state;
        const { getFieldValue } = this.props.form;

        if(!shouldUpdateOccurences || this.props.providerBill.id > 0) {
            return;
        }

        const newOccurences = [];
        const amount = getFieldValue("amount");
        if (this.isPeriodicity() && amount) {
            const dates = this.getOccurenceDates();
            for (let i = 0; i < dates.length; i++) {
                newOccurences.push({
                    id: "new" + i,
                    paymentDate: dates[i].format(DateConstants.API_DATE_FORMAT),
                    amount: amount
                });
            }
        }

        this.state.editedOccurences = newOccurences;
        this.state.shouldUpdateOccurences = false;
    };

    getOccurenceDates = () => {
        const { getFieldValue } = this.props.form;

        const periodicity = getFieldValue("periodicity");
        const beginPerioddate = getFieldValue("billdate-picker");
        const endPeriodDate = getFieldValue("endPeriodDate-picker");
        const periodDayNumberOfMonth = getFieldValue("periodDayNumberOfMonth");
        const periodDayOfMonth = getFieldValue("periodDayOfMonth");
        const periodDateOfMonth = getFieldValue("periodDateOfMonth");

        if (
            periodicity &&
            beginPerioddate &&
            endPeriodDate &&
            ((periodDayNumberOfMonth && periodDayOfMonth) || periodDateOfMonth)
        ) {
            const beginMonth = beginPerioddate.month();
            const beginYear = beginPerioddate.year();
            const endMonth = endPeriodDate.month();
            const endYear = endPeriodDate.year();

            let currentMonth = beginMonth;
            let currentYear = beginYear;
            let currentDate;

            let dates = [];

            let iThreshold = 0;
            while (
                iThreshold < 24 &&
                (!currentDate || currentDate < endPeriodDate)
            ) {
                if (periodDayNumberOfMonth && periodDayOfMonth) {
                    currentDate = getDateOfMonthByWeekDay(
                        currentYear,
                        currentMonth,
                        periodDayNumberOfMonth,
                        periodDayOfMonth
                    );
                } else if (periodDateOfMonth) {
                    currentDate = moment();
                    currentDate.year(currentYear);
                    currentDate.month(currentMonth);
                    currentDate.date(periodDateOfMonth);
                }

                dates.push(currentDate);

                switch (periodicity) {
                    case ProviderBillConstants.MONTHLY:
                        currentMonth++;
                        break;
                    case ProviderBillConstants.QUATERLY:
                        currentMonth += 3;
                        break;
                    case ProviderBillConstants.BI_ANNUAL:
                        currentMonth += 6;
                        break;
                    default:
                        return;
                }
                if (currentMonth > 11) {
                    currentYear++;
                    currentMonth -= 12;
                }
            }

            return dates.filter(d => d > beginPerioddate && d < endPeriodDate);
        }

        return [];
    };

    updateOccurence = occurence => {
        const { editedOccurences, shouldUpdateOccurences } = this.state;

        const iOccurence = editedOccurences.findIndex(
            o => o.id === occurence.id
        );
        if (iOccurence !== -1) {
            editedOccurences[iOccurence] = occurence;
        } else {
            editedOccurences.push(occurence);
        }
        this.setState({
            editedOccurences
        });
    };

    render() {
        const {
            getFieldValue,
            setFieldsValue,
            getFieldDecorator
        } = this.props.form;
        const { providerBill, business, company } = this.props;

        this.updateOccurences();

        getFieldDecorator("state");

        const paymentType = getFieldValue("paymenttype");
        const iasBillNumber = getFieldValue("iasbillnumber");

        // const readOnly = this.isBillingDone();
        const readOnly = false;

        const provider = { addresses: [] };
        const billingAddress = provider.addresses.find(a => a.isBilling);
        return (
            <Form hideRequiredMark>
                <div className="full-size-form business-payment-term">
                    <div className="form-content">
                        <h1>
                            {iasBillNumber ? (
                                <React.Fragment>
                                    Facture : N° {iasBillNumber}
                                </React.Fragment>
                            ) : (
                                "Nouvelle Facture"
                            )}
                        </h1>

                        <h2>Informations de Facturation</h2>
                        <div>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <div className="label">
                                        {Locale.trans(
                                            "business.providerBill.description"
                                        )}
                                    </div>
                                    <InputItem
                                        id="description"
                                        required
                                        placeholder={Locale.trans(
                                            "business.providerBill.description"
                                        )}
                                        initialValue={
                                            getFieldValue("description")
                                                ? getFieldValue(
                                                      "description"
                                                  ).toString()
                                                : null
                                        }
                                        form={this.props.form}
                                        readOnly={readOnly}
                                    />
                                </Col>
                            </Row>

                            <Row gutter={8}>
                                <Col span={12}>
                                    <div className="label">
                                        {Locale.trans(
                                            "business.providerBill.provider"
                                        )}
                                    </div>
                                    {this.renderProviderField()}
                                </Col>
                                <Col span={12}>
                                    <div className="label">
                                        {Locale.trans(
                                            "business.providerBill.providerBillNumber"
                                        )}
                                    </div>
                                    <InputItem
                                        id="providerbillnumber"
                                        required
                                        initialValue={getFieldValue(
                                            "providerbillnumber"
                                        )}
                                        form={this.props.form}
                                    />
                                </Col>
                            </Row>

                            <Row gutter={8}>
                                <Col span={12}>
                                    <div className="label">
                                        {Locale.trans(
                                            "business.providerBill.internalReference"
                                        )}
                                    </div>
                                    <InputItem
                                        id="iasbillnumber"
                                        initialValue={getFieldValue("iasbillnumber")}
                                        readOnly={
                                            !!providerBill && !!providerBill.id
                                        }
                                        form={this.props.form}
                                    />
                                </Col>
                                <Col span={12}>
                                    <div className="label">
                                        {Locale.trans(
                                            this.isPeriodicity() ? "business.providerBill.amountByOccurence" : "business.providerBill.amount"
                                        )}
                                    </div>
                                    <InputItem
                                        id="amount"
                                        required
                                        addonAfter="€ HT"
                                        initialValue={getFieldValue("amount")}
                                        onChange={() => {
                                            this.state.shouldUpdateOccurences = true;
                                        }}
                                        form={this.props.form}
                                    />
                                </Col>
                            </Row>
                        </div>

                        <h2>Affectation</h2>
                        <div>
                            <div className="label">
                                {Locale.trans(
                                    "business.providerBill.business"
                                )}
                            </div>
                            {business ? (
                                <div>
                                    <div
                                        className="ant-input"
                                        style={{
                                            marginTop: "4px",
                                            marginBottom: "16px"
                                        }}
                                    >
                                        {business.reference} - {business.title}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div>
                                        {this.renderBusinessField()}
                                    </div>
                                </div>
                            )}
                        </div>

                        <h2>Echéancier de Facturation</h2>
                        <div className="dates">
                            <div className="label">
                                {Locale.trans("business.providerBill.billDate")}
                            </div>
                            <DatePickerItem
                                id="billdate-picker"
                                initialValue={getFieldValue("billdate")}
                                form={this.props.form}
                            />
                            {this.renderBillingButton()}
                            {this.renderBillingAlert()}

                            {paymentType === ProviderBillConstants.CHEQUE && (
                                <React.Fragment>
                                    <div className="label">
                                        {Locale.trans(
                                            "business.providerBill.paymentDate"
                                        )}
                                    </div>
                                    <DatePickerItem
                                        id="disbursementdate-picker"
                                        initialValue={getFieldValue(
                                            "disbursementdate"
                                        )}
                                        form={this.props.form}
                                    />
                                    {this.renderPaymentButton()}
                                </React.Fragment>
                            )}
                            {!this.isPeriodicity() && (
                                <React.Fragment>
                                    <div className="label">
                                        {Locale.trans(
                                            "business.providerBill.disbursementDate"
                                        )}
                                    </div>
                                    <DatePickerItem
                                        id="receiptdate-picker"
                                        initialValue={getFieldValue("receiptdate")}
                                        form={this.props.form}
                                        rules={[
                                            {
                                                validator: this.checkReceiptDate
                                            }
                                        ]}
                                        ref={n => (this.receiptdatepicker = n)}
                                    />
                                    {this.renderCollectionButton()}
                                    {this.renderCollectionAlert()}
                                </React.Fragment>
                            )}
                        </div>
                        <Row gutter={8}>
                            <Col span={12}>
                                <div className="label">
                                    {Locale.trans(
                                        "business.providerBill.periodicity"
                                    )}
                                </div>
                                <SelectItem
                                    id="periodicity"
                                    options={periodicities.map(s => ({
                                        value: s,
                                        label: Locale.trans(
                                            `business.providerBill.periodicities.${s}`
                                        )
                                    }))}
                                    initialValue={getFieldValue("periodicity")}
                                    onChange={() => {
                                        this.state.shouldUpdateOccurences = true;
                                    }}
                                    form={this.props.form}
                                />
                            </Col>
                            {this.isPeriodicity() && (
                                <Col span={12}>
                                    <div className="label">
                                        {Locale.trans(
                                            "business.providerBill.endPeriodDate"
                                        )}
                                    </div>
                                    <DatePickerItem
                                        id="endPeriodDate-picker"
                                        initialValue={getFieldValue(
                                            "endPeriodDate"
                                        )}
                                        onChange={() => {
                                            this.state.shouldUpdateOccurences = true;
                                        }}
                                        form={this.props.form}
                                    />
                                </Col>
                            )}
                        </Row>
                        {this.isPeriodicity() && (
                            <React.Fragment>
                                <div className="periodicity-day-selection-row">
                                    <Radio
                                        checked={
                                            !getFieldValue("periodDateOfMonth")
                                        }
                                    />
                                    Le{" "}
                                    <SelectItem
                                        id="periodDayNumberOfMonth"
                                        options={dayNumberOfMonth.map(s => ({
                                            value: s,
                                            label: Locale.trans(
                                                `dayNumbersOfMonth.${s}`
                                            )
                                        }))}
                                        initialValue={getFieldValue(
                                            "periodDayNumberOfMonth"
                                        )}
                                        form={this.props.form}
                                        onChange={v => {
                                            if (v && v.length > 0) {
                                                setFieldsValue({
                                                    periodDateOfMonth: null
                                                });
                                            }
                                            this.state.shouldUpdateOccurences = true;
                                        }}
                                    />{" "}
                                    <SelectItem
                                        id="periodDayOfMonth"
                                        options={daysOfWeek.map(s => ({
                                            value: s,
                                            label: Locale.trans(s)
                                        }))}
                                        initialValue={getFieldValue(
                                            "periodDayOfMonth"
                                        )}
                                        onChange={() => {
                                            this.state.shouldUpdateOccurences = true;
                                        }}
                                        form={this.props.form}
                                    />{" "}
                                    du mois
                                </div>
                                <div className="periodicity-day-selection-row">
                                    <Radio
                                        checked={
                                            !!getFieldValue("periodDateOfMonth")
                                        }
                                    />
                                    Le{" "}
                                    <InputItem
                                        id="periodDateOfMonth"
                                        initialValue={getFieldValue(
                                            "periodDateOfMonth"
                                        )}
                                        form={this.props.form}
                                        onChange={v => {
                                            if (
                                                v.target.value &&
                                                v.target.value.length > 0
                                            ) {
                                                setFieldsValue({
                                                    periodDayNumberOfMonth: null,
                                                    periodDayOfMonth: null
                                                });
                                            }
                                            this.state.shouldUpdateOccurences = true;
                                        }}
                                    />{" "}
                                    du mois
                                </div>
                                <BusinessProdiverBillOccurenceTable
                                    onChange={this.updateOccurence}
                                    occurences={this.state.editedOccurences}
                                />
                            </React.Fragment>
                        )}

                        <h2>Mode de Règlement</h2>
                        <div>
                            <Row gutter={8}>
                                <Col span={12}>
                                    <div className="label">
                                        {Locale.trans(
                                            "business.providerBill.bankToDebit"
                                        )}
                                    </div>
                                    {this.renderBankToDebitField()}
                                </Col>
                                <Col span={12}>
                                    <div className="label">
                                        {Locale.trans(
                                            "business.providerBill.paymentType"
                                        )}
                                    </div>
                                    <SelectItem
                                        id="paymenttype"
                                        options={paymentTypes.map(s => ({
                                            value: s,
                                            label: Locale.trans(
                                                `business.providerBill.paymentTypes.${s}`
                                            )
                                        }))}
                                        initialValue={getFieldValue(
                                            "paymenttype"
                                        )}
                                        form={this.props.form}
                                    />
                                </Col>
                                <Col span={12}>
                                    {paymentType ===
                                    ProviderBillConstants.CHEQUE ? (
                                        <div>
                                            <div className="label">
                                                {Locale.trans(
                                                    "business.providerBill.chequeNumber"
                                                )}
                                            </div>
                                            <InputItem
                                                id="chequenumber"
                                                initialValue={getFieldValue(
                                                    "chequenumber"
                                                )}
                                                form={this.props.form}
                                            />
                                        </div>
                                    ) : null}
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="form-action-barre">
                        {this.props.onSubmit ? (
                            <Button
                                type="primary"
                                onClick={this.handleSubmit}
                                disabled={this.hasErrors()}
                            >
                                {Locale.trans("save")}
                            </Button>
                        ) : null}
                        &nbsp;
                        {this.props.onDelete && !this.isBillingDone() ? (
                            <DeleteButton onDelete={this.props.onDelete} />
                        ) : null}
                    </div>
                </div>
            </Form>
        );
    }

    handleEmissionButtonclick = () => {

        if(!this.isPeriodicity()) {
            // This dirty code is here the force the validation of the
            // receipt date field.
            const v = this.props.form.getFieldValue("receiptdate-picker");
            this.receiptdatepicker.input.props.onChange(v);
        }

        this.updatePaymentState(ProviderBillConstants.WAITING_PAYMENT);
        this.getIasBillNumber();
    };

    handlePaymentButtonclick = () => {
        this.updatePaymentState(ProviderBillConstants.PAYED);
    };

    renderBillingButton() {
        return (
            <Button
                className={this.isBillingDone() ? "done" : null}
                disabled={this.isBillingDone()}
                icon={this.isBillingDone() ? "check" : null}
                onClick={this.handleEmissionButtonclick}
            >
                Réception
            </Button>
        );
    }

    renderPaymentButton() {
        return (
            <Button
                className={this.isPaymentDone() ? "done" : null}
                disabled={this.isPaymentDone()}
                icon={this.isPaymentDone() ? "check" : null}
                onClick={this.handlePaymentButtonclick}
            >
                Règlement
            </Button>
        );
    }

    renderBillingAlert() {
        // We don't show alerts if the billing is done.
        if (this.isBillingDone()) {
            return null;
        }

        const billingDate = this.props.providerBill.billdate;
        const today = moment().format(DateConstants.API_DATE_FORMAT);

        let alert = null;
        if (billingDate < today) {
            alert = "La date de reception est dépassée.";
        }

        return alert ? (
            <Tooltip title={alert}>
                <Icon type="exclamation-circle" />
            </Tooltip>
        ) : null;
    }

    renderCollectionButton() {
        return (
            <Button
                className={this.isCollectionDone() ? "done" : ""}
                disabled={!this.isBillingDone() || this.isCollectionDone()}
                icon={this.isCollectionDone() ? "check" : null}
                onClick={() => {
                    this.updatePaymentState(ProviderBillConstants.DISBURSED);
                }}
            >
                Décaissement
            </Button>
        );
    }

    renderCollectionAlert() {
        // We don't show alerts if the collection is done.
        if (this.isCollectionDone()) {
            return null;
        }
        const receiptDate = this.props.providerBill.receiptdate;
        const today = moment().format(DateConstants.API_DATE_FORMAT);

        let alert = null;
        if (receiptDate < today) {
            alert = "La date prévis de règlement est dépassée.";
        }
        return alert ? (
            <Tooltip title={alert}>
                <Icon type="exclamation-circle" />
            </Tooltip>
        ) : null;
    }

    renderBankToDebitField() {
        const { banks } = this.props;
        const { getFieldValue } = this.props.form;
        return (
            <SelectItem
                id="bankToDebitId"
                showSearch
                initialValue={
                    getFieldValue("banktodebit")
                        ? getFieldValue("banktodebit").id.toString()
                        : null
                }
                options={banks.map(c => ({ value: c.id, label: c.name }))}
                form={this.props.form}
            />
        );
    }

    renderBusinessField() {
        const { businesses } = this.props;
        const { getFieldValue } = this.props.form;
        return (
            <SelectItem
                id="businessId"
                showSearch
                required
                placeholder={Locale.trans("business.providerBill.business")}
                initialValue={
                    getFieldValue("business")
                        ? getFieldValue("business").id.toString()
                        : null
                }
                options={businesses.map(b => ({
                    value: b.id,
                    label: b.reference + " - " + b.title
                }))}
                onChange={this.handleClientChange}
                form={this.props.form}
            />
        );
    }

    renderProviderField() {
        const { companies } = this.props;
        const { getFieldValue } = this.props.form;
        return (
            <SelectItem
                id="companyId"
                showSearch
                placeholder={Locale.trans("business.providerBill.provider")}
                initialValue={
                    getFieldValue("company")
                        ? getFieldValue("company").id.toString()
                        : null
                }
                options={companies
                    .filter(c => c.isSupplier)
                    .map(c => ({ value: c.id, label: c.name }))}
                onChange={this.handleClientChange}
                form={this.props.form}
            />
        );
    }

}

export default class BusinessProviderBillForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.providerBill,
            formClass: EditBusinessProviderBillFormContent
        };
    }
}
