// utils
d3.selection.prototype.moveToFront = function() {  
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

// start
var assumption = 0.3;
var cost = 202500;  
function coordination_data() {
  return 'https://mapc-admin.carto.com/api/v2/sql?q=select%20to_date(split_part(year%2C%27-%27%2C1)%2C%20%27YYYY%27)%20AS%20year%2C%20SUM(annual_cost)%2F5%20AS%20%22Status%20Quo%22%2C%20SUM((annual_cost%2F5)%20-%20(' + cost + '%3A%3Aint%20*%20miles%20*%20' + assumption + '%20%2F%205))%20AS%20%22With%20Coordination%22%2C%20SUM(202500%3A%3Aint%20*%20miles%20*%20' + assumption + ')%20AS%20savings_5yr%20FROM%20%22mapc-admin%22.gas_leaks_coordination_raw_data%20GROUP%20BY%20year%20ORDER%20BY%20year&format=csv'
}

var chart = c3.generate({
    bindto: '#coordination',
    data: {
      x: 'year',
      type: 'spline',
      url: coordination_data(),
      hide: ['savings_5yr']
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
    grid: {
      x: {
        show: true 
      },
      y: {
        show: true
      }
    },
    legend: {
      hide: true
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
      load_total();
      
      // hack area spline
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

      // d3.select('.c3-lines-With-Coordination').moveToFront();  
    }
});

function load_total() {
  var savings = chart.data().filter(function(el) {
    return el.id == "savings_5yr";
  })[0];

  var total = savings.values.map(function(el) {
    return el.value;
  }).reduce(function(a, b) { return a + b; }, 0);

  d3.select('#total-saved')
    .transition()
    .duration(2000)
    .tween("text", function(d) {
      var i = d3.interpolate(0, total);
      return function(t) {
        d3.select(this).text("$" + d3.format('.2s')(i(t)));
      };
    });
}

$('#assumptions input').on('change', function() {
  var val = $('input[name="radio"]:checked', '#assumptions').val();
  assumption = val;

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

