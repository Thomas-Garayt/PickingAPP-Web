// @flow

import React from 'react';
import Locale from 'locale/LocaleFactory';

import { Button, Row, Col } from 'antd';
import { Select } from 'components/FormFields';

import moment from 'moment';
import DateConstants from 'constants/DateConstants';
import DateService from 'services/utils/DateService';


/**
 * Component that help selecting a year and easyly switch to next / previous one.
 *
 */
type Props = {
    year: number,
    onYearChange: (year: number)=>void
}

export default class YearPicker extends React.Component<void, Props, void> {
    changeYear = (year: number): void => {
        this.props.onYearChange(year);
    }

    render(): React.Element<*> {
        const { year } = this.props;
        Locale.initMoment();
        return  <Row gutter={8}>
                    <Col span={7}>
                        <Button shape="circle" className="pull-right" icon="left" onClick={() => this.changeYear(year-1)} />
                    </Col>
                    <Col span={10}>
                        { this.renderSelectYear() }
                    </Col>
                    <Col span={7}>
                        <Button shape="circle" icon="right" onClick={() => this.changeYear(year+1)} />
                    </Col>
                </Row>;
    }

    renderSelectYear = (): React.Element<*> => {
        const { year } = this.props;

        var options = [];
        for(var currentYear = year-5; currentYear <= year+5; currentYear++) {
            options.push( { value: currentYear, label: currentYear} );
        }

        return  <Select
                    value={ year }
                    onChange={(newYear) => {
                        this.changeYear(newYear)
                    }}
                    options={options} />;
    }
}
