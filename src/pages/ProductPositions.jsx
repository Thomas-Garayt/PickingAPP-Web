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

        let arrayLaneSimple = new Array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");

        let arrayHangar = new Array();

        for(let i = 0 ; i < arrayLaneSimple.length ; i++) {

            let lane = arrayLaneSimple[i];
            let arrayLane = new Array();

            if(i%2 == 0) {
                for(let j = 1 ; j <= 10 ; j++) {
                    let numLandMark = i*10+j;
                    arrayLane.push(lane + "_" + numLandMark)
                }
            }
            else {
                for(let j = 10 ; j >= 1 ; j--) {
                    let numLandMark = i*10+j;
                    arrayLane.push(lane + "_" + numLandMark)
                }
            }

            arrayHangar.push(arrayLane);
        }

        let currentLandMark = "";
        let currentLane = "";
        let arrayPositions = new Array();

        for(let i = 0 ; i < positions.length ; i++) {

                if(currentLandMark != positions[i].landmark) {
                    arrayPositions.push(positions[i]);
                    currentLandMark = positions[i].landmark;
                }

                currentLane = positions[i].lane;

        }

        console.log(arrayPositions);

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
                    <h4>Hangar</h4>
                    <table bordered='true'>
                        <tbody>
                        { arrayHangar.map(lane =>
                            <tr>
                            { lane.map(landmark =>
                                <td style={styleLane} title={ landmark }></td>
                            )}
                            </tr>
                            <tr>
                            { lane.map(landmark =>
                                <td style={styleWay}></td>
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
