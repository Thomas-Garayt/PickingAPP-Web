// @flow

import React from 'react';
import Locale from 'locale/LocaleFactory';

import { Button, Row, Col } from 'antd';
import { Select } from 'components/FormFields';

import moment from 'moment';
import DateConstants from 'constants/DateConstants';
import DateService from 'services/utils/DateService';
import StringService from 'services/utils/StringService';


/**
 * Component that help selecting a month and easyly switch to next / previous one.
 *
 */
type Props = {
    year: number,
    month: number,
    onMonthChange: (year: number, month: number)=>void
}
export default class MonthPicker extends React.Component<void, Props, void> {
    changeMonth = (year: number, month: number): void => {
        if(month === 0){
            month = 12;
            year --;
        }else if(month === 13){
            month = 1;
            year ++;
        }

        this.props.onMonthChange(year, month);
    }

    render(): React.Element<*> {
        const {year, month} = this.props;
        Locale.initMoment();
        return  <Row gutter={8}>
                    <Col span={3}>
                        <Button shape="circle" className="pull-right" icon="left" onClick={() => this.changeMonth(year, month-1)} />
                    </Col>
                    <Col span={9}>
                        { this.renderSelectMonth() }
                    </Col>
                    <Col span={9}>
                        { this.renderSelectYear() }
                    </Col>
                    <Col span={3}>
                        <Button shape="circle" icon="right" onClick={() => this.changeMonth(year, month+1)} />
                    </Col>
                </Row>;
    }

    renderSelectMonth = (): React.Element<*> => {
        const {year, month} = this.props;
        const months: Array<string> = moment.months();

        return  <Select
                    value={ month }
                    onChange={(newMonth) => { this.changeMonth(year, newMonth) }}
                    options={months.map((m,i) => ({value: i+1, label: StringService.capitalize(m)}) )} />;
    }

    renderSelectYear = (): React.Element<*> => {
        const {year, month} = this.props;

        var options = [];
        for(var currentYear=year-5; currentYear<=year+5; currentYear++){
            options.push( { value: currentYear, label: currentYear} );
        }

        return  <Select
                    value={ year }
                    onChange={(newYear) => {
                        this.changeMonth(newYear, month)
                    }}
                    options={options} />;
    }
}
