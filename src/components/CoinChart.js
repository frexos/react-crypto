import React from 'react';
import { connect } from 'react-redux';
import { fetchCoinChart } from '../actions';
import { selectDuration } from '../actions';

import * as d3 from 'd3';



class CoinChart extends React.Component {

    componentDidMount() {
        this.props.fetchCoinChart(this.props.cid, this.props.duration);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.duration !== this.props.duration) {
            this.props.fetchCoinChart(this.props.cid, this.props.duration)
        }
    }

    render() {

        d3.select('#chart-container')
        .select('svg')
        .remove();
        d3.select('#chart-container')
        .select('.svg-container')
        .remove();
        d3.select('#chart-container')
        .select('.tooltip')
        .remove();

        const renderChart = (data, width, height) => {
            const margin = { top: 50, right: 50, bottom: 50, left: 50 };
            const yMinValue = d3.min(data, d => d.value);
            const yMaxValue = d3.max(data, d => d.value);
            const xMinValue = d3.min(data, d => d.label);
            const xMaxValue = d3.max(data, d => d.label);
            const svg = d3
            .select('#chart-container')
            .append("div")
            .classed("svg-container", true)
            .append('svg')
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .classed("svg-content-responsive", true)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            const tooltip = d3
            .select('#chart-container')
            .append('div')
            .attr('class', 'tooltip');

            const xScale = d3
            .scaleLinear()
            .domain([xMinValue, xMaxValue])
            .range([0, width]);
            const yScale = d3
            .scaleLinear()
            .range([height, 0])
            .domain([yMinValue, yMaxValue]);
            const line = d3
            .line()
            .x(d => xScale(d.label))
            .y(d => yScale(d.value))    
            .curve(d3.curveMonotoneX);

            svg
            .append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0,${height})`)
            .call(
                d3.axisBottom(xScale)
                .tickSize(-height)
                .tickFormat(''),
            );
            svg
            .append('g')
            .attr('class', 'grid')
            .call(
                d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat(''),
            );
            svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom().scale(xScale).tickSize(15));
            svg
            .append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));
            svg
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#45b4f5')
            .attr('stroke-width', 4)
            .attr('class', 'line') 
            .attr('d', line);

            const focus = svg
            .append('g')
            .attr('class', 'focus')
            .style('display', 'none');
            focus.append('circle').attr('r', 5).attr('class', 'circle');
            
            svg
            .append('rect')
            .attr('class', 'overlay')
            .attr('width', width)
            .attr('height', height)
            .style('opacity', 0)
            .on('mouseover', () => {
                focus.style('display', null);
            })
            .on('mouseout', () => {
                tooltip
                .transition()
                .duration(300)
                .style('opacity', 0);
            })
            .on('mousemove', mousemove);

            function mousemove(event) {
                const bisect = d3.bisector(d => d.label).left;
                const xPos = d3.pointer(event)[0];
                const x0 = bisect(data, xScale.invert(xPos));
                const d0 = data[x0];
                focus.attr(
                    'transform',
                    `translate(${xScale(d0.label)},${yScale(d0.value)})`,
                );

                tooltip
                    .transition()
                    .duration(300)
                    .style('opacity', 0.9);
                tooltip
                    .html(d0.tooltipContent || d0.label)
                    .style(
                        'transform',
                        `translate(${xScale(d0.label) - 30}px,${yScale(d0.value) - 600}px)`,
                    )
                    .style(
                        'height',
                        0,
                    );
            }

            tooltip
            .on('mouseover', function(d){
                tooltip.transition().style("opacity", "1");
            })
            .on('mouseout', function(d) {
                tooltip.transition().duration(1000).style("opacity", "0");
              });

        }

        const normalizeData = (data) => {
            if (!data) return null;

            let dataArr = [];
            data.map((d) => {
                let date = new Date(d[0]/1000).toString();

                dataArr.push({
                    label: d[0],
                    value: d[1],
                    tooltipContent: `$${d[1]}`
                })
            })

            return dataArr;
        }

        if (this.props.data.prices) {
            renderChart(normalizeData(this.props.data.prices), 1100, 500)
        }

        const durations = [
            {name: '24H', value: 1},
            {name: '14D', value: 14},
            {name: '1M', value: 30},
            {name: '3M', value: 90},
            {name: '1Y', value: 365},
            {name: 'ALL', value: 'max'},
        ]


        return (
            <div className="coin-chart">
                <div className="chart-controls">
                    {durations.map((d, index) => {
                        let selected = d.value === this.props.duration ? 'selected' : '';

                        return (
                            <button 
                                key={index}
                                onClick={() => {
                                    this.props.selectDuration(d.value)
                                }}
                                className={`duration-button ${selected}`}
                            >
                                {d.name}
                            </button>
                        )
                    })}
                </div>
                <div id="chart-container" className="chart-container"></div>
            </div>
        );

        
    }

}



const mapStateToProps = (state, ownProps) => {
    return {
            data: state.chartData,
            duration: state.chartDuration
        }
}

export default connect(mapStateToProps, { fetchCoinChart, selectDuration })(CoinChart);