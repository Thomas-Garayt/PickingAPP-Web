import React from 'react';
import { Form, Tooltip, Icon, Button, Row, Col } from 'antd';
import FormItem from 'components/forms/FormItems';
import DeleteButton from 'components/forms/DeleteButton.jsx';
import Locale from 'locale/LocaleFactory';

import DateConstants from 'constants/DateConstants';

import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

class MinuteFormContent extends FormBase {
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

            const minute = this.getMinuteFromValues(values);

            // Contacts
            const allContacts = this.props.contacts;
            const initialContactsId =
                this.props.minute && this.props.minute.contacts
                    ? this.props.minute.contacts.map(c => c.id.toString())
                    : [];
            const contactsId = values.contactsId;

            const contacts = {
                created: contactsId
                    .filter(id => initialContactsId.indexOf(id) < 0)
                    .map(id => allContacts.find(c => c.id == id)),
                deleted: initialContactsId
                    .filter(id => contactsId.indexOf(id) < 0)
                    .map(id => allContacts.find(c => c.id == id)),
            };

            // Users
            const allUsers = this.props.users;
            const initialUsersId =
                this.props.minute && this.props.minute.users
                    ? this.props.minute.users.map(c => c.id.toString())
                    : [];
            const usersId = values.usersId;

            const users = {
                created: usersId
                    .filter(id => initialUsersId.indexOf(id) < 0)
                    .map(id => allUsers.find(u => u.id == id)),
                deleted: initialUsersId
                    .filter(id => usersId.indexOf(id) < 0)
                    .map(id => allUsers.find(u => u.id == id)),
            };

            this.props.onSubmit(minute, contacts, users);
        });
    };

    getMinuteFromValues = (values) => {
        const minute = {};
        for (const k in values) {
            if (k === 'date-picker') {
                minute.date = values[k].format(DateConstants.API_DATE_FORMAT);
            } else if (k === 'businessId') {
                minute.business = values[k];
            } else if (!k.startsWith('contactsId') && !k.startsWith('usersId')) {
                minute[k] = values[k];
            }
        }
        return minute;
    };

    render() {
        const { getFieldValue } = this.props.form;

        const categories = ['meeting', 'interview', 'phone', 'email', 'visit'];
        const topics = ['business', 'project'];

        return (
            <Form hideRequiredMark>
                <div className="full-size-form">
                    <div className="form-content">
                        <FormItem.Input
                          id="title"
                          required
                          label={Locale.trans('minute.title')}
                          form={this.props.form}
                        />

                        <FormItem.Select
                          id="topic"
                          required
                          label={Locale.trans('minute.topic')}
                          placeholder={Locale.trans('minute.topic.placeholder')}
                          options={topics.map(t => ({
                              value: t,
                              label: Locale.trans(`minute.topics.${t}`),
                          }))}
                          form={this.props.form}
                        />

                        <Row gutter={8}>
                            <Col span={12}>
                                <FormItem.DatePicker
                                  id="date-picker"
                                  required
                                  label={Locale.trans('minute.date')}
                                  initialValue={getFieldValue('date')}
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={12}>
                                <FormItem.Select
                                  id="category"
                                  required
                                  label={Locale.trans('minute.category')}
                                  placeholder={Locale.trans('minute.category.placeholder')}
                                  options={categories.map(c => ({
                                      value: c,
                                      label: Locale.trans(`minute.categories.${c}`),
                                  }))}
                                  form={this.props.form}
                                />
                            </Col>
                        </Row>

                        {this.renderBusinessItem()}

                        {this.renderContactsItem()}
                        {this.renderUsersItem()}

                        <FormItem.Input
                          id="text"
                          required
                          label={Locale.trans('minute.content')}
                          type="textarea"
                          markdown
                          autosize={{ minRows: 5 }}
                          form={this.props.form}
                        />
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
                        {this.props.createReminder ? (
                            <Tooltip
                              placement="topRight"
                              title={Locale.trans('minute.createReminder.button.tooltip')}
                            >
                                <Button
                                  className="pull-right"
                                  shape="circle"
                                  icon="notification"
                                  onClick={() => this.props.createReminder()}
                                />
                            </Tooltip>
                        ) : null}
                    </div>
                </div>
            </Form>
        );
    }

    renderContactsItem() {
        const { contacts } = this.props;

        if (!contacts || contacts.length === 0) {
            return null;
        }

        const { getFieldValue } = this.props.form;
        return (
            <FormItem.Select
              id="contactsId"
              multiple
              required
              label={Locale.trans('minute.contacts')}
              placeholder={Locale.trans('minute.contacts.placeholder')}
              initialValue={(getFieldValue('contacts') || []).map(c => c.id.toString())}
              options={contacts.sort(this.cmpContactByCompany).map(c => ({
                  value: c.id,
                  label: `${(c.company ? `${c.company.name} - ` : '') +
                        c.lastname} ${c.firstname}`,
              }))}
              form={this.props.form}
            />
        );
    }

    renderUsersItem() {
        const { users } = this.props;

        if (!users || users.length === 0) {
            return null;
        }

        const { getFieldValue } = this.props.form;
        return (
            <FormItem.Select
              id="usersId"
              multiple
              label={Locale.trans('minute.users')}
              placeholder={Locale.trans('minute.users.placeholder')}
              initialValue={(getFieldValue('users') || []).map(c => c.id.toString())}
              options={users.sort(this.cmpUser).map(u => ({
                  value: u.id,
                  label: `${u.lastname} ${u.firstname}`,
              }))}
              form={this.props.form}
            />
        );
    }

    renderBusinessItem() {
        const { business } = this.props;

        if (!business || business.length === 0) {
            return null;
        }

        const { getFieldValue } = this.props.form;
        return (
            <FormItem.Select
              id="businessId"
              label={Locale.trans('minute.business')}
              placeholder={Locale.trans('minute.business.placeholder')}
              initialValue={(getFieldValue('business') || []).id}
              options={business
                    .sort(this.cmpBusinessByReference)
                    .map(b => ({ value: b.id, label: `${b.reference} - ${b.title}` }))}
              form={this.props.form}
            />
        );
    }

    cmpUser = (u1, u2) => {
        const u1v = `${u1.lastname}${u1.firstname}`;
        const u2v = `${u2.lastname}${u2.firstname}`;

        if (u1v === u2v) {
            return 0;
        }

        return u1v > u2v ? 1 : -1;
    };

    cmpContactByCompany = (c1, c2) => {
        const c1v = c1.company ? c1.company.name : '';
        const c2v = c2.company ? c2.company.name : '';

        if (c1v === c2v) {
            return 0;
        }

        return c1v > c2v ? 1 : -1;
    };

    cmpBusinessByReference = (b1, b2) => {
        const b1v = b1.reference ? b1.reference : '';
        const b2v = b2.reference ? b2.reference : '';

        if (b1v === b2v) {
            return 0;
        }

        return b1v > b2v ? 1 : -1;
    };
}

export default class MinuteForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.minute,
            formClass: MinuteFormContent,
        };
    }
}
