import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import { InputItem, SelectItem, DatePickerItem } from 'components/forms/FormItems';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

import DateConstants from 'constants/DateConstants';

class UserBusinessFeeFormContent extends FormBase {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = () => {
        const { form, onSubmit } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const businessFee = this.getFeeFromValues(values);

            onSubmit(businessFee);
        });
    };

    getFeeFromValues = (values) => {
        const businessFee = {};
        const keys = Object.keys(values);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (k === 'date') {
                businessFee.date = values[k]
                    ? values[k].format(DateConstants.API_DATE_FORMAT)
                    : null;
            } else {
                businessFee[k] = values[k];
            }
        }

        // Adding the feeType
        businessFee.feetype = 'business_fee';

        return businessFee;
    };

    render() {
        const { business } = this.props;
        const { getFieldValue } = this.props.form;

        return (
          <Form hideRequiredMark>
            <Row gutter={8}>
              <Col span={8}>
                <DatePickerItem
                  id="date"
                  label={Locale.trans('user.mileageAllowance.date')}
                  initialValue={getFieldValue('date')}
                  form={this.props.form}
                />
              </Col>

              <Col span={8}>
                <SelectItem
                  id="business"
                  label={Locale.trans('user.mileageAllowance.business')}
                  initialValue={getFieldValue('business')}
                  options={business.map(m => ({
                      value: m.id,
                      label: `${m.reference} - ${m.title}`,
                  }))}
                  form={this.props.form}
                />
              </Col>

              <Col span={8}>
                <InputItem
                  id="cost"
                  required
                  label={Locale.trans('user.mileageAllowance.cost')}
                  initialValue={getFieldValue('cost')}
                  form={this.props.form}
                />
              </Col>

              <Col span={24}>
                <InputItem
                  id="comment"
                  required
                  label={Locale.trans('user.mileageAllowance.comment')}
                  initialValue={getFieldValue('comment')}
                  form={this.props.form}
                />
              </Col>

            </Row>

            <Row gutter={8}>
              <Col span={24}>
                {this.props.onSubmit
                            ? <Button
                              type="primary"
                              onClick={this.handleSubmit}
                              disabled={this.hasErrors()}
                            >
                              {Locale.trans('save')}
                            </Button>
                            : null}
              </Col>
            </Row>
          </Form>
        );
    }
}

export default class UserBusinessFeeForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.user,
            formClass: UserBusinessFeeFormContent,
        };
    }
}
