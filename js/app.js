// This example creates a simple polygon representing the Bermuda Triangle.
  var triangleCoords = [];
  var trianguleTiendas = [];
  var map;
  var panorama;
  var idPolygono = 0;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: -17.7835488, lng: -63.1818958},
    mapTypeControl: false,
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    streetViewControl: false,
    enableCloseButton: false,
    scaleControl: true,
    rotateControl: true,
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
    }
  });
}

function rotate90() {
  var heading = map.getHeading() || 0;
  map.setHeading(heading + 90);
}

function autoRotate() {
  // Determine if we're showing aerial imagery.
  if (map.getTilt() !== 0) {
    window.setInterval(rotate90, 3000);
  }
}

function dibujar_distrito(){
  $.ajax({
    url : 'js/informacion/distritos.json',
    type : 'GET',
    dataType : 'json',
    success : function(json) {
      $.each(json.features[4].geometry.coordinates[0], function(index, val){
        triangleCoords.push({lat: val[1], lng: val[0]})
      })

        // Construct the polygon.
      var bermudaTriangle = new google.maps.Polygon({
          paths: triangleCoords,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FFF',
          fillOpacity: 0.35
        });
        bermudaTriangle.setMap(map);
      }
  });
}

function dibujar_tiendas(){
  $.ajax({
    url : 'js/informacion/data_tiendas.json',
    type : 'GET',
    dataType : 'json',
    success : function(json) {
      trianguleTiendas = [];
        $.each(json.JSONData3Result, function(index, val){
          var o = JSON.parse("["+val.Perimetro+"]");  
          trianguleTiendas = [];
          for (var i = 0; i < o.length; i++) {
            trianguleTiendas.push({lat: o[i][1], lng: o[i][0]})
          }
          if(val.DescripcionClasificacion.toLowerCase()==="tienda vacia"){
            var bermudaTriangle = new google.maps.Polygon({
            paths: trianguleTiendas,
            strokeColor: '#FFCE43',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FFCE43',
            fillOpacity: 0.35,
            id: val.IdSecuencial
          });

          google.maps.event.addListener(bermudaTriangle, 'click', function (event) {
            idPolygono = this.id;
            ver_streep_view(event.latLng);
          });

          }else{
              var bermudaTriangle = new google.maps.Polygon({
              paths: trianguleTiendas,
              strokeColor: '#159F5C',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#159F5C',
              fillOpacity: 0.35,
              id: val.IdSecuencial
            });

            google.maps.event.addListener(bermudaTriangle, 'click', function (event) {
              idPolygono = this.id;
              ver_streep_view(event.latLng);
            });
          }        
          bermudaTriangle.setMap(map);
        })
        
        }
    });
  }

  function informacion_basica(){
    buscar_tienda(idPolygono);
    $(document).ready(function(){
      $('#modal1').openModal();
    });
  }


  function buscar_tienda(idTienda){

    $.ajax({
    url : 'js/informacion/data_tiendas.json',
    type : 'GET',
    dataType : 'json',
    success : function(json) {
      limpiar();
        $.each(json.JSONData3Result, function(index, val){
          if (val.IdSecuencial === idTienda) {
            $( "#idAgua" ).append( val.Agua==="1"?"Si":"No" );
            $( "#idAlcantarillado" ).append( val.Alc==="1"?"Si":"No" );
            $( "#idGas" ).append( val.Gas==="1"?"Si":"No" );
            $( "#idLuz" ).append( val.Luz==="1"?"Si":"No" );
          }
        }) 
      }
    });
  }

  function ver_streep_view(coordenadas){
    // Set up the markers on the map
    console.log(coordenadas.lat() + " - " + coordenadas.lng());
    panorama = '';
    var astorPlace = {lat: coordenadas.lat(), lng: coordenadas.lng()};
    panorama = map.getStreetView();
    panorama.setPosition(astorPlace);
    panorama.setPov(({
      heading: 265,
      pitch: 0
    }));

    toggleStreetView();
  }

  function toggleStreetView() {
    var toggle = panorama.getVisible();
    if (toggle == false) {
      panorama.setVisible(true);
    } else {
      panorama.setVisible(false);
    }
  }

  function limpiar(){
    $( "#idAgua" ).empty();
    $( "#idAlcantarillado" ).empty();
    $( "#idGas" ).empty();
    $( "#idLuz" ).empty();
  }

    function pintar_streep_view(){
      var data_streep = [
            {lat:-17.750423732773115, lng:-63.15412133932114},
            {lat:-17.752081607635088, lng:-63.158155381679535},
            {lat:-17.752569515493942, lng:-63.15837800502777},
            {lat:-17.74854359724445, lng:-63.161505460739136},
            {lat:-17.745304404392435, lng:-63.16197752952576},
            {lat:-17.743516181339007, lng:-63.165754079818726},
            {lat:-17.733328078498158, lng:-63.163018226623535},
            {lat:-17.73021124122721, lng:-63.17255616188049},
            {lat:-17.727230918930534, lng:-63.172732589519114},
            {lat:-17.718315665745394, lng:-63.16112995147705},
            {lat:-17.71578111124778, lng:-63.144532442092896},
            {lat:-17.71524966785909, lng:-63.144575357437134},
            {lat:-17.731335352722944, lng:-63.15133452415466},
            {lat:-17.7327353726344, lng:-63.14041256904602}
          ];

      $.each(data_streep, function(index, val){
        // Adds a marker to the map.
          var marker = new google.maps.Marker({
            position: val,
            map: map
          });
      });
    }
  $(document).ready(function() {
    $( "#btn_distrito" ).click(function() {
      dibujar_distrito();
    });

    $( "#btn_tiendas" ).click(function() {
      dibujar_tiendas();
    });

    $("#btn_streep_view").click(function() {
      pintar_streep_view();
    });

    $("#btn_info_basica").click(function() {
      informacion_basica();
    });

    $("#btn_info_360").click(function() {
      if(map.getMapTypeId()==="satellite"){
        map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
      }
      else{
        map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
        map.setTilt(45);
        map.setHeading(90);
        autoRotate();
      }
    });
  });



