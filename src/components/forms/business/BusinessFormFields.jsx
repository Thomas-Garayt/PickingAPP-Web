import React from 'react';
import { Row, Col } from 'antd';
import { InputItem, SelectItem, DatePickerItem } from 'components/forms/FormItems';
import Locale from 'locale/LocaleFactory';

import BusinessConstants from 'constants/business/BusinessConstants';

export default class BusinessFormFields extends React.Component {
    handleStateChange() {
        // TODO : Il faut trouver un moyen de rendre tout ça plus propre.
        setTimeout(() => {
            const { getFieldValue } = this.props.form;
            if (getFieldValue('state') === BusinessConstants.PROGRESS) {
                const referenceQuote = getFieldValue('referenceQuote');

                let referenceQuoteError;
                if (!referenceQuote || referenceQuote.length === 0) {
                    referenceQuoteError = Locale.trans('error.required');
                }

                this.props.parent.setCustomFieldsError({
                    referenceQuote: referenceQuoteError,
                });
            } else {
                this.props.parent.setCustomFieldsError({
                    referenceQuote: undefined,
                });
            }
        }, 300);
    }

    componentDidMount() {
        this.handleStateChange();
    }

    render() {
        const { getFieldValue } = this.props.form;

        const state = ['waiting', 'costing', 'progress', 'closed', 'archived'];
        const result = ['win', 'loose'];

        return (
            <div>
                <Row gutter={8}>
                    <Col span={12}>
                        <InputItem
                          id="reference"
                          required
                          label={Locale.trans('business.reference')}
                          placeholder={Locale.trans('business.reference')}
                          form={this.props.form}
                        />
                    </Col>
                    <Col span={12}>
                        {this.renderPoleField()}
                    </Col>
                </Row>

                <InputItem
                  id="title"
                  required
                  label={Locale.trans('business.title')}
                  placeholder={Locale.trans('business.title')}
                  form={this.props.form}
                />

                <Row gutter={8}>
                    <Col span={12}>
                        <SelectItem
                          id="state"
                          required
                          label={Locale.trans('business.state')}
                          placeholder={Locale.trans('business.state')}
                          options={state.map(s => ({
                              value: s,
                              label: Locale.trans(`business.states.${s}`),
                          }))}
                          form={this.props.form}
                          onChange={() => {
                              this.handleStateChange();
                          }}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectItem
                          id="result"
                          label={Locale.trans('business.result')}
                          placeholder={Locale.trans('business.result')}
                          options={result.map(s => ({
                              value: s,
                              label: Locale.trans(`business.results.${s}`),
                          }))}
                          form={this.props.form}
                        />
                    </Col>
                </Row>

                <Row gutter={8}>
                    <Col span={12}>
                        <InputItem
                          id="referenceQuote"
                          label={Locale.trans('business.referenceQuote')}
                          placeholder={Locale.trans('business.referenceQuote')}
                          form={this.props.form}
                          validateStatus={this.props.parent.getValidateStatus('referenceQuote')}
                          help={this.props.parent.getHelp('referenceQuote')}
                          onChange={() => {
                              this.handleStateChange();
                          }}
                        />
                    </Col>
                    <Col span={12}>
                        <InputItem
                          id="amountQuote"
                          label={Locale.trans('business.amountQuote')}
                          placeholder={Locale.trans('business.amountQuote')}
                          addonAfter="€"
                          form={this.props.form}
                          rules={[
                              {
                                  //type: 'number',
                                  pattern: /^\d+(\.\d+)?$/,
                                  message: Locale.trans('error.amountquote.invalid'),
                              }
                          ]}
                        />
                    </Col>
                </Row>

                {this.renderClientField()}
                {this.renderRepresentativeField()}
                {this.renderFinalClientField()}

                <Row gutter={8}>
                    <Col span={12}>
                        <InputItem
                          id="tenderingProcessReference"
                          label={Locale.trans('business.tenderingProcess')}
                          placeholder={Locale.trans('business.tenderingProcessReference')}
                          form={this.props.form}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerItem
                          id="tenderingProcessDate-picker"
                          label={Locale.trans('business.tenderingProcessDate')}
                          initialValue={getFieldValue('tenderingProcessDate')}
                          form={this.props.form}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerItem
                          id="tenderingProcessReceptionDate-picker"
                          label={Locale.trans('business.tenderingProcessReceptionDate')}
                          initialValue={getFieldValue('tenderingProcessReceptionDate')}
                          form={this.props.form}
                        />
                    </Col>
                </Row>
            </div>
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
            .map(c => ({ value: c.id, label: `${c.lastname} ${c.firstname}` }));
        const representativeId = getFieldValue('representative')
            ? getFieldValue('representative').id.toString()
            : null;

        return (
            <SelectItem
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
            <SelectItem
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
            <SelectItem
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
            <SelectItem
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
