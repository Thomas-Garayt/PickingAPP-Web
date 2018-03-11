import React from 'react';
import SecurityService from 'services/SecurityService';
import { Row, Col } from 'antd';

import { Responsive, WidthProvider } from 'react-grid-layout';
import Locale from 'locale/LocaleFactory';

import MainLayout from 'pages/MainLayout.jsx';

import Notifications from 'pages/Notifications.jsx';
import Preparations from 'pages/Preparations.jsx';

export default class Home extends React.Component {

    constructor(props: Props) {
        super();
        this.state = {
          current: 'accueil',
        }
    }


    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const { current } = this.state;
        return (
            <MainLayout current={current}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Notifications/>
                        <br/>
                    </Col>
                    <Col span={12}>
                        <Preparations/>
                        <br/>
                    </Col>
                </Row>
            </MainLayout>
        );
    }
}
