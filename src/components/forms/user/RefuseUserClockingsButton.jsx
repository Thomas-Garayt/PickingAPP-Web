import React from 'react';
import {Form, Icon, Button, Row, Col, Input, Popover} from 'antd';

import Locale from 'locale/LocaleFactory';

export default class RefuseUserClockingsButton extends React.Component {
    constructor() {
        super();

        this.state = {
            visible: false,

            refusalJustification: null
        };
    }

    hide = () => {
        this.setState({visible: false});
    }

    handleVisibleChange = (visible) => {
        this.setState({visible});
    }

    render() {
        return (
            <Popover content={this.renderRefusalForm()} title={Locale.trans('user.clocking.refuse.title')} trigger="click" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}>
                <Button type="danger">{Locale.trans('user.clocking.refuse')}</Button>
            </Popover>
        );
    }

    _handleRefusalJustificationChange = (e) => {
        this.setState({refusalJustification: e.target.value});
    }

    confirmRefuse = () => {
        if(this.props.onRefuse){
            this.props.onRefuse(this.state.refusalJustification);
        }
    }

    renderRefusalForm() {
        return (
            <div style={{minWidth: 200}}>
                <Input
                    type="textarea"
                    autosize={{minRows: 2, maxRows: 10}}
                    placeholder={Locale.trans('user.clocking.refuse.placeholder')}
                    onChange={this._handleRefusalJustificationChange}
                    value={this.state.refusalJustification} />
                <div className="ant-popover-buttons" style={{margin: '8px 0 0 0'}}>
                    <Button type="danger" onClick={() => this.confirmRefuse()} size="small">{Locale.trans('user.clocking.refuse')}</Button>
                    <Button onClick={() => this.hide()} size="small">{Locale.trans('cancel')}</Button>
                </div>
            </div>
        );
    }
}
