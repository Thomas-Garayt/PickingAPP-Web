// @flow

import React from 'react';
import { Menu, Icon } from 'antd';

import Locale from 'locale/LocaleFactory';
import WindowActions from 'actions/WindowActions';

type Props = {
    business: Business,
};

export default class BusinessQuickAccess extends React.PureComponent<void, Props, void> {
    handleMenuClick = ({ key }: {key: string}) => {
        const { business } = this.props;
        WindowActions.createWindow('EDIT_BUSINESS', {
            business,
            tab: key,
        });
    };

    render() {
        return (
            <Menu onClick={this.handleMenuClick} selectable={false}>
                <Menu.Item key="info" className="quick-access-menu-item">
                    <Icon type="file" /> {Locale.trans('business.info.title')}
                </Menu.Item>
                <Menu.Item key="paymentTerm" className="quick-access-menu-item">
                    <Icon type="folder" /> {Locale.trans('business.paymentTerm.title')}
                </Menu.Item>
                <Menu.Item key="providerBill" className="quick-access-menu-item">
                    <Icon type="folder" /> {Locale.trans('business.providerBill.title')}
                </Menu.Item>
            </Menu>
        );
    }
}
