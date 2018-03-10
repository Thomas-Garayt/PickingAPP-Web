import React from 'react';
import { Form, Input, Icon, Checkbox, Button } from 'antd';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';

export default class LoginForm extends FormBase {

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err && this.props.onLogin) {
                const {userName, password} = values;
                this.props.onLogin(userName, password, false);
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
                <Form onSubmit={this.handleSubmit} hideRequiredMark>
                    <Form.Item
                        validateStatus={this.getValidateStatus('userName')}
                        help={this.getHelp('userName')}
                        hasFeedback
                    >
                        {getFieldDecorator('userName', {
                            rules: [{required: true, message: Locale.trans('login.username.error.required') }],
                        })(
                        <Input addonBefore={ <Icon type="user" /> } placeholder={Locale.trans('login.username')} />
                        )}
                    </Form.Item>
                    <Form.Item
                        validateStatus={this.getValidateStatus('password')}
                        help={this.getHelp('password')}
                        hasFeedback
                    >
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: Locale.trans('login.password.error.required') }],
                        })(
                        <Input addonBefore={ <Icon type="lock" /> } type="password" placeholder={Locale.trans('login.password')} />
                        )}
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" disabled={this.hasErrors()}>
                        {Locale.trans('login.logIn.button')}
                    </Button>
                </Form>
        );
    }
}
