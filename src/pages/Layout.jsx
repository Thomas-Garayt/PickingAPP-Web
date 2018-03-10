import React from 'react';
import SecurityService from 'services/SecurityService';

import { Button } from 'antd';
import Locale from 'locale/LocaleFactory';

import Toasts from 'components/Toasts.jsx';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';

export default class Layout extends React.Component {
    logout = () => {
        LoginActions.logoutUser();
    };

    handleUserClick = () => {
        const user = LoginStore.getUser();
    };

    render() {

        return (
            <div className="layout">
                <div className="layout-header">
                    <div className="welcome-message">
                        Bonjour __name__
                    </div>
                    <Button className="pull-right" icon="logout" onClick={this.logout}>
                        {Locale.trans('login.logOut.button')}
                    </Button>
                </div>
                <div className="layout-container">
                    <div className="layout-content">
                    { this.props.children }
                    </div>
                </div>
                <div className="layout-footer">{Locale.trans('license')}</div>
            </div>
        );
    }
}
