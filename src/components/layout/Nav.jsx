import React from 'react';
import { IndexLink, Link, hashHistory } from 'react-router';
import {Menu, Icon} from 'antd';
import LoginActions from 'actions/LoginActions';

export default class Nav extends React.Component {
    constructor() {
        super()
        this.state = {
            collapsed: true,
        };
    }

    toggleCollapse() {
        const collapsed = !this.state.collapsed;
        this.setState({collapsed});
    }
    
    logout = () => {
        LoginActions.logoutUser();
    }
    
    handleMenuClick = (item) => {
        const {key, keyPath} = item;        
        switch(key){
            case "logout":
                this.logout();
                break;
            case "home":
                hashHistory.push("/");
                break;
            case "users":
                hashHistory.push("/users/");
                break;
            default:
                hashHistory.push(keyPath);
        }
    }
    
    _pathToKey(path){
        if(path.match(/^\/users/)){
            return "users";
        }else if(path === "/"){
            return "home";
        }
        
        return '';
    }

    render() {
        const {location, collapse} = this.props;
        const selectedKey = this._pathToKey(location.pathname);
        return (                
                <Menu mode="inline" theme="dark" defaultSelectedKeys={[selectedKey]} onSelect={this.handleMenuClick}>
                    <Menu.Item key="home">
                        <Icon type="home" />
                        {!collapse && <span className="nav-text">Home</span>}
                    </Menu.Item>
                    <Menu.Item key="users">
                        <Icon type="team" />
                        {!collapse && <span className="nav-text">Users</span>}
                    </Menu.Item>
                    <Menu.Item key="logout">
                        <Icon type="logout" />
                        {!collapse && <span className="nav-text">Logout</span>}
                    </Menu.Item>
                </Menu>
                );
    }
}