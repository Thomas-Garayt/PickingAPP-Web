import React from 'react';
import { Form, Button } from 'antd';
import FormItem from 'components/forms/FormItems';
import DeleteButton from 'components/forms/DeleteButton.jsx';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';
import DateConstants from 'constants/DateConstants';

import BusinessFormFields from './BusinessFormFields.jsx';
import BusinessInternalFormFields from './BusinessInternalFormFields.jsx';

class BusinessFormContent extends FormBase {
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
            if (err || this.hasErrors()) {
                return;
            }

            const business = this.getBusinessFromValues(values);

            this.props.onSubmit(business);
        });
    };

    getBusinessFromValues = (values) => {
        const business = {};
        business.isProduction = this.props.business.isProduction;
        const keys = Object.keys(values);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            switch (k) {
            case 'representativeId':
                business.representative = values[k];
                break;
            case 'clientId':
                business.client = values[k];
                break;
            case 'finalClientId':
                business.clientfinal = values[k];
                break;
            case 'poleId':
                business.pole = values[k];
                break;
            case 'tenderingProcessDate-picker':
                business.tenderingProcessDate = values[k]
                        ? {
                            date: {
                                year: values[k].year(),
                                month: values[k].month() + 1,
                                day: values[k].date(),
                            },
                            time: {
                                hour: 0,
                                minute: 0,
                            },
                        }
                        : null;
                break;
            case 'tenderingProcessReceptionDate-picker':
                business.tenderingProcessReceptionDate = values[k]
                        ? {
                            date: {
                                year: values[k].year(),
                                month: values[k].month() + 1,
                                day: values[k].date(),
                            },
                            time: {
                                hour: 0,
                                minute: 0,
                            },
                        }
                        : null;
                break;
            default:
                business[k] = values[k];
                break;
            }
        }
        return business;
    };

    render() {
        const { getFieldValue } = this.props.form;

        const isProductionBusiness = getFieldValue('isProduction');

        return (
            <Form hideRequiredMark>
                <div className="full-size-form">
                    <div className="form-content">
                        {isProductionBusiness ? (
                            <BusinessFormFields
                              form={this.props.form}
                              parent={this}
                              onSubmit={this.props.onSubmit}
                              poles={this.props.poles}
                              companies={this.props.companies}
                              contacts={this.props.contacts}
                            />
                        ) : (
                            <BusinessInternalFormFields
                              form={this.props.form}
                              onSubmit={this.props.onSubmit}
                            />
                        )}
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

    handleClientChange = () => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({ representativeId: null });
        this.forceUpdate();
    };

    renderRepresentativeField() {
        const { contacts } = this.props;

        if (!contacts || contacts.length === 0) {
            return null;
        }

        const { getFieldValue } = this.props.form;

        const clientId =
            getFieldValue('clientId') ||
            (getFieldValue('client') ? getFieldValue('client').id : null);

        const options = contacts
            .filter(c => c.company && c.company.id == clientId)
            .map(c => ({ value: c.id, label: `${c.firstname} ${c.lastname}` }));
        const representativeId = getFieldValue('representative')
            ? getFieldValue('representative').id.toString()
            : null;

        return (
            <FormItem.Select
              id="representativeId"
              showSearch
              required
              label={Locale.trans('business.representative')}
              placeholder={Locale.trans('business.representative')}
              initialValue={representativeId}
              options={options}
              form={this.props.form}
            />
        );
    }

    cmpContactByCompany = (c1, c2) => {
        const c1v = c1.company ? c1.company.name : '';
        const c2v = c2.company ? c2.company.name : '';

        if (c1v === c2v) {
            return 0;
        }

        return c1v > c2v ? 1 : -1;
    };

    renderClientField() {
        const { companies } = this.props;
        const { getFieldValue } = this.props.form;
        return (
            <FormItem.Select
              id="clientId"
              showSearch
              label={Locale.trans('business.client')}
              placeholder={Locale.trans('business.client')}
              initialValue={
                    getFieldValue('client') ? getFieldValue('client').id.toString() : null
                }
              options={companies.map(c => ({ value: c.id, label: c.name }))}
              onChange={this.handleClientChange}
              form={this.props.form}
            />
        );
    }

    renderFinalClientField() {
        const { companies } = this.props;
        const { getFieldValue } = this.props.form;
        return (
            <FormItem.Select
              id="finalClientId"
              showSearch
              label={Locale.trans('business.finalClient')}
              placeholder={Locale.trans('business.finalClient')}
              initialValue={
                    getFieldValue('clientfinal') ? getFieldValue('clientfinal').id.toString() : null
                }
              options={companies.map(c => ({ value: c.id, label: c.name }))}
              form={this.props.form}
            />
        );
    }

    renderPoleField() {
        const { poles } = this.props;
        const { getFieldValue } = this.props.form;
        return (
            <FormItem.Select
              id="poleId"
              showSearch
              label={Locale.trans('business.pole')}
              placeholder={Locale.trans('business.pole')}
              initialValue={getFieldValue('pole') ? getFieldValue('pole').id.toString() : null}
              options={poles.map(c => ({ value: c.id, label: c.name }))}
              form={this.props.form}
            />
        );
    }
}

export default class BusinessForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.business,
            formClass: BusinessFormContent,
        };
    }
}
