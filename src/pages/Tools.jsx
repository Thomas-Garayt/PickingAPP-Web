import React from 'react';
import SecurityService from 'services/SecurityService';
import { Row, Col, Button } from 'antd';

import Locale from 'locale/LocaleFactory';

import MainLayout from 'pages/MainLayout.jsx';

import OrderService from 'services/Order/OrderService';

import Toasts from 'components/Toasts.jsx';
import ToastActions from 'actions/ToastActions';

export default class Tools extends React.Component {

    constructor(props: Props) {
        super();
        this.state = {
            current: 'tools',
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    generateOrder = () => {
        OrderService.generateOrder(50).catch(this.handleError);
    }

    handleError = (err) => {
        var resp = JSON.parse(err.response);
        ToastActions.createToastError(resp.message);
    }


    render() {
        const { current } = this.state;

        return (
            <MainLayout current={current}>
                <Row gutter={16}>
                    <Button type="primary" onClick={this.generateOrder}>Genérer 50 commandes</Button>
                </Row>
            </MainLayout>
        );
    }
}
