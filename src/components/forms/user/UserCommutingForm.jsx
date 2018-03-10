import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import { InputItem, DatePickerItem } from 'components/forms/FormItems';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

import DateConstants from 'constants/DateConstants';

const COMMUTING_KILOMETRICAL_COST = 0.208;

class UserCommutingFormContent extends FormBase {
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

            const commuting = this.getCommutingFromValues(values);

            onSubmit(commuting);
        });
    };

    getCommutingFromValues = (values) => {
        const commuting = {};
        for (const k in values) {
            if (k === 'startDate-picker') {
                commuting.startDate = values[k]
                    ? values[k].format(DateConstants.API_DATE_FORMAT)
                    : null;
            } else if (k === 'endDate-picker') {
                commuting.endDate = values[k]
                    ? values[k].format(DateConstants.API_DATE_FORMAT)
                    : null;
            } else {
                commuting[k] = values[k];
            }
        }
        return commuting;
    };

    handleDistanceChange = (e) => {
        const distance = parseFloat(e.target.value);

        this.props.form.setFieldsValue({
            cost: distance ? distance * COMMUTING_KILOMETRICAL_COST : null,
        });
    };

    render() {
        const { getFieldValue } = this.props.form;

        return (
            <Form hideRequiredMark>
                <Row gutter={8}>
                    <Col span={8}>
                        <InputItem
                          id="distance"
                          required
                          onChange={this.handleDistanceChange}
                          label={Locale.trans('user.commuting.distance')}
                          initialValue={getFieldValue('distance')}
                          form={this.props.form}
                        />
                    </Col>
                    <Col span={8}>
                        <InputItem
                          id="cost"
                          required
                          label={Locale.trans('user.commuting.cost')}
                          initialValue={getFieldValue('cost')}
                          form={this.props.form}
                        />
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <DatePickerItem
                          id="startDate-picker"
                          label={Locale.trans('user.commuting.startDate')}
                          initialValue={getFieldValue('startDate')}
                          form={this.props.form}
                        />
                    </Col>
                    <Col span={8}>
                        <DatePickerItem
                          id="endDate-picker"
                          label={Locale.trans('user.commuting.endDate')}
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

export default class UserCommutingForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.user,
            formClass: UserCommutingFormContent,
        };
    }
}
