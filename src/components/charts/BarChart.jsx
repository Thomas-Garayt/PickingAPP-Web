// @flow

import React from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { transition } from 'd3-transition';

type Data = { key: number | string, xAxis: number | string, value?: number, values?: number[] };

type Props = {
    title?: string,
    data: Array<Data>,
    groupColors?: {[key: string]: string},

    // The keys of the data to highlight
    highlightData?: Array<number | string>,

    onClick: (key: number | string) => void,
};
type State = {};

const margin = { top: 20, right: 20, bottom: 30, left: 40 };

const colorPalette = ['#faae31', '#1e2942', '#4a6dbe', '#a5a5a5', '#d0d0d0', '#d0743c', '#ff8c00'];
export default class BarChart extends React.Component<void, Props, State> {
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
        y.domain([0, BarChart.getMaxValue(data)]);

        BarChart.createBarChart(this.bar, props, x, y, height);

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
        let maxVal;
        if (BarChart.isMultipleSourceData(data)) {
            maxVal = max(data, d => max(d.values.map(v => v.value)));
        } else {
            maxVal = max(data, d => d.value);
        }
        return maxVal;
    }

    static createBarChart(chart, props: Props, x, y, height): void {
        const { data, onClick } = props;

        function isHighlight(p: Props, key: number | string) {
            const { highlightData } = p;
            return highlightData && highlightData.indexOf(key) !== -1;
        }

        const colors = props.groupColors || {};
        function getColor(key: string) {
            if (!colors[key]) {
                colors[key] = colorPalette[Object.keys(colors).length] || '#000000';
            }
            return colors[key];
        }

        if (BarChart.isMultipleSourceData(data)) {
            const groupKeys = data[0].values.map(d => d.key);
            const x1 = scaleBand().padding(0.1);
            x1.domain(groupKeys).rangeRound([0, x.bandwidth()]);

            const group = chart.selectAll('.bar-group').data(data);
            group
                .enter()
                .append('g')
                .attr('class', 'bar-group')
                .attr('transform', d => `translate(${x(d.xAxis)},0)`);
            group.transition().attr('transform', d => `translate(${x(d.xAxis)},0)`);
            group.exit().remove();

            const bar = group
                .selectAll('.bar')
                .data(d => d.values.map(v => Object.assign({}, v, { group: d.key })));
            bar
                .enter()
                .append('rect')
                .attr(
                    'class',
                    d =>
                        isHighlight(props, d.group)
                            ? `bar highlight key-${d.key}`
                            : `bar key-${d.key}`,
                )
                .attr('x', d => x1(d.key))
                .attr('y', () => y(0))
                .attr('width', x1.bandwidth())
                .attr('height', () => height - y(0))
                .style('cursor', onClick ? 'pointer' : null)
                .style('fill', d => getColor(d.key));
            bar
                .transition()
                .duration(300)
                .attr(
                    'class',
                    d =>
                        isHighlight(props, d.group)
                            ? `bar highlight key-${d.key}`
                            : `bar key-${d.key}`,
                )
                .attr('x', d => x1(d.key))
                .attr('y', d => y(d.value))
                .attr('height', d => height - y(d.value))
                .attr('width', x1.bandwidth())
                .style('fill', d => getColor(d.key));

            bar.exit().remove();

            bar.on('click', (d) => {
                if (onClick) {
                    onClick(d.group, d.key);
                }
            });
        } else {
            // append the rectangles for the chart chart
            const a = chart.selectAll('.bar').data(data);
            a
                .enter()
                .append('rect')
                .style('cursor', onClick ? 'pointer' : null)
                .attr('y', y(0))
                .attr('height', height - y(0))
                .attr('class', d => (isHighlight(props, d.key) ? 'bar highlight' : 'bar'));
            a
                .transition()
                .duration(300)
                .attr('x', d => x(d.xAxis))
                .attr('width', x.bandwidth())
                .attr('y', d => y(d.value))
                .attr('height', d => height - y(d.value))
                .attr('class', d => (isHighlight(props, d.key) ? 'bar highlight' : 'bar'));
            a
                .exit()
                .transition()
                .duration(300)
                .attr('y', y(0))
                .attr('height', height - y(0))
                .remove();
            a.on('click', (d) => {
                if (onClick) {
                    onClick(d.key);
                }
            });
        }
    }

    static isMultipleSourceData(data) {
        return data && data.length > 0 && !!data[0].values;
    }

    render() {
        return (
            <div className="chart bart-chart" ref={node => (this.wrapper = node)}>
                <svg ref={node => (this.node = node)} />
                {this.props.title ? <div className="title">{this.props.title}</div> : null}
            </div>
        );
    }
}
