import React from 'react';
import { Form, Tooltip, Icon, Button } from 'antd';
import FormItem from 'components/forms/FormItems';
import DeleteButton from 'components/forms/DeleteButton.jsx';
import Label from 'components/forms/Label.jsx';
import Locale from 'locale/LocaleFactory';

import moment from 'moment';
import DateConstants from 'constants/DateConstants';

import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

export default class ReminderForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.reminder,
            formClass: ReminderFormContent,
        };
    }
}

class ReminderFormContent extends FormBase {
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
            if (err) {
                return;
            }

            const reminder = this.getReminderFromValues(values);

            this.props.onSubmit(reminder);
        });
    };

    getReminderFromValues = (values) => {
        const reminder = {};
        for (const k in values) {
            if (k === 'date-picker') {
                reminder.date = values[k].format(DateConstants.API_DATE_FORMAT);
                continue;
            }
            reminder[k] = values[k];
        }

        if (this.props.minute) {
            reminder.minute = this.props.minute.id;
        }

        return reminder;
    };

    render() {
        const { minute, readOnly } = this.props;
        const { getFieldValue } = this.props.form;

        return (
            <Form hideRequiredMark>
                <div className="full-size-form">
                    <div className="form-content">
                        <FormItem.Input
                          id="title"
                          required
                          label={Locale.trans('reminder.title')}
                          form={this.props.form}
                          readOnly={readOnly}
                        />

                        <FormItem.DatePicker
                          id="date-picker"
                          required
                          label={Locale.trans('reminder.date')}
                          placeholder={Locale.trans('minute.date')}
                          initialValue={getFieldValue('date')}
                          form={this.props.form}
                          readOnly={readOnly}
                        />

                        <FormItem.Input
                          id="relaunch"
                          required
                          label={Locale.trans('reminder.relaunch')}
                          placeholder={Locale.trans('reminder.relaunch')}
                          maxLength="2"
                          form={this.props.form}
                          readOnly={readOnly}
                        />

                        <FormItem.Input
                          id="text"
                          label={Locale.trans('reminder.content')}
                          type="textarea"
                          autosize={{ minRows: 5, maxRows: 50 }}
                          markdown
                          form={this.props.form}
                          readOnly={readOnly}
                        />

                        {this.props.minute ? (
                            <div>
                                <Label>{Locale.trans('reminder.minute')}</Label>
                                <div style={{ lineHeight: '28px' }}>
                                    {moment(minute.date, DateConstants.API_DATE_FORMAT).format(
                                        DateConstants.DISPLAY_DATE_FORMAT,
                                    )}{' '}
                                    - {minute.title}
                                    <Tooltip
                                      placement="topRight"
                                      title={Locale.trans('reminder.showMinutes.button.tooltip')}
                                    >
                                        <Button
                                          className="pull-right"
                                          shape="circle"
                                          icon="search"
                                          onClick={() => this.props.onMinuteShow(minute.id)}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        ) : null}
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
}
