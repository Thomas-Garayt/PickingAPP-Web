import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import { InputItem, SelectItem, DatePickerItem } from 'components/forms/FormItems';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

import DateConstants from 'constants/DateConstants';


export default class AbsenceCounterForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.user,
            formClass: AbsenceCounterFormContent,
        };
    }
}


class AbsenceCounterFormContent extends FormBase {
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

            const absenceCounter = this.getAbsenceCounterFromValues(values);

            onSubmit(absenceCounter);
        });
    };

    getAbsenceCounterFromValues = (values) => {
        const { user } = this.props;

        const absenceCounter = {};
        const keys = Object.keys(values);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (k === 'startDate') {
                absenceCounter.startDate = values[k]
                    ? values[k].format(DateConstants.API_DATE_FORMAT)
                    : null;
            } else {
                if (k === 'endDate') {
                    absenceCounter.endDate = values[k]
                        ? values[k].format(DateConstants.API_DATE_FORMAT)
                        : null;
                } else {
                    absenceCounter[k] = values[k];
                }
            }
        }

        absenceCounter.user = user.id;

        return absenceCounter;
    }

    render() {
        const { absenceType } = this.props;
        const { getFieldValue } = this.props.form;

        return (
          <Form hideRequiredMark>
            <Row gutter={8}>

                <Col span={4}>
                    <SelectItem
                        id="absenceType"
                        label={Locale.trans('user.absencecounter.type')}
                        initialValue={getFieldValue('absenceType')}
                        options={absenceType.map(m => ({
                        value: m.id,
                        label: `${m.title}`,
                        }))}
                        form={this.props.form}
                    />
                </Col>

                <Col span={4}>
                    <InputItem
                        id="countDays"
                        required
                        label={Locale.trans('user.absencecounter.total')}
                        initialValue={getFieldValue('countDays')}
                        form={this.props.form}
                    />
                </Col>

                <Col span={4}>
                    <DatePickerItem
                        id="startDate"
                        label={Locale.trans('user.absencecounter.startDate')}
                        initialValue={getFieldValue('startDate')}
                        form={this.props.form}
                    />
                </Col>

                <Col span={4}>
                    <DatePickerItem
                        id="endDate"
                        label={Locale.trans('user.absencecounter.endDate')}
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
