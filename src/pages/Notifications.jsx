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
        console.log(notifications);
        return (
            <Row gutter={16}>
                <h3>Notifications récentes</h3>
                {notifications.map(n =>
                    <Col span={8} key={n.id}>
                        <Card title={ n.type } bordered={false}>
                        { n.productPosition.position.lane }
                        </Card>
                    </Col>
                )}
            </Row>
        );
    }
}
