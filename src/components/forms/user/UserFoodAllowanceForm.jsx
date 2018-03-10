import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import { InputItem, DatePickerItem } from 'components/forms/FormItems';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

import DateConstants from 'constants/DateConstants';

class UserFoodAllowanceFormContent extends FormBase {
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

            const foodAllowance = this.getAllowanceFromValues(values);

            onSubmit(foodAllowance);
        });
    };

    getAllowanceFromValues = (values) => {
        const foodAllowance = {};
        for (const k in values) {
            if (k === 'startDate-picker') {
                foodAllowance.startDate = values[k]
                    ? values[k].format(DateConstants.API_DATE_FORMAT)
                    : null;
            } else if (k === 'endDate-picker') {
                foodAllowance.endDate = values[k]
                    ? values[k].format(DateConstants.API_DATE_FORMAT)
                    : null;
            } else {
                foodAllowance[k] = values[k];
            }
        }
        return foodAllowance;
    };

    render() {
        const { getFieldValue } = this.props.form;

        return (
            <Form hideRequiredMark>
                <Row gutter={8}>
                    <Col span={8}>
                        <InputItem
                          id="foodAllowance"
                          required
                          label={Locale.trans('user.foodAllowance.foodAllowance')}
                          initialValue={getFieldValue('foodAllowance')}
                          form={this.props.form}
                        />
                    </Col>
                    <Col span={8}>
                        <DatePickerItem
                          id="startDate-picker"
                          label={Locale.trans('user.foodAllowance.startDate')}
                          initialValue={getFieldValue('startDate')}
                          form={this.props.form}
                        />
                    </Col>
                    <Col span={8}>
                        <DatePickerItem
                          id="endDate-picker"
                          label={Locale.trans('user.foodAllowance.endDate')}
                          initialValue={getFieldValue('endDate')}
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

export default class UserFoodAllowanceForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.user,
            formClass: UserFoodAllowanceFormContent,
        };
    }
}
