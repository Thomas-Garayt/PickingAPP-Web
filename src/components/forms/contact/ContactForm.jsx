import React from 'react';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';
import { Form, Icon, Button, Tooltip, Popconfirm } from 'antd';
import FormItem from 'components/forms/FormItems';
import DeleteButton from 'components/forms/DeleteButton.jsx';
import Label from 'components/forms/Label.jsx';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';

export default class ContactForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.contact,
            formClass: ContactFormContent,
        };
    }
}

class ContactFormContent extends FormBase {
    constructor() {
        super();
        this.state = {
            deletedPhones: [],
            countNewPhones: 0,

            deletedEmails: [],
            countNewEmails: 0,
        };
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    // Phones
    addPhone = () => {
        const { form } = this.props;

        this.state.countNewPhones++;
        const id = `new-${this.state.countNewPhones}`;

        const phonesId = form.getFieldValue('phonesId');
        const nextPhonesId = phonesId.concat(id);
        form.setFieldsValue({
            phonesId: nextPhonesId,
        });
        form.validateFields();
    };

    removePhone = (phoneId) => {
        const { form } = this.props;
        const phonesId = form.getFieldValue('phonesId');
        form.setFieldsValue({
            phonesId: phonesId.filter(p => p !== phoneId),
        });

        // If the identifier is not an existing one, we add the phone to the list of phones to delete.
        if (Number.isInteger(phoneId)) {
            const deletedPhone = this.getPhone(phoneId);
            this.state.deletedPhones.push(deletedPhone);
        }
    };

    getPhones = () => {
        const { getFieldValue } = this.props.form;
        const phones = getFieldValue('phones');
        return phones || [];
    };

    getPhone = id => this.getPhones().find(user => user.id === id);

    // E-Mails
    addEmail = () => {
        const { form } = this.props;

        this.state.countNewEmails++;
        const id = `new-${this.state.countNewEmails}`;

        const emailsId = form.getFieldValue('emailsId');
        const nextEmailsId = emailsId.concat(id);
        form.setFieldsValue({
            emailsId: nextEmailsId,
        });
        form.validateFields();
    };

    removeEmail = (emailId) => {
        const { form } = this.props;
        const emailsId = form.getFieldValue('emailsId');
        form.setFieldsValue({
            emailsId: emailsId.filter(p => p !== emailId),
        });

        // If the identifier is not an existing one, we add the phone to the list of phones to delete.
        if (Number.isInteger(emailId)) {
            const deletedEmail = this.getEmail(emailId);
            this.state.deletedEmails.push(deletedEmail);
        }
    };

    getEmails = () => {
        const { getFieldValue } = this.props.form;
        const emails = getFieldValue('emails');
        return emails || [];
    };

    getEmail = id => this.getEmails().find(e => e.id === id);

    // Groups
    getGroups = () => {
        const { form, groups } = this.props;

        if (!groups) {
            return [];
        }

        const basicGroupIds = form.getFieldValue('groupsId');
        const communityGroupIds = form.getFieldValue('communityGroupsId');

        const contactGroupsId = basicGroupIds.concat(communityGroupIds);

        const contactGroups = [];
        for (var i = 0; i < contactGroupsId.length; i++) {
            const group = groups.find(g => g.id === contactGroupsId[i]);
            if (group) {
                contactGroups.push(group);
            }
        }

        return contactGroups;
    };

    handleSubmit = () => {
        const { form } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const contact = this.getContactFromValues(values);

            const phones = {
                created: this.getNewPhonesFromValues(values),
                edited: this.getEditedPhonesFromValues(values),
                deleted: this.state.deletedPhones,
            };

            const emails = {
                created: this.getNewEmailsFromValues(values),
                edited: this.getEditedEmailsFromValues(values),
                deleted: this.state.deletedEmails,
            };

            const allGroups = this.props.groups;

            const initialGroupsId = this.props.contact
                ? this.props.contact.groups
                      .filter(g => g.category === 'basic')
                      .map(g => g.id.toString())
                : [];
            const groupsId = values.groupsId;
            const createdGroups = groupsId
                .filter(id => initialGroupsId.indexOf(id) < 0)
                .map(id => allGroups.find(g => g.id == id) || { name: id, category: 'basic' });
            const deletedGroups = initialGroupsId
                .filter(id => groupsId.indexOf(id) < 0)
                .map(id => allGroups.find(g => g.id == id));

            const initialCommunityGroupsId = this.props.contact
                ? this.props.contact.groups
                      .filter(g => g.category === 'community')
                      .map(g => g.id.toString())
                : [];
            const communityGroupsId = values.communityGroupsId;
            const createdCommunityGroups = communityGroupsId
                .filter(id => initialCommunityGroupsId.indexOf(id) < 0)
                .map(id => allGroups.find(g => g.id == id) || { name: id, category: 'community' });
            const deletedCommunityGroups = initialCommunityGroupsId
                .filter(id => communityGroupsId.indexOf(id) < 0)
                .map(id => allGroups.find(g => g.id == id));

            const groups = {
                // We allow to create new groups directly. If the new "id" isn't an existing one, it means that it's a new group.
                created: [].concat(createdGroups, createdCommunityGroups),
                deleted: [].concat(deletedGroups, deletedCommunityGroups),
            };

            this.props.onSubmit(contact, phones, emails, groups);
        });
    };

    getContactFromValues = (values) => {
        const contact = {};
        for (const k in values) {
            if (k === 'companyId') {
                contact.company = values[k];
                continue;
            }
            if (k === 'companyAddressId') {
                contact.companyAddress = values[k];
                continue;
            }

            if (
                !k.startsWith('phones') &&
                !k.startsWith('emails') &&
                !k.startsWith('groupsId') &&
                !k.startsWith('communityGroupsId')
            ) {
                contact[k] = values[k];
            }
        }
        return contact;
    };

    getNewPhonesFromValues = (values) => {
        const newPhones = [];
        for (const k in values) {
            if (!k.startsWith('phones-new')) {
                continue;
            }
            const splitKey = k.split('-');
            if (splitKey.length === 4) {
                const phoneId = splitKey[2];
                if (!newPhones[phoneId]) {
                    newPhones[phoneId] = {};
                }
                switch (splitKey[3]) {
                case 'type':
                    newPhones[phoneId].type = values[k];
                    break;
                case 'value':
                    newPhones[phoneId].value = values[k];
                    break;
                default:
                        // Do Nothing
                    break;
                }
            }
        }
        return newPhones;
    };

    getEditedPhonesFromValues = (values) => {
        const editedPhones = [];
        for (const k in values) {
            if (!k.startsWith('phones-')) {
                continue;
            }

            const splitKey = k.split('-');
            if (splitKey.length === 3) {
                const phoneId = parseInt(splitKey[1]);
                if (!editedPhones[phoneId]) {
                    editedPhones[phoneId] = { id: phoneId };
                }
                switch (splitKey[2]) {
                case 'type':
                    editedPhones[phoneId].type = values[k];
                    break;
                case 'value':
                    editedPhones[phoneId].value = values[k];
                    break;
                default:
                        // Do Nothing
                    break;
                }
            }
        }
        return editedPhones;
    };

    getNewEmailsFromValues = (values) => {
        const newEmails = [];
        for (const k in values) {
            if (!k.startsWith('emails-new')) {
                continue;
            }

            const splitKey = k.split('-');
            if (splitKey.length === 4) {
                const emailId = splitKey[2];
                if (!newEmails[emailId]) {
                    newEmails[emailId] = {};
                }
                switch (splitKey[3]) {
                case 'type':
                    newEmails[emailId].type = values[k];
                    break;
                case 'value':
                    newEmails[emailId].value = values[k];
                    break;
                default:
                        // Do Nothing
                    break;
                }
            }
        }
        return newEmails;
    };

    getEditedEmailsFromValues = (values) => {
        const editedEmails = [];
        for (const k in values) {
            if (!k.startsWith('emails-')) {
                continue;
            }
            const splitKey = k.split('-');
            if (splitKey.length === 3) {
                const emailId = parseInt(splitKey[1]);
                if (!editedEmails[emailId]) {
                    editedEmails[emailId] = { id: emailId };
                }
                switch (splitKey[2]) {
                case 'type':
                    editedEmails[emailId].type = values[k];
                    break;
                case 'value':
                    editedEmails[emailId].value = values[k];
                    break;
                default:
                        // Do Nothing
                    break;
                }
            }
        }
        return editedEmails;
    };

    render() {
        const { groups, onSubmit, onDelete, showMinutes } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        // Phones
        getFieldDecorator('phonesId', { initialValue: this.getPhones().map(p => p.id) });
        const phonesId = getFieldValue('phonesId');
        const addPhoneButton = (
            <Form.Item>
                <Button onClick={() => this.addPhone()}>
                    <Icon type="plus" /> {Locale.trans('contact.addPhone.button')}
                </Button>
            </Form.Item>
        );

        // E-Mails
        getFieldDecorator('emailsId', { initialValue: this.getEmails().map(e => e.id) });
        const emailsId = getFieldValue('emailsId');
        const addEmailButton = (
            <Form.Item>
                <Button onClick={() => this.addEmail()}>
                    <Icon type="plus" /> {Locale.trans('contact.addEmail.button')}
                </Button>
            </Form.Item>
        );

        const initialBasicGroupIds = (getFieldValue('groups') || [])
            .filter(g => g.category === 'basic')
            .map(g => g.id.toString());
        const initialCommunityGroupIds = (getFieldValue('groups') || [])
            .filter(g => g.category === 'community')
            .map(g => g.id.toString());

        return (
            <Form hideRequiredMark>
                <div className="full-size-form">
                    <div className="form-content">
                        <FormItem.Input
                          id="firstname"
                          required
                          placeholder={Locale.trans('contact.firstname')}
                          form={this.props.form}
                        />
                        <FormItem.Input
                          id="lastname"
                          required
                          placeholder={Locale.trans('contact.lastname')}
                          form={this.props.form}
                        />

                        {this.renderCompanyField()}
                        {this.renderCompanyAddressField()}

                        <Label>{Locale.trans('contact.phone')}</Label>
                        {phonesId.length > 0 ? (
                            <Button
                              className="add-button pull-right"
                              shape="circle"
                              icon="plus"
                              size="small"
                              onClick={() => this.addPhone()}
                            />
                        ) : null}
                        {phonesId.length > 0 ? this.renderPhonesItem() : addPhoneButton}

                        <Label>{Locale.trans('contact.email')}</Label>
                        {emailsId.length > 0 ? (
                            <Button
                              className="add-button pull-right"
                              shape="circle"
                              icon="plus"
                              size="small"
                              onClick={() => this.addEmail()}
                            />
                        ) : null}
                        {emailsId.length > 0 ? this.renderEmailsItem() : addEmailButton}

                        <FormItem.Select
                          id="groupsId"
                          tags
                          label={Locale.trans('contact.groups')}
                          placeholder={Locale.trans('contact.groups.placeholder')}
                          initialValue={initialBasicGroupIds}
                          options={groups
                                .filter(g => g.category == 'basic')
                                .map(g => ({ value: g.id, label: g.name }))}
                          form={this.props.form}
                        />

                        <FormItem.Select
                          id="communityGroupsId"
                          tags
                          label={Locale.trans('contact.communityGroups')}
                          placeholder={Locale.trans('contact.groups.placeholder')}
                          initialValue={initialCommunityGroupIds}
                          options={groups
                                .filter(g => g.category == 'community')
                                .map(g => ({ value: g.id, label: g.name }))}
                          form={this.props.form}
                        />

                        <FormItem.Input
                          id="comment"
                          label={Locale.trans('contact.comment')}
                          type="textarea"
                          autosize={{ minRows: 5, maxRows: 50 }}
                          markdown
                          form={this.props.form}
                        />
                    </div>
                    <div className="form-action-barre">
                        {onSubmit ? (
                            <Button
                              type="primary"
                              onClick={this.handleSubmit}
                              disabled={this.hasErrors()}
                            >
                                {Locale.trans('save')}
                            </Button>
                        ) : null}
                        &nbsp;
                        {onDelete ? <DeleteButton onDelete={onDelete} /> : null}
                        {showMinutes ? (
                            <Tooltip
                              placement="topRight"
                              title={Locale.trans('contact.showMinutes.button.tooltip')}
                            >
                                <Button
                                  className="pull-right"
                                  shape="circle"
                                  icon="file-text"
                                  onClick={() => showMinutes()}
                                />
                            </Tooltip>
                        ) : null}
                    </div>
                </div>
            </Form>
        );
    }

    renderPhonesItem() {
        const { getFieldValue } = this.props.form;
        const phonesId = getFieldValue('phonesId');
        const phoneTypes = ['perso', 'pro', 'office', 'portable'];

        return phonesId.map((id) => {
            const phone = this.getPhone(id);
            return (
                <div
                  className="ant-row ant-form-item inline-form-group with-delete-button"
                  key={id}
                >
                    <FormItem.Input
                      id={`phones-${id}-value`}
                      required
                      rules={[
                          {
                              type: 'string',
                              pattern: /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/,
                              message: Locale.trans('error.phone.invalid'),
                          },
                      ]}
                      placeholder={Locale.trans('contact.phone.value')}
                      initialValue={phone ? phone.value : ''}
                      wrapperCol={{ span: 12 }}
                      form={this.props.form}
                    />

                    <FormItem.Select
                      id={`phones-${id}-type`}
                      showSearch
                      required
                      placeholder={Locale.trans('contact.phone.type')}
                      initialValue={phone ? phone.type : ''}
                      options={phoneTypes.map(t => ({
                          value: t,
                          label: Locale.trans(`contact.phoneType.${t}`),
                      }))}
                      wrapperCol={{ span: 12 }}
                      form={this.props.form}
                    />

                    <Button
                      className="delete-button"
                      shape="circle"
                      icon="delete"
                      size="small"
                      type="danger"
                      onClick={() => this.removePhone(id)}
                    />
                </div>
            );
        });
    }

    renderEmailsItem() {
        const { getFieldValue } = this.props.form;
        const emailsId = getFieldValue('emailsId');

        const emailTypes = ['perso', 'pro', 'office'];

        return emailsId.map((id) => {
            const email = this.getEmail(id);
            return (
                <div
                  className="ant-row ant-form-item inline-form-group with-delete-button"
                  key={id}
                >
                    <FormItem.Input
                      id={`emails-${id}-value`}
                      required
                      rules={[{ type: 'email', message: Locale.trans('error.email.invalid') }]}
                      placeholder={Locale.trans('contact.email.value')}
                      initialValue={email ? email.value : ''}
                      wrapperCol={{ span: 12 }}
                      form={this.props.form}
                    />

                    <FormItem.Select
                      id={`emails-${id}-type`}
                      showSearch
                      required
                      placeholder={Locale.trans('contact.email.type')}
                      initialValue={email ? email.type : ''}
                      options={emailTypes.map(t => ({
                          value: t,
                          label: Locale.trans(`contact.emailType.${t}`),
                      }))}
                      wrapperCol={{ span: 12 }}
                      form={this.props.form}
                    />

                    <Button
                      className="delete-button"
                      shape="circle"
                      icon="delete"
                      size="small"
                      type="danger"
                      onClick={() => this.removeEmail(id)}
                    />
                </div>
            );
        });
    }

    renderCompanyField() {
        const { companies } = this.props;
        const { getFieldValue } = this.props.form;
        return (
            <FormItem.Select
              id="companyId"
              showSearch
              placeholder={Locale.trans('contact.company.placeholder')}
              initialValue={
                    getFieldValue('company') ? getFieldValue('company').id.toString() : null
                }
              options={companies.map(c => ({ value: c.id, label: c.name }))}
              form={this.props.form}
            />
        );
    }

    renderCompanyAddressField() {
        const { companies } = this.props;
        const { getFieldValue } = this.props.form;
        const companyAddress = getFieldValue('companyAddress');
        const companyId = getFieldValue('companyId');
        const company = companies.find(c => c.id.toString() === companyId);
        return (
            <FormItem.Select
              id="companyAddressId"
              showSearch
              placeholder={Locale.trans('contact.companyAddress.placeholder')}
              initialValue={
                    companyAddress ? companyAddress.id.toString() : null
                }
              options={company ? company.addresses.map(a => ({ value: a.id, label: a.name })) : []}
              form={this.props.form}
            />
        );
    }
}
