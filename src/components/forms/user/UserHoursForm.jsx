import React from 'react';
import {Form, Icon, Button, Row, Col} from 'antd';
import {InputItem, SelectItem, DatePickerItem} from 'components/forms/FormItems';
import DeleteButton from 'components/forms/DeleteButton.jsx';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

import DateConstants from 'constants/DateConstants';
import moment from 'moment'

export default class UserHoursForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.user,
            formClass: UserHoursFormContent
        };
    }
}

class UserHoursFormContent extends FormBase {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = () => {
        const {form, onSubmit} = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const hours = this.getHoursFromValues(values);

            onSubmit(hours);
        });
    }

    getHoursFromValues = (values) => {
        var hours = {};
        for (var k in values) {
            if(k === 'startDate-picker') {
                hours.startDate = values[k] ? values[k].format(DateConstants.API_DATE_FORMAT) : null;
            }else if(k === 'endDate-picker') {
                hours.endDate = values[k] ? values[k].format(DateConstants.API_DATE_FORMAT) : null;
            }else{
                hours[k] = values[k];
            }
        }
        return hours;
    }

    render() {
        const {getFieldValue} = this.props.form;

        return (
            <Form hideRequiredMark>
                {this.renderWeeklyTable()}

                <Row gutter={8}>
                    <Col span={8}>
                        <DatePickerItem
                            id="startDate-picker"
                            label={Locale.trans('user.hours.startDate')}
                            initialValue={ getFieldValue('startDate') }
                            form={this.props.form}
                        />
                    </Col>
                    <Col span={8}>
                        <DatePickerItem
                            id="endDate-picker"
                            label={Locale.trans('user.hours.endDate')}
                            initialValue={ getFieldValue('endDate') }
                            form={this.props.form}
                        />
                    </Col>
                </Row>

                <Row gutter={8}>
                    <Col span={24}>
                        {this.props.onSubmit
                            ? (
                                <Button type="primary" onClick={this.handleSubmit} disabled={this.hasErrors()}>
                                    {Locale.trans('save')}
                                </Button>
                            )
                            : null}
                    </Col>
                </Row>
            </Form>
        );
    }

    renderWeeklyTable() {
        const {workingDayTypes} = this.props;

        const weekDays = moment.weekdays();

        const workingDayTypeOptions = workingDayTypes.map(w => ({value: w.id, label: w.code}));

        return (
            <div className="ant-table">
                <div className="ant-table-body">
                    <table>
                        <colgroup>
                            <col style={{width: '14.3%', minWidth: '14.3%'}}/>
                            <col style={{width: '14.3%', minWidth: '14.3%'}}/>
                            <col style={{width: '14.3%', minWidth: '14.3%'}}/>
                            <col style={{width: '14.3%', minWidth: '14.3%'}}/>
                            <col style={{width: '14.3%', minWidth: '14.3%'}}/>
                            <col style={{width: '14.3%', minWidth: '14.3%'}}/>
                            <col style={{width: '14.3%', minWidth: '14.3%'}}/>
                        </colgroup>
                        <thead className="ant-table-thead">
                            <tr>
                                <th>{weekDays[1]}</th>
                                <th>{weekDays[2]}</th>
                                <th>{weekDays[3]}</th>
                                <th>{weekDays[4]}</th>
                                <th>{weekDays[5]}</th>
                                <th>{weekDays[6]}</th>
                                <th>{weekDays[0]}</th>
                            </tr>
                        </thead>
                        <tbody className="ant-table-tbody">
                            <tr>
                                <td>
                                    <SelectItem
                                        id="mondayHours"
                                        options={workingDayTypeOptions}
                                        form={this.props.form}
                                    />
                                </td>
                                <td>
                                    <SelectItem
                                        id="tuesdayHours"
                                        options={workingDayTypeOptions}
                                        form={this.props.form}
                                    />
                                </td>
                                <td>
                                    <SelectItem
                                        id="wednesdayHours"
                                        options={workingDayTypeOptions}
                                        form={this.props.form}
                                    />
                                </td>
                                <td>
                                    <SelectItem
                                        id="thursdayHours"
                                        options={workingDayTypeOptions}
                                        form={this.props.form}
                                    />
                                </td>
                                <td>
                                    <SelectItem
                                        id="fridayHours"
                                        options={workingDayTypeOptions}
                                        form={this.props.form}
                                    />
                                </td>
                                <td>
                                    <SelectItem
                                        id="saturdayHours"
                                        options={workingDayTypeOptions}
                                        form={this.props.form}
                                    />
                                </td>
                                <td>
                                    <SelectItem
                                        id="sundayHours"
                                        options={workingDayTypeOptions}
                                        form={this.props.form}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
