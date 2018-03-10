import React from 'react';
import SecurityService from 'services/SecurityService';
import Resource from 'constants/permission/Resource';
import Access from 'constants/permission/AccessLevel';
import Locale from 'locale/LocaleFactory';
import { Button, Row, Col } from 'antd';

import WindowActions from 'actions/WindowActions';
import UserActions from 'actions/user/UserActions';

import UserStore from 'stores/user/UserStore';

import LoginStore from 'stores/LoginStore';

import AlphabeticalList from 'components/AlphabeticalList.jsx';

import ArrayService from 'services/utils/ArrayService';

export default class Users extends React.Component {
    constructor() {
        super();
        const myId = LoginStore.getUser() ? LoginStore.getUser().id : null;
        const me = myId ? UserStore.getById(myId) : null;

        this.state = {
            me,
            users: me
                ? ArrayService.uniqueEntity(UserStore.getSubordonatesOfUser(me).concat(me))
                : [],
        };
    }

    componentDidMount() {
        const { me } = this.state;

        UserStore.addChangeListener(this.getUsers);
        if (me) {
            UserActions.reloadById(me.id);
            UserActions.reloadSubordonates(me.id);
        }
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.getUsers);
    }

    getUsers = () => {
        const { me } = this.state;
        this.setState({
            users: me
                ? ArrayService.uniqueEntity(UserStore.getSubordonatesOfUser(me).concat(me))
                : [],
        });
    };

    editUser = (user) => {
        WindowActions.createWindow(
            'EDIT_USER',
            { user },
            { title: `${user.firstname} ${user.lastname}` },
        );
    };

    createUser() {
        WindowActions.createWindow('CREATE_USER');
    }

    showRoles() {
        WindowActions.createWindow('ROLES');
    }

    render() {
        const { users } = this.state;

        const listHeight = this.props.containerSize.height - 55;

        const rowDef = {
            key: 'id',
            sortBy: 'lastname',
            render: record => (
                <Row>
                    <Col span={24}>
                        {record.lastname} {record.firstname}
                    </Col>
                </Row>
            ),
        };

        return (
            <div>
                {this.renderCreateButton()} &nbsp; {this.renderManageRolesButton()}
                <AlphabeticalList
                  dataSource={users}
                  rowDef={rowDef}
                  height={listHeight}
                  onRow={u => ({
                      onClick: () => {
                          this.editUser(u);
                      }
                  })}
                />
            </div>
        );
    }

    renderCreateButton() {
        if (!SecurityService.isGranted(Resource.USER, Access.CREATE)) {
            return null;
        }
        return (
            <Button type="primary" onClick={() => this.createUser()}>
                {Locale.trans('user.create.button')}
            </Button>
        );
    }

    renderManageRolesButton() {
        if (!SecurityService.isGranted(Resource.ROLE, Access.READ)) {
            return null;
        }
        return (
            <Button onClick={() => this.showRoles()}>
                {Locale.trans('user.manageRoles.button')}
            </Button>
        );
    }
}
