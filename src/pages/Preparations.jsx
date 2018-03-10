import React from 'react';
import SecurityService from 'services/SecurityService';
import DateService from 'services/utils/DateService';
import { Row, Col, Card } from 'antd';

import Locale from 'locale/LocaleFactory';

import PreparationActions from 'actions/preparation/PreparationActions';
import PreparationStore from 'stores/preparation/PreparationStore';

export default class Notifications extends React.Component {

    constructor(props: Props) {
        super();
        this.state = {
            preparations: PreparationStore.getNotFinished(),
        };
    }

    componentDidMount() {
        PreparationStore.addChangeListener(this.getPreparations);
        PreparationActions.reload();
    }

    componentWillUnmount() {
        PreparationStore.removeChangeListener(this.getPreparations);
    }

    getPreparations = () => {
        this.setState({
            preparations: PreparationStore.getNotFinished()
        });
    };

    render() {
        const { preparations } = this.state;

        console.log(preparations);

        const customStyleCol = {
            marginBottom: 16,
        };


        return (
            <Row gutter={16}>
                <h3>Préparations en cours</h3>
                {preparations.map(p =>
                    <Col span={8} style={customStyleCol} key={p.id}>
                        <Card title={ p.startTime } bordered={true}>
                            Préparateur : {p.user.firstname.replace(/\w\S*/g,tStr => tStr.charAt(0).toUpperCase() + tStr.substr(1).toLowerCase(),)} {' '} { p.user.lastname.toUpperCase() }
                            <br/>
                            Heure de début : { DateService.formatApiTimeToDisplay(p.startTime) }
                        </Card>
                    </Col>
                )}
            </Row>
        );
    }
}
