// @flow

import React from 'react';

import moment from 'moment';
import StringService from 'services/utils/StringService';

type Column = {
    title: string | React.Component<*>,
    key: string,
    dataIndex?: string,
    render: (text: string, record: Object) => string | React.Component<*>,
};

type State = {
    displayedDates: moment[],
};

type Props = {
    year: number,
    week: number,
    countDisplayedWeeks: number,
    dataSource: Object[],
    previousColumns?: Column[],

    renderCell: (record: Object, date: Date) => null | string | React.Element<*>,
};

function getDisplayedDates(year: number, week: number, countDisplayedWeeks: number): moment[] {
    const countDisplayedDays = countDisplayedWeeks * 7;

    const dates = [];
    let currentDate = moment().year(year).week(week).day(1);
    for (let i = 0; i < countDisplayedDays; i++) {
        dates.push(currentDate);
        currentDate = moment(currentDate).add(1, 'days');
    }

    return dates;
}

export default class RollingWeeksTable extends React.Component<void, Props, State> {
    state: State;

    constructor(props: Props) {
        super();
        this.state = {
            displayedDates: getDisplayedDates(props.year, props.week, props.countDisplayedWeeks),
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        const { year, week, countDisplayedWeeks } = this.props;

        const isYearSame = nextProps.year === year;
        const isWeekSame = nextProps.week === week;
        const isCountDisplayedWeeksSame = nextProps.countDisplayedWeeks === countDisplayedWeeks;

        if (!isYearSame || !isWeekSame || !isCountDisplayedWeeksSame) {
            const displayedDates = getDisplayedDates(
                nextProps.year,
                nextProps.week,
                nextProps.countDisplayedWeeks,
            );
            this.setState({
                displayedDates,
            });
        }
    }

    render() {
        const { previousColumns, dataSource } = this.props;

        const previousColumnsPadding = previousColumns && previousColumns.length > 0
            ? <th colSpan={previousColumns.length} />
            : null;

        return (
            <div className="ant-table">
                <table style={{ width: '100%', borderSpacing: 0 }}>
                    <thead className="ant-table-thead">
                        <tr className="bordered small">
                            {previousColumnsPadding}
                            {this.renderMonthsHeaders()}
                        </tr>
                        <tr className="bordered small">
                            {previousColumnsPadding}
                            {this.renderWeeksHeader()}
                        </tr>
                        <tr>
                            {this.renderPreviousHeaders()}
                            {this.renderDaysHeader()}
                        </tr>
                    </thead>
                    <tbody className="ant-table-tbody">
                        {dataSource.map(record => this.renderRow(record))}
                    </tbody>
                </table>
            </div>
        );
    }

    renderRow(record: Object) {
        const { previousColumns, renderCell } = this.props;
        const { displayedDates } = this.state;

        let key;
        if (record.id) {
            key = record.id;
        } else if (record.key) {
            key = record.key;
        }

        return (
            <tr key={key}>
                {previousColumns
                    ? previousColumns.map(c =>
                        <td key={c.key}>{this.renderColumnCell(c, record)}</td>,
                      )
                    : null}
                {displayedDates.map(d =>
                    <td key={d.format('YYMD')}>{renderCell(record, d.toDate())}</td>,
                )}
            </tr>
        );
    }

    renderColumnCell(column: Column, record: Object) {
        const { dataIndex, render } = column;
        const text = dataIndex ? record[dataIndex] : '';

        if (render) {
            return render(text, record);
        }
        return text;
    }

    renderMonthsHeaders() {
        const { displayedDates } = this.state;

        const headers = [];
        let previousMonth;
        let previousMonthKey;
        let previousMonthSpan = 1;
        for (let i = 0; i < displayedDates.length; i++) {
            const currentMonth = displayedDates[i].format('MMMM');
            const currentMonthKey = displayedDates[i].format('YYM');
            if (!previousMonth) {
                previousMonthSpan = 1;
                previousMonth = currentMonth;
                previousMonthKey = currentMonthKey;
            } else if (previousMonth !== currentMonth) {
                headers.push(
                    <th key={previousMonthKey} colSpan={previousMonthSpan}>{StringService.capitalize(previousMonth)}</th>,
                );
                previousMonthSpan = 1;
                previousMonth = currentMonth;
                previousMonthKey = currentMonthKey;
            } else {
                previousMonthSpan++;
            }
        }
        headers.push(<th key={previousMonthKey} colSpan={previousMonthSpan}>{StringService.capitalize(previousMonth)}</th>);
        return headers;
    }

    renderWeeksHeader() {
        const { year, week, countDisplayedWeeks } = this.props;

        const totalWeeks = moment().year(year).weeksInYear();

        const headers = [];
        for (let i = 0; i < countDisplayedWeeks; i++) {
            const w = week + i;
            const currentWeek = w > totalWeeks ? w - totalWeeks : week + i;
            headers.push(<th key={currentWeek} colSpan={7}>{currentWeek}</th>);
        }
        return headers;
    }

    renderDaysHeader() {
        const { displayedDates } = this.state;
        return displayedDates.map(d =>
            <th style={{ textAlign: 'center' }} key={d.format('YYMD')}>{StringService.capitalize(d.format('dd'))}<br />{d.format('DD')}</th>,
        );
    }

    renderPreviousHeaders() {
        const { previousColumns } = this.props;
        if (previousColumns && previousColumns.length > 0) {
            return previousColumns.map(c => <th key={c.key}>{c.title}</th>);
        }
        return null;
    }
}
