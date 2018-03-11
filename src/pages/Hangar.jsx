import React from 'react';
import SecurityService from 'services/SecurityService';
import { Row, Col } from 'antd';

import Locale from 'locale/LocaleFactory';

import MainLayout from 'pages/MainLayout.jsx';

import PositionActions from 'actions/position/PositionActions';
import PositionStore from 'stores/position/PositionStore';

export default class Positions extends React.Component {

    constructor(props: Props) {
        super();
        this.state = {
            current: 'hangar',
            positions: PositionStore.getAll(),
        };
    }

    componentDidMount() {
        PositionStore.addChangeListener(this.getPositions);
        PositionActions.reload();
    }

    componentWillUnmount() {
        PositionStore.removeChangeListener(this.getPositions);
    }

    getPositions = () => {
        this.setState({
            positions: PositionStore.getAll()
        });
    };

    render() {
        const { positions, current } = this.state;

        let arrayLane = new Array("A"," ","B"," ","C"," ","D"," ","E"," ","F"," ","G"," ","H"," ","I"," ","J"," ","K"," ","L"," ","M"," ","N"," ","O"," ","P"," ","Q"," ","R"," ","S"," ","T"," ","U"," ","V"," ","W"," ","X"," ","Y"," ","Z");
        let arrayLandMark = new Array("1","2","3","4","5","6","7","8","9","10");

/*
        var currentLane = "";

        for(var i = 0 ; i < positions.length ; i++) {
            if(positions[i].lane != currentLane) {
                arrayLane.push(positions[i]);
                currentLane = positions[i].lane;
            }
        }
*/

        console.log(positions);

        const styleLane = {
            border: '1px solid black',
            width: '50px',
            height: '50px',
        };

        const styleWay = {
            background: 'grey',
            width: '50px',
            height: '50px',
        };

        return (
            <MainLayout current={current}>
                <Row gutter={16}>
                    <h4>HANGAR</h4>
                    <table bordered='true'>
                        <tbody>
                        { arrayLandMark.map(landMark =>
                            <tr>
                            { arrayLane.map(lane =>
                                lane == " " ? <td style={styleWay}></td> : <td style={styleLane} title={ lane + landMark }></td>
                            )}
                            </tr>
                        )}
                        </tbody>
                    </table>
                </Row>
            </MainLayout>
        );
    }
}
