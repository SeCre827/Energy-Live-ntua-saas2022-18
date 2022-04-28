import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

// import HC_exporting from 'highcharts/modules/exporting';
// HC_exporting(Highcharts);

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
      text: 'My chart',
    },
    series: [
      {
        data: [1, 2, 1, 4, 3, 6, 123, 412, 5, 214, 123, 61, 123],
      },
    ],
  };

  return (
    <div>
      <HighchartsReact
        ref={chart}
        highcharts={Highcharts}
        //   constructorType={'stockChart'}
        options={options}
      />
    </div>
  );
};

export default Chart;

//   const options = {
//     title: {
//       text: 'My stock chart',
//     },
//     series: [
//       {
//         data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9],
//       },
//     ],
//   };
