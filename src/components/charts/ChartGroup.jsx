// @flow

import React from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';

import { BarChart, LineChart } from 'components/charts/Charts';

type Data = { key: number | string, xAxis: number | string, value: number };

type Props = {
    title?: string,
    data: Array<Data>,
    xAxis: Array<number | string>,

    // The keys of the data to highlight
    highlightData?: Array<number | string>,

    onClick: (key: number | string) => void,

    children: Array<*>,
};
type State = {};

const margin = { top: 20, right: 20, bottom: 30, left: 40 };

function getMaxValueOfChild(child: *) {
    let maxValue;
    switch (child.type.name) {
    case 'BarChart':
        maxValue = BarChart.getMaxValue(child.props.data);
        break;
    case 'LineChart':
        maxValue = LineChart.getMaxValue(child.props.data);
        break;
    default:
        maxValue = 0;
    }

    return maxValue;
}

export default class ChartGroup extends React.Component<void, Props, State> {
    state: State;
    wrapper: *;
    node: *;

    tooltip: *;
    chart: *;
    charts: Array<*>;
    width: number;
    height: number;

    constructor() {
        super();
        this.charts = [];
    }

    componentDidMount() {
        this.initChartGroup();
        this.createChartGroup(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.updateSize();
        this.createChartGroup(nextProps);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillUnmount() {
        if (this.tooltip) {
            this.tooltip.remove();
        }
    }

    updateSize() {
        const width = this.wrapper.clientWidth;
        const height = this.wrapper.clientHeight;
        this.width = width;
        this.height = height;

        const svg = select(this.node);
        svg.attr('width', width).attr('height', height);
    }

    initChartGroup = () => {
        this.width = this.wrapper.clientWidth;
        this.height = this.wrapper.clientHeight;

        // Pie
        const chart = select(this.node);
        this.chart = chart.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
        for (let i = 0; i < this.props.children.length; i++) {
            const child = this.props.children[i];
            this.charts[child.key] = this.chart.append('g');
        }

        // Tooltip
        this.tooltip = select('body')
            .append('div')
            .attr('class', 'chart-tooltip')
            .attr('style', 'background: white; padding: 4px;')
            .style('position', 'absolute')
            .style('display', 'none')
            .style('width', 'auto')
            .style('height', 'auto')
            .style('z-index', '1000');
    };

    isHighlight = (props: Props, key: number | string) => {
        const { highlightData } = props;
        return highlightData && highlightData.indexOf(key) !== -1;
    };

    /**
     * Get the values of all children combined.
     * @return {[type]} [description]
     */
    getMaxValue = (props: Props) => max(props.children, child => getMaxValueOfChild(child));

    createChartGroup = (props: Props) => {
        const { xAxis, children } = props;

        // set the dimensions and margins of the graph
        const width = this.width - margin.left - margin.right;
        const height = this.height - margin.top - margin.bottom;

        // set the ranges
        const x = scaleBand()
            .range([0, width])
            .padding(0.1);
        const y = scaleLinear().range([height, 0]);

        // Scale the range of the data in the domains
        x.domain(xAxis);
        y.domain([0, this.getMaxValue(props)]);

        for (let i = 0; i < children.length; i++) {
            this.createChartOfChild(children[i], props, x, y, height);
        }

        // Add the Axis
        this.chart.select('.xAxis').remove();
        this.chart.select('.yAxis').remove();
        this.chart
            .append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0,${height})`)
            .call(axisBottom(x));
        this.chart
            .append('g')
            .attr('class', 'yAxis')
            .call(
                axisLeft(y).tickFormat((d) => {
                    let fd = d;
                    if (d > 1000000) {
                        fd = `${d / 1000000}M`;
                    } else if (d > 1000) {
                        fd = `${d / 1000}k`;
                    }
                    return `${fd}€`;
                }),
            );
    };

    createChartOfChild = (child: *, props: Props, x, y, height) => {
        switch (child.type.name) {
        case 'BarChart':
            BarChart.createBarChart(this.charts[child.key], child.props, x, y, height);
            break;
        case 'LineChart':
            LineChart.createLineChart(this.charts[child.key], child.props, x, y);
            break;
        default:
            // Nothing to do here
        }
    };

    render() {
        return (
            <div className="chart chart-group" ref={node => (this.wrapper = node)}>
                <svg ref={node => (this.node = node)} />
                {this.props.title ? <div className="title">{this.props.title}</div> : null}
            </div>
        );
    }
}
