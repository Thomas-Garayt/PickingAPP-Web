import React from 'react';
import {Form, Row, Col} from 'antd';

import LoginForm from 'components/forms/LoginForm.jsx';
import AuthService from 'services/AuthService';
import Toasts from 'components/Toasts.jsx';
import ToastActions from 'actions/ToastActions';

export default class Login extends React.Component {

    login = (username, password) => {
        AuthService.login(username, password).catch(this.handleError);
    }

    handleError = (err) => {
        var resp = JSON.parse(err.response);
        ToastActions.createToastError(resp.message);
    }

    render() {
        const WrappedLoginForm = Form.create()(LoginForm);
        return (
                        <Row type="flex" align="middle" justify="center" className="login-page">
                            <Col xs={14} sm={8} md={6} lg={4} xl={4}>
                                <p>PickingAPP-Web</p>
                                <WrappedLoginForm onLogin={this.login} />
                            </Col>
                            <Toasts />
                        </Row>

                );
    }
}
