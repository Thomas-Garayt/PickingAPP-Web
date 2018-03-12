import React from 'react';
import {  BrowserRouter as Router,  Link,  Route,  Switch,} from 'react-router';
import SecurityService from 'services/SecurityService';


import { Button, Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import Locale from 'locale/LocaleFactory';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';

export default class MainLayout extends React.Component {

    constructor(props: Props) {
        super();
        this.state = {
          current: props.current ? props.current : 'accueil',
        }
    }

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
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    <Menu.Item key="accueil">
                        <Link to={{pathname: 'home'}}>Accueil</Link>
                    </Menu.Item>
                    <Menu.Item key="hangar">
                        <Link to={{pathname: 'hangar'}}>Gestion Hangar</Link>
                    </Menu.Item>
                    <Menu.Item key="tools">
                        <Link to={{pathname: 'tools'}}>Outils Admin</Link>
                    </Menu.Item>
                    <SubMenu title={<span><Icon type="setting" />Navigation Three - Submenu</span>}>
                        <MenuItemGroup title="Item 1">
                            <Menu.Item key="setting:1">Option 1</Menu.Item>
                            <Menu.Item key="setting:2">Option 2</Menu.Item>
                        </MenuItemGroup>
                        <MenuItemGroup title="Item 2">
                            <Menu.Item key="setting:3">Option 3</Menu.Item>
                            <Menu.Item key="setting:4">Option 4</Menu.Item>
                        </MenuItemGroup>
                    </SubMenu>
                </Menu>
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
