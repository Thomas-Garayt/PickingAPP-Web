import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import {
    SelectItem,
    DatePickerItem,
    RadioGroupItem,
    TimePickerItem,
} from 'components/forms/FormItems';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';
import DateConstants from 'constants/DateConstants';

class HourAbsenceFormContent extends FormBase {
    constructor() {
        super();
        this.state = {
            totalHour: null,

            startValue: null,
            startDateTime: null,
            endValue: null,
            endDateTime: null,
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

            const dayAbsence = this.getHourAbsenceFromValues(values);

            onSubmit(dayAbsence);
        });
    };

    updateTotalHour = (field, value) => {
        const { startDateTime, endDateTime } = this.state;
        let dif = null;

        if (value != null && startDateTime != null && field === 'endValue') {
            dif = (value - startDateTime) / 3600000;
        } else if (value != null && endDateTime != null && field === 'startValue') {
            dif = (endDateTime - value) / 3600000;
        } else if (startDateTime != null && endDateTime != null) {
            dif = (endDateTime - startDateTime) / 3600000;
        }

        if (dif != null) {
            this.setState({ totalHour: dif });
        }
    };

    getHourAbsenceFromValues = (values) => {
        const { startValue, endValue } = this.state;

        const dayAbsence = {};
        const keys = Object.keys(values);

        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];

            if (k === 'startDate') {
                dayAbsence.startDate = values[k]
                    ? values[k].format(DateConstants.API_DATE_FORMAT)
                    : null;
                dayAbsence.endDate = values[k]
                    ? values[k].format(DateConstants.API_DATE_FORMAT)
                    : null;
            } else if (k === 'isStartMorning') {
                dayAbsence.isStartMorning = values[k];
                dayAbsence.isEndMorning = values[k];
            } else if (k === 'startHour') {
                dayAbsence.startHour = startValue;
            } else if (k === 'endHour') {
                dayAbsence.endHour = endValue;
            } else {
                dayAbsence[k] = values[k];
            }
        }

        return dayAbsence;
    };

    onStartChange = (time, timeString) => {
        this.setState({
            startValue: this.timeToDecimal(timeString),
            startDateTime: time.toDate(),
        });

        this.updateTotalHour('startValue', time.toDate());
    };

    onEndChange = (time, timeString) => {
        this.setState({
            endValue: this.timeToDecimal(timeString),
            endDateTime: time.toDate(),
        });

        this.updateTotalHour('endValue', time.toDate());
    };

    doubleRange = (start, end, start2, end2) => {
        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        for (let i = start2; i <= end2; i++) {
            result.push(i);
        }

        return result;
    };

    disabledMinutes = h => this.doubleRange(1, 29, 31, 59);

    timeToDecimal = (t) => {
        const arr = t.split(':');
        return parseFloat(`${parseInt(arr[0], 10)}.${parseInt(arr[1] / 0.6, 10)}`);
    };

    render() {
        const { absenceType } = this.props;
        const { getFieldValue } = this.props.form;
        const { totalHour } = this.state;

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
                          options={absenceType.filter(m => m.title === 'RTT').map(m => ({
                              value: m.id,
                              label: `${m.title}`,
                          }))}
                          form={this.props.form}
                        />
                    </Col>

                    <Col span={4}>
                        <DatePickerItem
                          id="startDate"
                          label={Locale.trans('user.absence.startdate')}
                          initialValue={getFieldValue('startDate')}
                          form={this.props.form}
                        />
                    </Col>

                    <Col span={3}>
                        <TimePickerItem
                          id="startHour"
                          label={Locale.trans('user.absence.starthour')}
                          initialValue={getFieldValue('startHour')}
                          form={this.props.form}
                          onChange={this.onStartChange}
                          disabledMinutes={this.disabledMinutes}
                        />
                    </Col>

                    <Col span={3}>
                        <TimePickerItem
                          id="endHour"
                          label={Locale.trans('user.absence.endhour')}
                          initialValue={getFieldValue('endHour')}
                          form={this.props.form}
                          onChange={this.onEndChange}
                          disabledMinutes={this.disabledMinutes}
                        />
                    </Col>

                    <Col span={4}>
                        <label className="ant-form-item-required">
                            {totalHour != null
                                ? `${Locale.trans('total')} : ${totalHour} ${totalHour > 1
                                      ? Locale.trans('hours')
                                      : Locale.trans('hour')}`
                                : null}
                        </label>
                    </Col>
                </Row>

                <Row gutter={8}>
                    <Col span={4} />
                    <Col span={4}>
                        <RadioGroupItem
                          id="isStartMorning"
                          options={options}
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
                                {Locale.trans('absence.button.save')}
                            </Button>
                            : null}
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default class HourAbsenceForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.user,
            formClass: HourAbsenceFormContent,
        };
    }
}
