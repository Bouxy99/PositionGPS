const view = new ol.View({
    center: [0, 0],
    zoom: 2,
  });

  const positionFeature = new ol.Feature();
  positionFeature.setStyle(
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
          color: '#3399CC',
        }),
        stroke: new ol.style.Stroke({
          color: '#fff',
          width: 2,
        }),
      }),
    })
  );

  const accuracyFeature = new ol.Feature();

  // couche des points enregistrés
  const style_points = new ol.style.Style({
    image: new ol.style.RegularShape({
      fill: new ol.style.Fill({color: 'rgba(255, 255, 255, 0.9)'}),
      stroke: new ol.style.Stroke({color: 'rgba(255, 0, 0, 1)', width: 1.5}),
      points: 3,
      radius: 10,
    }),
  });
  const points = new ol.layer.Vector({
    style: style_points,
    visible: true,
    zIndex: 3
  });
  const pointsSource = new ol.source.Vector({
  });

const map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),points
  ],
  target: 'map',
  view: view,
});

new ol.layer.Vector({
  map: map,
  source: new ol.source.Vector({
    features: [accuracyFeature, positionFeature],
  }),
});

// definition de la projection suisse
proj4.defs(
    "EPSG:2056",
    "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs"
    );
  ol.proj.proj4.register(proj4);