import React from 'react';
import SecurityService from 'services/SecurityService';
import { Row, Col, Card } from 'antd';

import Locale from 'locale/LocaleFactory';

import NotificationActions from 'actions/notification/NotificationActions';
import NotificationStore from 'stores/notification/NotificationStore';

export default class Notifications extends React.Component {

    constructor(props: Props) {
        super();
        this.state = {
            notifications: NotificationStore.getAll(),
        };
    }

    componentDidMount() {
        NotificationStore.addChangeListener(this.getNotifications);
        NotificationActions.reload();
    }

    componentWillUnmount() {
        NotificationStore.removeChangeListener(this.getNotifications);
    }

    getNotifications = () => {
        this.setState({
            notifications: NotificationStore.getAll()
        });
    };

    render() {
        const { notifications } = this.state;

        const customStyleCol = {
            marginBottom: 16,
        };


        return (
            <Row gutter={16}>
                <h3>Notifications récentes</h3>
                {notifications.map(n =>
                    <Col span={8} style={customStyleCol} key={n.id}>
                        <Card title={ n.type } bordered={true}>
                            Position : { n.productPosition.position.lane } { n.productPosition.position.landmark } { n.productPosition.position.section } { n.productPosition.position.shelf }
                            <br/>
                            Code EAN13 : { n.productPosition.product.ean13 }
                            <br/>
                            <a href="#">Voir sur le plan du hangar</a>
                        </Card>
                    </Col>
                )}
            </Row>
        );
    }
}
