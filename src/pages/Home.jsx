import React from 'react';
import SecurityService from 'services/SecurityService';
import { Row, Col } from 'antd';

import { Responsive, WidthProvider } from 'react-grid-layout';
import Locale from 'locale/LocaleFactory';

import Layout from 'pages/Layout.jsx';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class Home extends React.Component {

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <Layout>
                <Row>
                    <Col span={24}>
                    Page Home
                    </Col>
                </Row>
            </Layout>
        );
    }
}
