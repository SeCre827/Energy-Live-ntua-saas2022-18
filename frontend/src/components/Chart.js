import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import chartdata from "./chartdata.json";
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

// import HC_exporting from 'highcharts/modules/exporting';
// HC_exporting(Highcharts);

const Chart = (props) => {
  const chart = useRef();

  console.log("chart", props.chartData)

  const finaldata = props.chartData ? props.chartData.data.map((row) => [row.timestamp, parseFloat(row.value)]) : [];

  useEffect(() => {
    props.giveRef(chart);
  }, [props, chart]);

  const options = {
    chart: {
      type: 'spline',
    },
    title: {
      text: 'My chart',
    },
    series: [
      {
        data: finaldata,
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
