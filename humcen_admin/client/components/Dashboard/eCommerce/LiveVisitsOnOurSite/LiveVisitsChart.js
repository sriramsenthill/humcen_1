import React, { Component } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

class LiveVisitsChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [70, 20, 10],
      options: {
        chart: {
          type: "donut",
        },
        labels: ["Success", "In Progress", "Delayed"],
        colors: ["#27AE60", "#FFB638", "#F14242"],
        legend: {
          offsetY: 2,
          position: "bottom",
          horizontalAlign: "center",
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        dataLabels: {
          enabled: false,
        },
      },
    };
  }

  render() {
    return (
      <>
        <Chart
          options={this.state.options}
          series={this.state.series}
          height="315"
          type="donut"
        />
      </>
    );
  }
}

export default LiveVisitsChart;
