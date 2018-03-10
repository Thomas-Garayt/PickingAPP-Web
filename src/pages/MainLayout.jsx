import React from 'react';
import SecurityService from 'services/SecurityService';

import { Button } from 'antd';
import Locale from 'locale/LocaleFactory';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';

export default class MainLayout extends React.Component {

    logout = () => {
        LoginActions.logoutUser();
    };

    render() {

        const user = LoginStore.getUser();

        const fullName = `${user.firstname.replace(
            /\w\S*/g,
            tStr => tStr.charAt(0).toUpperCase() + tStr.substr(1).toLowerCase(),
        )} ${user.lastname.toUpperCase()}`;

        return (
            <div className="layout">
                <div className="layout-header">
                    <div className="welcome-message">
                        Bonjour {' '} { fullName }
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
