// @flow

import React from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { line } from 'd3-shape';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { transition } from 'd3-transition';

type Data = { key: number | string, xAxis: number | string, value: number };

type Props = {
    title?: string,
    data: Array<Data>,

    // The keys of the data to highlight
    highlightData?: Array<number | string>,

    onClick: (key: number | string) => void,
};
type State = {};

const margin = { top: 20, right: 20, bottom: 30, left: 40 };

export default class LineChart extends React.Component<void, Props, State> {
    state: State;
    wrapper: *;
    node: *;

    tooltip: *;
    bar: *;

    width: number;
    height: number;

    componentDidMount() {
        this.initChart();
        this.createChart(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.updateSize();
        this.createChart(nextProps);
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

    initChart = () => {
        this.width = this.wrapper.clientWidth;
        this.height = this.wrapper.clientHeight;

        // Pie
        const bar = select(this.node);
        this.bar = bar.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

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

    createChart = (props: Props) => {
        const { data } = props;

        // set the dimensions and margins of the graph
        const width = this.width - margin.left - margin.right;
        const height = this.height - margin.top - margin.bottom;

        // set the ranges
        const x = scaleBand()
            .range([0, width])
            .padding(0.1);
        const y = scaleLinear().range([height, 0]);

        // Scale the range of the data in the domains
        x.domain(data.map(d => d.xAxis));
        y.domain([0, LineChart.getMaxValue(data)]);

        LineChart.createLineChart(this.bar, props, x, y);

        // Add the Axis
        this.bar.select('.xAxis').remove();
        this.bar.select('.yAxis').remove();
        this.bar
            .append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0,${height})`)
            .call(axisBottom(x));
        this.bar
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

    static getMaxValue(data: Array<Data>) {
        return max(data, d => d.value);
    }

    static createLineChart(chart, props: Props, x, y): void {
        const { data } = props;

        // append the rectangles for the bar chart
        const a = chart.selectAll('.line').data(data);

        // define the line
        const valueline = line()
            .x(d => x(d.xAxis) + x.bandwidth() / 2)
            .y(d => y(d.value));
        // Add the valueline path.
        a
            .enter()
            .append('path')
            .attr('class', 'line') // Add the valueline path.
            .attr('fill', 'none')
            .attr('stroke', '#000000')
            .attr('d', valueline(data));
        a
            .transition()
            .duration(300)
            .attr('d', valueline(data));
        a
            .exit()
            .transition()
            .duration(300)
            .attr('d', valueline([]))
            .remove();
    };

    render() {
        return (
            <div className="chart line-chart" ref={node => (this.wrapper = node)}>
                <svg ref={node => (this.node = node)} />
                {this.props.title ? <div className="title">{this.props.title}</div> : null}
            </div>
        );
    }
}
