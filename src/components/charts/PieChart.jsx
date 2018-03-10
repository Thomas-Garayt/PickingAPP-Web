// @flow

import React from 'react';
import { interpolate } from 'd3-interpolate';
import { arc, pie } from 'd3-shape';
import { select, event } from 'd3-selection';
import { transition } from 'd3-transition';

type Data = { key: number | string, label: string, value: number | string };
type Props = {
    title?: string,
    data: Array<Data>,

    // The keys of the data to highlight
    highlightData?: Array<number | string>,

    onClick: (key: number | string) => void,
};
type State = {};

const colorPalette = ['#faae31', '#1e2942', '#4a6dbe', '#a5a5a5', '#d0d0d0', '#d0743c', '#ff8c00'];

export default class PieChart extends React.Component<void, Props, State> {
    state: State;
    wrapper: *;
    node: *;

    tooltip: *;
    pie: *;

    colors: { [key: number | string]: string };

    width: number;
    height: number;

    constructor() {
        super();
        this.colors = {};
    }

    componentDidMount() {
        this.initChart();
        this.createBarChart(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.updateSize();
        this.createBarChart(nextProps);
    }

    shouldComponentUpdate() {
        return false;
    }

    updateSize() {
        const width = this.wrapper.clientWidth;
        const height = this.wrapper.clientHeight;
        this.width = width;
        this.height = height;

        const svg = select(this.node);
        svg.attr('width', width).attr('height', height);
        svg.select('.pie').attr('transform', `translate(${width / 2},${height / 2})`);
        svg
            .selectAll('.legend')
            .attr(
                'transform',
                (d, i) => `translate(${width / 2 + this.getRadius()},${i * 15 + 20})`,
            );
    }

    componentWillUnmount() {
        if (this.tooltip) {
            this.tooltip.remove();
        }
    }

    initChart = () => {
        this.width = this.wrapper.clientWidth;
        this.height = this.wrapper.clientHeight;

        const { width, height } = this;

        // Pie
        const svg = select(this.node);
        this.pie = svg
            .append('g')
            .attr('class', 'pie')
            .attr('transform', `translate(${width / 2},${height / 2})`);

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

    getColor = (key: string) => {
        const colors = this.colors;
        if (!colors[key]) {
            colors[key] = colorPalette[Object.keys(colors).length] || '#000000';
        }
        return colors[key];
    };

    getRadius = () => Math.min(this.width, this.height) / 2;

    isHighlight = (props: Props, key: number | string) => {
        const { highlightData } = props;
        return highlightData && highlightData.indexOf(key) !== -1;
    };

    createBarChart = (props: Props) => {
        const { width } = this;
        const { data } = props;

        const svg = select(this.node);

        const p = pie()
            .sort(null)
            .value(d => d.value)(data);

        const radius = this.getRadius();
        const mArc = arc()
            .outerRadius(radius - 5)
            .innerRadius(0);
        const mArcHover = arc()
            .innerRadius(0)
            .outerRadius(radius);

        const a = this.pie.selectAll('path').data(p);

        a
            .enter()
            .append('path')
            .attr('d', mArc)
            .attr('fill', d => this.getColor(d.data.key))
            .style('cursor', this.props.onClick ? 'pointer' : null)
            .attr(
                'class',
                d => (this.isHighlight(props, d.data.key) ? 'section highlight' : 'section'),
            )
            .each(function (d) {
                this._current = d;
            });

        a
            .transition()
            .attr('fill', d => this.getColor(d.data.key))
            .attrTween('d', function (ac) {
                const i = interpolate(this._current, ac);
                this._current = i(0);
                return function (t) {
                    return mArc(i(t));
                };
            })
            .attr(
                'class',
                d => (this.isHighlight(props, d.data.key) ? 'section highlight' : 'section'),
            );

        a.exit().remove();

        // Add Legend
        const legendG = svg.selectAll('.legend').data(p);
        const enterLegendG = legendG
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(${width / 2 + radius},${i * 15 + 20})`);
        enterLegendG
            .append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', d => this.getColor(d.data.key))
            .style('cursor', this.props.onClick ? 'pointer' : null);
        enterLegendG
            .append('text')
            .text(d => d.data.label)
            .style('font-size', 12)
            .style('cursor', 'pointer')
            .attr('font-weight', d => (this.isHighlight(props, d.data.key) ? 'bold' : null))
            .attr('y', 10)
            .attr('x', 12);

        legendG
            .transition()
            .select('rect')
            .attr('fill', d => this.getColor(d.data.key));
        legendG
            .transition()
            .select('text')
            .attr('font-weight', d => (this.isHighlight(props, d.data.key) ? 'bold' : null))
            .text(d => d.data.label);

        legendG.exit().remove();

        // Handle Click
        legendG.on('click', (d) => {
            if (this.props.onClick) {
                this.props.onClick(d.data.key);
            }
        });
        a.on('click', (d) => {
            if (this.props.onClick) {
                this.props.onClick(d.data.key);
            }
        });

        // Add Tooltip
        const tooltip = this.tooltip;

        a.on('mousemove', (d) => {
            // Tooltip
            tooltip.style('left', `${event.pageX + 10}px`);
            tooltip.style('top', `${event.pageY - 25}px`);
            tooltip.style('display', 'inline-block');
            tooltip.html(`${d.data.label}<br>${d.data.value}`);
        });
        a.on('mouseover', function () {
            // Hover
            select(this)
                .transition()
                .duration(200)
                .attr('d', mArcHover);
        });
        a.on('mouseout', function () {
            // Tooltip
            tooltip.style('display', 'none');

            // Hover
            select(this)
                .transition()
                .duration(200)
                .attr('d', mArc);
        });
    };

    render() {
        return (
            <div className="chart pie-chart" ref={node => (this.wrapper = node)}>
                <svg ref={node => (this.node = node)} />
                {this.props.title ? <div className="title">{this.props.title}</div> : null}
            </div>
        );
    }
}
