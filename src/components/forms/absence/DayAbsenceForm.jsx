import React from 'react';
import { Form, Button, Row, Col, Radio } from 'antd';
import { SelectItem, LinkedDatePickerItem, RadioGroupItem } from 'components/forms/FormItems';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

import DateConstants from 'constants/DateConstants';
import DateService from 'services/utils/DateService';

class DayAbsenceFormContent extends FormBase {
    constructor(props) {
        super();
        this.state = {
            totalDay: null,

            startValue: null,
            endValue: null,

            startMorning: null,
            endMorning: null,
        };
    }

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

            const dayAbsence = this.getDayAbsenceFromValues(values);

            onSubmit(dayAbsence);
        });
    };

    disabledStartDate = (startValue) => {
        const { endValue } = this.state;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    disabledEndDate = (endValue) => {
        const { startValue } = this.state;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    updateTotalDay = (field, value, fieldRadio, valueRadio) => {
        const { startValue, endValue, startMorning, endMorning } = this.state;

        const s = field === 'startValue' ? value : startValue;
        const e = field === 'endValue' ? value : endValue;

        let totalDay = 0;
        if (s && e) {
            const c = s.clone();
            const end = e.clone();
            end.add(1, 'days');
            while (c.add(1, 'days').diff(end) < 0) {
                if (DateService.isWorkingDay(c)) {
                    totalDay++;
                }
            }
        }

        if (totalDay) {
            totalDay = this.applyStartAndEnd(totalDay, startMorning, endMorning, fieldRadio, valueRadio);
            this.setState({ totalDay });
        }
    };

    applyStartAndEnd = (dif, startMorning, endMorning, fieldRadio, valueRadio) => {
        if (fieldRadio === 'endRadio') {
            if (startMorning === false) {
                dif -= 0.5;
            }
            if (valueRadio === true) {
                dif -= 0.5;
            }
        } else if (fieldRadio === 'startRadio') {
            if (valueRadio === false) {
                dif -= 0.5;
            }
            if (endMorning === true) {
                dif -= 0.5;
            }
        } else if (startMorning != null && endMorning != null) {
            if (startMorning === false) {
                dif -= 0.5;
            }
            if (endMorning === true) {
                dif -= 0.5;
            }
        }

        return dif;
    };

    onStartChange = (value) => {
        this.setState({ startValue: value });
        this.updateTotalDay('startValue', value, null, null);
    };

    onEndChange = (value) => {
        this.setState({ endValue: value });
        this.updateTotalDay('endValue', value, null, null);
    };

    onStartMorningChange = (obj) => {
        this.setState({ startMorning: obj.target.value });
        this.updateTotalDay(null, null, 'startRadio', obj.target.value);
    };

    onEndMorningChange = (obj) => {
        this.setState({ endMorning: obj.target.value });
        this.updateTotalDay(null, null, 'endRadio', obj.target.value);
    };

    getDayAbsenceFromValues = (values) => {
        const dayAbsence = {};
        const keys = Object.keys(values);

        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];

            if (k === 'startDate') {
                dayAbsence.startDate = values[k]
                    ? values[k].format(DateConstants.API_DATE_FORMAT)
                    : null;
            } else if (k === 'endDate') {
                dayAbsence.endDate = values[k]
                        ? values[k].format(DateConstants.API_DATE_FORMAT)
                        : null;
            } else {
                dayAbsence[k] = values[k];
            }
        }

        return dayAbsence;
    };

    render() {
        const { absenceType } = this.props;
        const { getFieldValue } = this.props.form;
        const { totalDay, startValue, endValue } = this.state;

        const initRadioStart = true;
        const initRadioEnd = false;

        const RadioGroup = Radio.Group;
        const options = [
            { label: Locale.trans('matin'), value: true },
            { label: Locale.trans('apresmidi'), value: false },
        ];

        return (
            <Form hideRequiredMark>
                <Row gutter={8}>
                    <Col span={4}>
                        <SelectItem
                          id="absenceType"
                          label={Locale.trans('user.absence.type')}
                          initialValue={getFieldValue('absenceType')}
                          options={absenceType.map(m => ({
                              value: m.id,
                              label: `${m.title}`,
                          }))}
                          form={this.props.form}
                        />
                    </Col>

                    <Col span={4}>
                        <LinkedDatePickerItem
                          id="startDate"
                          label={Locale.trans('user.absence.startdate')}
                          initialValue={getFieldValue('startDate')}
                          form={this.props.form}
                          disabledDate={this.disabledStartDate}
                          value={startValue}
                          onChange={this.onStartChange}
                        />
                    </Col>

                    <Col span={4}>
                        <LinkedDatePickerItem
                          id="endDate"
                          label={Locale.trans('user.absence.enddate')}
                          initialValue={getFieldValue('endDate')}
                          form={this.props.form}
                          disabledDate={this.disabledEndDate}
                          value={endValue}
                          onChange={this.onEndChange}
                        />
                    </Col>

                    <Col span={4}>
                        <label className="ant-form-item-required">
                            {totalDay != null
                                ? totalDay > 1
                                  ? `${Locale.trans('total')
                                    } : ${
                                    totalDay
                                    } ${
                                    Locale.trans('days')}`
                                  : `${Locale.trans('total')
                                    } : ${
                                    totalDay
                                    } ${
                                    Locale.trans('day')}`
                                : null}
                        </label>
                    </Col>
                </Row>

                <Row gutter={8}>
                    <Col span={4} />
                    <Col span={4}>
                        <RadioGroupItem
                          initialValue={initRadioStart}
                          id="isStartMorning"
                          options={options}
                          form={this.props.form}
                          onChange={this.onStartMorningChange}
                        />
                    </Col>
                    <Col span={4}>
                        <RadioGroupItem
                          initialValue={initRadioEnd}
                          id="isEndMorning"
                          options={options}
                          form={this.props.form}
                          onChange={this.onEndMorningChange}
                        />
                    </Col>
                    <Col span={4} />
                </Row>

                <Row gutter={8}>
                    <Col span={24}>
                        {this.props.onSubmit ? (
                            <Button
                              type="primary"
                              onClick={this.handleSubmit}
                              disabled={this.hasErrors()}
                            >
                                {Locale.trans('absence.button.save')}
                            </Button>
                        ) : null}
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default class DayAbsenceForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.user,
            formClass: DayAbsenceFormContent,
        };
    }
}
