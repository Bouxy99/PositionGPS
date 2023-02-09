// définir l'objet geolocalisation de OL
const geolocation = new ol.Geolocation({
  // enableHighAccuracy must be set to true to have the heading value.
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: view.getProjection(),
});

let coordinates = '';

// activer/désactiver la position lors du chamgement du boutton
let position = false;
function togglePosition(button) {
  if (button.checked) {
    geolocation.setTracking(true);
    first_position = true;
    position = true;
    $('#button_addStation').removeClass("btn-secondary");
    $('#button_addStation').addClass("btn-success");
    map.getView().setZoom(19);
  } else {
    geolocation.setTracking(false);
  }
}

// activer/désactiver la liaison position GPS/carte
let link_map = false;
let first_position = true;
function toggleLink(button) {
  if (button.checked) {
    link_map = true;
    first_position = true;
  } else {
    link_map = false;
  }
}

// activer/désactiver la génération du profil
let generate_profil = true;
function toggleProfil(button) {
  if (button.checked) {
    generate_profil = true;
  } else {
    generate_profil = false;
  }
}

// activer/désactiver la prise en compte de la précision pour la génération du profil
let profil_with_gps_precision = false;
function toggleProfilPrecision(button) {
  if (button.checked) {
    profil_with_gps_precision = true;
  } else {
    profil_with_gps_precision = false;
  }
}

// changer les valeurs du tableau lorsqu'elles changent
geolocation.on('change', function () {
  coordinates = geolocation.getPosition();
  var date = new Date(Date.now());
  lon_lat = ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
  est_nord = ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:2056');
  alti_txt = function(){try {val = geolocation.getAltitude().toFixed(1) + ' msm';} catch {val = '-'} return val}
  $('#lat_long').text(lon_lat[1].toFixed(7) + ', ' + lon_lat[0].toFixed(7));
  $('#est_nord').text(est_nord[0].toFixed(3) + ', ' + est_nord[1].toFixed(3));
  $('#alti').text(alti_txt);
  $('#vit').text(function(){try {val = geolocation.getSpeed().toFixed(1) + ' m/s   |   ' + (geolocation.getSpeed()*3.6).toFixed(1) + ' km/h';} catch {val = '-'} return val});
  $('#prec_plani').text(geolocation.getAccuracy().toFixed(1) + ' m');
  $('#prec_alti').text(function(){try {val = geolocation.getAltitudeAccuracy().toFixed(1) + ' m';} catch {val = '-'} return val});
  $('#maj').text(date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());

  // mettre à jour le profil alti
  if (generate_profil === true) {
    updateProfil(est_nord[0],est_nord[1])
  }
});

// changer la position du point et le centrage de la carte
geolocation.on('change:position', function () {
  coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
  if (link_map || first_position) {
    map.getView().setCenter(coordinates);
    first_position = false;
  }
});

// changer la geometrie de la qualité 2D
geolocation.on('change:accuracyGeometry', function () {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

// fonction de mise à jour du profil
let e_old = 0;
let n_old = 0;
let dist_old = 0;
function updateProfil(est,nord) {
  add_dist = ((est-e_old)**2 + (nord-n_old)**2)**0.5;
  if (e_old == 0) {
    list_dist.push(dist);
    list_alti.push(geolocation.getAltitude());
    e_old = est_nord[0];
    n_old = est_nord[1];
    dist_old = dist
  } else if (profil_with_gps_precision === false) {
    dist = dist + add_dist;
    list_dist.push(dist);
    list_alti.push(geolocation.getAltitude());
    e_old = est_nord[0];
    n_old = est_nord[1];
    dist_old = dist
  } else if (add_dist > geolocation.getAccuracy()) {
    dist = dist + add_dist;
    list_dist.push(dist);
    list_alti.push(geolocation.getAltitude());
    e_old = est_nord[0];
    n_old = est_nord[1];
    dist_old = dist
  }
  Plotly.redraw('profil');
  Plotly.relayout('profil', 'yaxis.range', [Math.min(...list_alti)-10, Math.max(...list_alti)+3])

}