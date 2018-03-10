import React from "react";
import { Table, Row, Col, Form, Icon, Button, Tooltip, Input } from "antd";

import { DatePicker } from "components/FormFields";

import DateService from "services/utils/DateService";
import MathService from "services/utils/MathService";

export default class BusinessProviderBillOccurenceTable extends React.Component {
    constructor(props) {
        super();
        this.state = {
            editedOccurence: null
        };
    }

    editOccurence = occurence => {
        this.setState({
            editedOccurence: occurence
        });
    };

    stopEditOccurence = () => {
        this.setState({
            editedOccurence: null
        });
    };

    render() {
        const { occurences } = this.props;

        if (!occurences || !occurences.length) {
            return <div>Aucune échéance</div>;
        }
        return (
            <div>
                <h3>Echéances</h3>
                <div className="bill-occurences">
                    {occurences.map(this.renderOccurenceRow)}
                </div>
            </div>
        );
    }

    handleChange = (occurence, fieldName, value) => {
        const { editedOccurence } = this.state;
        if (!editedOccurence) {
            return;
        }
        editedOccurence[fieldName] = value;
        this.setState({
            editedOccurence
        });
        if (this.props.onChange) {
            this.props.onChange(editedOccurence);
        }
    };
    renderOccurenceRow = occurence => {
        const { editedOccurence } = this.state;

        if (editedOccurence && occurence.id === editedOccurence.id) {
            return (
                <Row className="edit" gutter={8} key={occurence.id}>
                    <Col span={12}>
                        <DatePicker
                            value={DateService.parseApi(
                                editedOccurence.paymentDate
                            )}
                            onChange={v => {
                                this.handleChange(
                                    occurence,
                                    "paymentDate",
                                    DateService.formatApi(v)
                                );
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <Input
                            value={editedOccurence.amount}
                            addonAfter="€ HT"
                            onChange={e => {
                                this.handleChange(
                                    occurence,
                                    "amount",
                                    e.target.value
                                );
                            }}
                        />
                        <Icon
                            type="check-circle"
                            onClick={this.stopEditOccurence}
                        />
                    </Col>
                </Row>
            );
        }

        return (
            <Row gutter={8} key={occurence.id}>
                <Col span={12}>
                    {DateService.formatApiToDisplay(occurence.paymentDate)}
                </Col>
                <Col span={12}>
                    {MathService.format(occurence.amount, 2)} € HT
                    <Icon
                        type="edit"
                        onClick={() => {
                            this.editOccurence(occurence);
                        }}
                    />
                </Col>
            </Row>
        );
    };
}
