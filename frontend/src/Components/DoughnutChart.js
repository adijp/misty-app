import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

class DoughnutChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    let data = [9, 5, 3]
    let labels = ["Newly Added", "Edited", "Deleted"]
    
    let customLabels = labels.map((label,index) =>`${label}: ${data[index]}`)

    const chartdata = {
      labels: customLabels,
      datasets: [
        {
          label: "Markets Monitored",
          backgroundColor: [
            "#83ce83",
            "#959595",
            "#f96a5d",
            "#00A6B4",
            "#6800B4",
          ],
          data: data,
        },
      ],
    };
    return (
      <Doughnut
        data={chartdata}
        options={{
          legend: { display: true, position: "right" },

          datalabels: {
            display: true,
            color: "white",
          },
          tooltips: {
            backgroundColor: "#5a6e7f",
          },
        }}
      />
    );
  }
}

export default DoughnutChart;