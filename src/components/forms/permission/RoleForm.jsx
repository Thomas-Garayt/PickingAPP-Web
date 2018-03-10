// @flow

import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import FormItem from 'components/forms/FormItems';
import DeleteButton from 'components/forms/DeleteButton.jsx';
import Label from 'components/forms/Label.jsx';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

import AccessLevel from 'constants/permission/AccessLevel';
import Resource from 'constants/permission/Resource';

import HelpButton from 'components/HelpButton.jsx';

export default class RoleForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.role,
            formClass: RoleFormContent,
        };
    }
}

class RoleFormContent extends FormBase {
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

            const role = this.getRoleFromValues(values);
            const permissions = this.getPermissionsFromValues(values);

            onSubmit(role, permissions);
        });
    };

    getPermissionsFromValues = (values) => {
        const permissions = [];

        for (const k in values) {
            if (k === 'title') {
                continue;
            }

            const isChecked = values[k];

            const iSplit = k.lastIndexOf('-');
            const resource = k.substr(0, iSplit);
            const access = parseInt(k.substr(iSplit + 1), 10);

            let permission = permissions.find(p => p.resource === resource);
            if (!permission) {
                permission = {
                    resource,
                    accesslevel: 0,
                };
                permissions.push(permission);
            }

            if (isChecked) {
                permission.accesslevel |= access;
            }
        }

        return permissions;
    };

    getRoleFromValues = values => ({
        title: values.title,
    });

    getPermissions = () => {
        const { getFieldValue } = this.props.form;
        const phones = getFieldValue('permissions');
        return phones || [];
    };
    isAccessAllowedForResource = (resource, access) => {
        const permissions = this.getPermissions();

        for (let i = 0; i < permissions.length; i++) {
            const permission = permissions[i];

            if (permission.resource === resource) {
                return (parseInt(permission.accesslevel, 10) & parseInt(access, 10)) !== 0;
            }
        }

        return false;
    };

    render() {
        return (
            <Form hideRequiredMark>
                <div className="full-size-form role-form">
                    <div className="form-content">
                        <FormItem.Input
                          id="title"
                          required
                          placeholder={Locale.trans('role.title')}
                          form={this.props.form}
                        />

                        <div>
                            <h4>Absences</h4>
                            <div className="group">
                                <div>
                                    <div className="label">Solde congés</div>
                                    {this.renderPermissionCheckbox(
                                        'role.access.edit',
                                        Resource.ABSENCE_COUNTER,
                                        AccessLevel.EDIT,
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4>Affaires</h4>
                            <div className="group">
                                <div>
                                    <div className="label">Affaires</div>

                                    {this.renderPermissionCheckbox(
                                        'role.access.read',
                                        Resource.BUSINESS,
                                        AccessLevel.READ,
                                    )}

                                    {this.renderPermissionCheckbox(
                                        'role.access.create',
                                        Resource.BUSINESS,
                                        AccessLevel.CREATE,
                                    )}

                                    {this.renderPermissionCheckbox(
                                        'role.access.edit',
                                        Resource.BUSINESS,
                                        AccessLevel.EDIT,
                                    )}

                                    {this.renderPermissionCheckbox(
                                        'role.access.delete',
                                        Resource.BUSINESS,
                                        AccessLevel.DELETE,
                                    )}

                                    <div className="group">
                                        <div>
                                            <div className="label">Facturation</div>

                                            {this.renderPermissionCheckbox(
                                                'role.access.manage',
                                                Resource.BUSINESS_PAYMENT_TERM,
                                                AccessLevel.READ,
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="label">Synthèse Factu</div>
                                    {this.renderPermissionCheckbox(
                                        'role.access.read',
                                        Resource.BUSINESS_BILLING_REVUE,
                                        AccessLevel.READ,
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4>Annuaire</h4>
                            <div className="group">
                                <div>
                                    <div className="label">Contacts</div>
                                    {this.renderPermissionCheckbox(
                                        'role.access.delete',
                                        Resource.CONTACT,
                                        AccessLevel.DELETE,
                                    )}
                                </div>

                                <div>
                                    <div className="label">Sociétés</div>
                                    {this.renderPermissionCheckbox(
                                        'role.access.delete',
                                        Resource.COMPANY,
                                        AccessLevel.DELETE,
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4>Utilisateurs</h4>
                            <div className="group">
                                <div>
                                    <div className="label">
                                        Tous les utilisateurs
                                    </div>
                                    {this.renderPermissionCheckbox(
                                        'role.access.manage',
                                        Resource.ALL_USERS,
                                        AccessLevel.READ,
                                    )}
                                    <HelpButton
                                      title="Gérer tous les utilisateurs"
                                      content="Ce droit permet de gérer tous les utilisateurs comme si nous étions leur responsable. (Fiche utilisateur / Pointages / Absences)"
                                    />
                                </div>
                                <div>
                                    <div className="label">Utilisateur</div>
                                    {this.renderPermissionCheckbox(
                                        'role.access.read',
                                        Resource.USER,
                                        AccessLevel.READ,
                                    )}
                                    {this.renderPermissionCheckbox(
                                        'role.access.create',
                                        Resource.USER,
                                        AccessLevel.CREATE,
                                    )}
                                    {this.renderPermissionCheckbox(
                                        'role.access.delete',
                                        Resource.USER,
                                        AccessLevel.DELETE,
                                    )}
                                    <div className="group">
                                        <div>
                                            <div className="label">Paramètres</div>
                                            {this.renderPermissionCheckbox(
                                                'role.access.edit',
                                                Resource.USER_PARAMETERS,
                                                AccessLevel.EDIT,
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="label">Roles</div>
                                    {this.renderPermissionCheckbox(
                                        'role.access.manage',
                                        Resource.ROLE,
                                        AccessLevel.READ,
                                    )}
                                </div>
                            </div>
                        </div>
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

    renderPermissionCheckbox(label: string, resource: string, accessLevel: number) {
        return (
            <FormItem.Checkbox
              id={`${resource}-${accessLevel}`}
              initialValue={this.isAccessAllowedForResource(resource, accessLevel)}
              label={Locale.trans(label)}
              form={this.props.form}
            />
        );
    }
}
