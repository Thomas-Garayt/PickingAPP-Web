import React from 'react';
import { Form, Icon, Button, Row, Col } from 'antd';
import FormItem, { InputItem, SelectItem } from 'components/forms/FormItems';
import DeleteButton from 'components/forms/DeleteButton.jsx';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

class UserFormContent extends FormBase {
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

            const user = this.getUserFromValues(values);

            const roles = this.getRolesFromValues(values);

            onSubmit(user, roles);
        });
    };

    getRolesFromValues = (values) => {
        const allRoles = this.props.roles;
        const initialRolesId = this.props.user
            ? this.props.user.roles.map(g => g.id.toString())
            : [];
        const rolesId = values.rolesId;
        return {
            created: rolesId.filter(id => initialRolesId.indexOf(id) < 0).map((id) => {
                const role = allRoles.find(r => r.id == id);
                return { id: role.id };
            }),
            deleted: initialRolesId
                .filter(id => rolesId.indexOf(id) < 0)
                .map(id => allRoles.find(r => r.id == id)),
        };
    };

    getUserFromValues = (values) => {
        const contact = {};
        for (const k in values) {
            if (!k.startsWith('rolesId')) {
                contact[k] = values[k];
            }
        }
        return contact;
    };

    render() {
        const { showPlainPassword } = this.props;
        return (
            <Form hideRequiredMark>
                <div className="full-size-form">
                    <div className="form-content">
                        <Row gutter={8}>
                            <Col span={12}>
                                <InputItem
                                  id="identifier"
                                  label={Locale.trans('user.identifier')}
                                  required
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={12}>
                                <SelectItem
                                  id="gender"
                                  label={Locale.trans('user.gender')}
                                  options={[
                                        { value: 'mister', label: Locale.trans('mister') },
                                        { value: 'miss', label: Locale.trans('miss') },
                                  ]}
                                  required
                                  form={this.props.form}
                                />
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={12}>
                                <FormItem.Input
                                  id="firstname"
                                  label={Locale.trans('user.firstname')}
                                  required
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={12}>
                                <FormItem.Input
                                  id="lastname"
                                  label={Locale.trans('user.lastname')}
                                  required
                                  form={this.props.form}
                                />
                            </Col>
                        </Row>

                        <FormItem.Input
                          id="username"
                          label={Locale.trans('user.username')}
                          required
                          form={this.props.form}
                        />

                        <FormItem.Input
                          id="email"
                          label={Locale.trans('user.email')}
                          required
                          rules={[
                                { type: 'email', message: Locale.trans('error.email.invalid') },
                          ]}
                          form={this.props.form}
                        />

                        {this.renderRolesItem()}

                        {showPlainPassword
                            ? <FormItem.Input
                              id="plainPassword"
                              type="password"
                              required
                              label={Locale.trans('user.password')}
                              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                              form={this.props.form}
                            />
                            : null}
                    </div>
                    <div className="form-action-barre">
                        {this.props.onSubmit
                            ? <Button
                              type="primary"
                              onClick={this.handleSubmit}
                              disabled={this.hasErrors()}
                            >
                                {Locale.trans('save')}
                            </Button>
                            : null}
                        &nbsp;
                        {this.props.onDelete
                            ? <DeleteButton onDelete={this.props.onDelete} />
                            : null}
                    </div>
                </div>
            </Form>
        );
    }

    renderRolesItem() {
        const { roles } = this.props;

        if (!roles || roles.length === 0) {
            return null;
        }

        const { getFieldValue } = this.props.form;

        const initialRoleIds = (getFieldValue('roles') || []).map(g => g.id.toString());
        return (
            <FormItem.Select
              id="rolesId"
              multiple
              required
              label={Locale.trans('user.roles')}
              placeholder={Locale.trans('user.roles.placeholder')}
              initialValue={initialRoleIds}
              options={roles.map(r => ({ value: r.id, label: r.title }))}
              form={this.props.form}
            />
        );
    }
}

export default class UserForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.user,
            formClass: UserFormContent,
        };
    }
}
