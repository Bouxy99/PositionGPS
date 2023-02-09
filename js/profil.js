// function de création du profil plotly
let list_alti = [];
let list_dist = [];
let dist = 0;
// profil du terrain
var mnt = {
  x: list_dist,
  y: list_alti,
  mode: 'lines+markers',
  line: {
    color: 'rgb(80, 173, 81)',
    width: 2
  },
  marker: {
    size: 4,
  },
  fill: 'tozeroy',
};

var data = [mnt];

// mise en page du graph
var layout = {
  //title: {
    //text: 'Profil',
    //font: {
      //size: 18,
      //color: 'rgb(0, 0, 0)',
    //}
  //},
  showlegend: false,
  xaxis: {
    title: 'Distance [m]',
    showgrid: false,
    zeroline: false
  },
  yaxis: {
    title: 'Altitude [m]',
    showline: false,
    range: [Math.min(...list_alti)-10, Math.max(...list_alti)+3]
  }
};

Plotly.newPlot('profil', data, layout);