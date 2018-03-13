import React from 'react';
import SecurityService from 'services/SecurityService';
import { Row, Col } from 'antd';
import { Composite } from 'react-composite';

import Locale from 'locale/LocaleFactory';

import MainLayout from 'pages/MainLayout.jsx';

import PositionActions from 'actions/position/PositionActions';
import PositionStore from 'stores/position/PositionStore';

export default class Hangar extends React.Component {

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

    getStateOfLandMark = (landMark) => {
        const { positions } = this.state;

        let arrayLandMark = landMark.split("_");
        let landMarkNumber = arrayLandMark[1];

        let countPosition = 0;
        let countNoEmpty = 0;
        for(let i = 0 ; i < positions.length ; i++) {
            if(countPosition < 10) {
                if(positions[i].landmark == landMarkNumber) {
                    if(!positions[i].empty) {
                        countNoEmpty++;
                    }
                    countPosition++;
                }
            }
        }
        return countNoEmpty;
/*
        if(countNoEmpty == 0) {
            return "0";
        }
        if(countNoEmpty > 0 && countNoEmpty < 10) {
            return "1";
        }
        if(countNoEmpty == 10) {
            return "2";
        }
*/
    }

    render() {
        const { positions, current } = this.state;

        console.log(positions);

        let arrayHangar = new Array();

        let arrayLaneSimple = new Array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");

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

        let arrayOrderHangar = new Array();

        for(let j = 0 ; j < 10 ; j++) {
            let arrayLane = new Array();
            for(let k = 0; k < arrayHangar.length ; k++) {
                arrayLane.push(arrayHangar[k][j]);
            }
            arrayOrderHangar.push(arrayLane);
        }

        console.log(arrayOrderHangar);

        let styleLane = {
            border: '1px solid black',
            width: '50px',
            height: '50px',
        };

        // styleLane["background"] = "red";

        let styleWay = {
            background: 'grey',
            width: '50px',
            height: '50px',
        };

/*
{
    var n = this.getStateOfLandMark(landmark);
    n == "0" && styleLane["background"] = "blue";
    n == "1" && styleLane["background"] = "orange";
    n == "2" && styleLane["background"] = "red";
}
*/

/*
let n = this.getStateOfLandMark(landmark);
{ n == "0" && styleLane["background"] = "blue"; }
{ n == "1" && styleLane["background"] = "orange"; }
{ n == "2" && styleLane["background"] = "red"; }
*/

        return (
            <MainLayout current={current}>
                <Row gutter={16}>
                    <table bordered='true'>
                        <tbody>
                        { arrayOrderHangar.map(lane =>
                            <tr>
                                { lane.map(landmark =>

                                    <Composite>
                                        <td style={styleLane} title={ landmark }>{ landmark } {' - '} { this.getStateOfLandMark(landmark) }</td>
                                        <td style={styleWay}></td>
                                    </Composite>

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
