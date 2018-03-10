import React from 'react';
import SecurityService from 'services/SecurityService';
import { Row, Col } from 'antd';

import Locale from 'locale/LocaleFactory';

export default class Preparations extends React.Component {

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <Row>
                <Col span={24}>
                    <h3>Préparations en cours</h3>
                </Col>
            </Row>
        );
    }
}
