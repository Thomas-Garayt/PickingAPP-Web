import React from 'react';
import { Row, Col } from 'antd';
import FormItem, { InputItem, CheckboxItem, SelectItem, DatePickerItem }  from 'components/forms/FormItems';
import Label from 'components/forms/Label.jsx';
import Locale from 'locale/LocaleFactory';
import DateConstants from 'constants/DateConstants';

export default class BusinessInternalFormFields extends React.Component {

    render() {

        const state = ['waiting', 'costing', 'progress', 'closed', 'archived'];

        return (
                <div>

                    <Row gutter={8} style={{marginRight: 0}}>
                        <Col span={12} >
                            <InputItem
                                id="reference"
                                required
                                label={Locale.trans('business.reference')}
                                placeholder={Locale.trans('business.reference')}
                                form={this.props.form}
                            />
                        </Col>
                        <Col span={12} >
                            <br/>
                            <CheckboxItem
                                id='isClockable'
                                label={Locale.trans('business.isClockable')}
                                form={this.props.form}
                            />
                        </Col>
                    </Row>

                    <InputItem
                        id="title"
                        required
                        label={Locale.trans('business.title')}
                        placeholder={Locale.trans('business.title')}
                        form={this.props.form}
                    />

                    <SelectItem
                        id="state"
                        required
                        label={Locale.trans('business.state')}
                        placeholder={Locale.trans('business.state')}
                        options={ state.map(s => ({ value: s, label: Locale.trans('business.states.' + s) }))}

                        form={this.props.form}
                    />

                    <InputItem
                        id="amountQuote"
                        required
                        label={Locale.trans('business.amountBudget')}
                        placeholder={Locale.trans('business.amountBudget')}
                        suffix='€'
                        form={this.props.form}
                    />

                </div>
        );
    }
}
