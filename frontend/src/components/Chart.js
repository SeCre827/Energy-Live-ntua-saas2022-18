import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsAccessibility from "highcharts/modules/accessibility";
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

// import HC_exporting from 'highcharts/modules/exporting';
// HC_exporting(Highcharts);

highchartsAccessibility(Highcharts);

const Chart = (props) => {
  const chart = useRef();

  useEffect(() => {
    props.giveRef(chart);
  }, [props, chart]);

  const options = {
    chart: {
      type: 'spline',
    },
    title: {
      text: 'Results',
    },
    turboThreshold: 0,
    series: [
      {
        turboThreshold: 5000,
        marker: {
          enabled: false
        },
        name: "value",
        data: props.chartData ? props.chartData : [],
      },
    ]
  };

  return (
    <div>
    {props.chartData ? (
      <HighchartsReact
        ref={chart}
        highcharts={Highcharts}
        //   constructorType={'stockChart'}
        options={options}
      />
     ) : (
      <h2>No data found</h2>
    )
  }
  </div>
  );
};

export default Chart;
