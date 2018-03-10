import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import { InputItem } from 'components/forms/FormItems';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

class UserPasswordFormContent extends FormBase {
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

            const userPassword = this.getUserPasswordFromValues(values);

            onSubmit(userPassword);
        });
    };

    getUserPasswordFromValues = (values) => {
        const userPassword = {};
        for (const k in values) {
            userPassword[k] = values[k];
        }
        return userPassword;
    };

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback(Locale.trans('user.error.passwordMatch'));
        } else {
            callback();
        }
    };

    render() {
        return (
            <Form hideRequiredMark>
                <Row gutter={8}>
                    {this.props.isCurrentUser
                        ? <Col span={8}>
                            <InputItem
                              id="oldPassword"
                              type="password"
                              label={Locale.trans('user.oldPassword')}
                              required
                              form={this.props.form}
                            />
                        </Col>
                        : null}

                    <Col span={8}>
                        <InputItem
                          id="newPassword"
                          type="password"
                          label={Locale.trans('user.newPassword')}
                          required
                          form={this.props.form}
                        />
                    </Col>
                    <Col span={8}>
                        <InputItem
                          id="repeatNewPassword"
                          type="password"
                          label={Locale.trans('user.repeatNewPassword')}
                          required
                          rules={[
                              {
                                  validator: this.checkPassword,
                              },
                          ]}
                          form={this.props.form}
                        />
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={24}>
                        <Button
                          type="primary"
                          onClick={this.handleSubmit}
                          disabled={this.hasErrors()}
                        >
                            {Locale.trans('save')}
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default class UserPasswordForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.user,
            formClass: UserPasswordFormContent,
        };
    }
}
