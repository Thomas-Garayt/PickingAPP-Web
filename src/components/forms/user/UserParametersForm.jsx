// @flow

import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import { InputItem, SelectItem } from 'components/forms/FormItems';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

class UserParametersFormContent extends FormBase {
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

    getRolesFromValues = (values: Object) => {
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
        const readOnly = !this.props.onSubmit;

        return (
            <Form hideRequiredMark>
                <Row gutter={8}>
                    <Col span={8}>
                        <InputItem
                          id="username"
                          label={Locale.trans('user.username')}
                          required
                          form={this.props.form}
                          readOnly={readOnly}
                        />
                    </Col>
                    <Col span={16}>
                        {this.renderRolesItem(readOnly)}
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

    renderRolesItem(readOnly: boolean) {
        const { roles } = this.props;

        if (!roles || roles.length === 0) {
            return null;
        }

        const { getFieldValue } = this.props.form;

        const initialRoleIds = (getFieldValue('roles') || []).map(g => g.id.toString());
        return (
            <SelectItem
              id="rolesId"
              multiple
              required
              label={Locale.trans('user.roles')}
              placeholder={Locale.trans('user.roles.placeholder')}
              initialValue={initialRoleIds}
              options={roles.map(r => ({ value: r.id, label: r.title }))}
              form={this.props.form}
              readOnly={readOnly}
            />
        );
    }
}

export default class UserParametersForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.user,
            formClass: UserParametersFormContent,
        };
    }
}
