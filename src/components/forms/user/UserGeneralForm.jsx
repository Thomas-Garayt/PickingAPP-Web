import React from 'react';
import { Form, Icon, Button, Row, Col } from 'antd';
import { InputItem, SelectItem, DatePickerItem } from 'components/forms/FormItems';
import DeleteButton from 'components/forms/DeleteButton.jsx';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

import DateConstants from 'constants/DateConstants';

export default class UserGeneralForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.user,
            formClass: UserGeneralFormContent
        };
    }
}

class UserGeneralFormContent extends FormBase {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = () => {
        const { form, onSubmit } = this.props;
        form.validateFields((err, values) => {
            if(err) {
                return;
            }

            const user = this.getUserFromValues(values);

            onSubmit(user);
        });
    }

    getUserFromValues = (values) => {
        var user = {};
        for(var k in values){

            if(k === 'birthDate-picker'){
                user.birthDate = values[k] ? values[k].format(DateConstants.API_DATE_FORMAT) : null;
            }else{
                user[k] = values[k];
            }
        }
        return user;
    }

    render() {
        const { getFieldValue } = this.props.form;
        return (
            <Form hideRequiredMark>
                <div className="full-size-form">
                    <div className="form-content">
                        <Row gutter={8}>
                            <Col span={8}>
                                <InputItem
                                    id="identifier"
                                    label={Locale.trans('user.identifier')}
                                    required
                                    form={this.props.form}
                                />
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <SelectItem
                                   id="gender"
                                   label={Locale.trans('user.gender')}
                                   options={ [{ value: 'mister', label: Locale.trans('mister') }, { value: 'miss', label: Locale.trans('miss') }] }
                                   required
                                   form={this.props.form}
                               />
                            </Col>
                            <Col span={8}>
                                <InputItem
                                    id="firstname"
                                    label={Locale.trans('user.firstname')}
                                    required
                                    form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                                <InputItem
                                    id="lastname"
                                    label={Locale.trans('user.lastname')}
                                    required
                                    form={this.props.form}
                                />
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <InputItem
                                    id="birthname"
                                    label={Locale.trans('user.birthname')}
                                    form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                                <InputItem
                                    id="socialSecurityNumber"
                                    label={Locale.trans('user.socialSecurityNumber')}
                                    rules={[{type: 'string', pattern: /^(1|2)[0-9][0-9](0?[1-9]|1[012])[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/, message: Locale.trans('error.socialSecurityNumber.invalid')}]}
                                    form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <DatePickerItem
                                    id="birthDate-picker"
                                    label={Locale.trans('user.birthDate')}
                                    initialValue={ getFieldValue('birthDate') }
                                    form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                                <InputItem
                                    id="placeOfBirth"
                                    label={Locale.trans('user.placeOfBirth')}
                                    form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                                <InputItem
                                    id="nationality"
                                    label={Locale.trans('user.nationality')}
                                    form={this.props.form}
                                />
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <div className="form-group-title"><Icon type="home" /> {Locale.trans('address')}</div>
                                <InputItem
                                    id="street"
                                    label={Locale.trans('address.street')}
                                    type="textarea"
                                    autosize={{ minRows: 1, maxRows: 5 }}
                                    form={this.props.form}
                                />
                                <InputItem
                                    id="postalCode"
                                    label={Locale.trans('address.postalCode')}
                                    form={this.props.form}
                                />
                                <InputItem
                                    id="city"
                                    label={Locale.trans('address.city')}
                                    form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                                <div className="form-group-title"><Icon type="phone" /> {Locale.trans('user.contact')}</div>
                                <InputItem
                                    id="phoneNumber"
                                    label={Locale.trans('user.phoneNumber')}
                                    rules={[{type: 'string', pattern: /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/, message: Locale.trans('error.phone.invalid')}]}
                                    form={this.props.form}
                                />
                                <InputItem
                                    id="email"
                                    label={Locale.trans('user.email')}
                                    required
                                    rules={[{ type: 'email', message: Locale.trans('error.email.invalid') }]}
                                    form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                            </Col>
                        </Row>
                    </div>
                    <div className="form-action-barre">
                        { this.props.onSubmit ? (
                            <Button type="primary" onClick={this.handleSubmit} disabled={this.hasErrors()}>
                                {Locale.trans('save')}
                            </Button>) : null }
                        &nbsp;
                        { this.props.onDelete ? <DeleteButton onDelete={this.props.onDelete}/> : null }
                    </div>
                </div>
            </Form>
        );
    }
}
