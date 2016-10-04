var assumption = 0.3;
var cost = 202500;  
function coordination_data() {
  return 'https://mapc-admin.carto.com/api/v2/sql?q=select+to_date%28split_part%28year%2C%27-%27%2C1%29%2C+%27YYYY%27%29+AS+year%2C+SUM%28annual_cost%29%2F5+AS+%22Status+Quo%22%2C+SUM%28%28annual_cost%2F5%29+-+%28' + cost + '%3A%3Aint+%2A+miles+%2A+' + assumption + '+%2F+5%29%29+AS+%22With+Coordination%22+FROM+%22mapc-admin%22.gas_leaks_coordination_raw_data+GROUP+BY+year+ORDER+BY+year&format=csv'
}

var chart = c3.generate({
    bindto: '#coordination',
    data: {
      x: 'year',
      // type: 'spline',
      url: coordination_data()
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y',
          count: 30
        }
      },
      y: {
        tick: {
          format: function(d) {
            return "$" + d3.format('s')(d);
          }
        }
      }
    },
    legend: {
      position: 'inset',
      inset: {
        anchor: 'top-right'
      }
    },
    tooltip: {
      format: {
        value: function (value, ratio, id, index) { return "$" + d3.format('.2s')(value); }
      }
    },
    color: {
      pattern: ['#e2543d', '#189a8c']
    },
    onrendered: function() {
      // hack area spline
      // var path = d3.select('.c3-area-With-Coordination');
      //     path.attr('style', 'fill: rgb(255, 255, 255); opacity: 1');
      // animate line
      if (!this.renderedOnce) {
        var path = d3.selectAll('.c3-line'); 
        var totalLength = path.node().getTotalLength(); 
        path.attr("stroke-dasharray", totalLength + " " + totalLength) 
                .attr("stroke-dashoffset", totalLength)
                .transition() 
                .duration(2300) 
                .ease("linear") 
                .attr("stroke-dashoffset", 0);
      } else {
        var path = d3.selectAll('.c3-line'); 
        var totalLength = path.node().getTotalLength(); 
        path.attr("stroke-dasharray", totalLength + " " + totalLength) 
                .attr("stroke-dashoffset", totalLength)
                .attr("stroke-dashoffset", 0);
      }
      this.renderedOnce = true;

    }
});

$('#assumptions input').on('change', function() {
  var val = $('input[name="radio"]:checked', '#assumptions').val();
  assumption = val;
  console.log(coordination_data());
  chart.load({
          url: coordination_data()
  });

})

// var emitter_data = ""

// var chart = c3.generate({
//     bindto: '#coordination',
//     data: {
//       // x: 'year',
//       // type: 'spline',
//       url: emitter_data
//     }
// });

