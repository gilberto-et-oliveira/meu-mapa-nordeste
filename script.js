// 1. Configuração inicial
var map = L.map('map').setView([-9.66, -35.70], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 2. Configuração da Rota (Igual ao Google Maps)
var controlRotas = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    reverseWaypoints: true,
    showAlternatives: true,
    language: 'pt-BR',
    geocoder: L.Control.Geocoder.nominatim()
}).addTo(map);

// 3. FUNÇÃO MÁGICA: Clique com o botão direito para definir pontos
map.on('contextmenu', function(e) {
    var container = L.DomUtil.create('div'),
        startBtn = L.DomUtil.create('button', '', container),
        destBtn = L.DomUtil.create('button', '', container);

    startBtn.innerHTML = 'Partir daqui';
    destBtn.innerHTML = 'Ir para cá';

    L.DomEvent.on(startBtn, 'click', function() {
        controlRotas.spliceWaypoints(0, 1, e.latlng);
        map.closePopup();
    });

    L.DomEvent.on(destBtn, 'click', function() {
        var wps = controlRotas.getWaypoints();
        controlRotas.spliceWaypoints(wps.length - 1, 1, e.latlng);
        map.closePopup();
    });

    L.popup().setContent(container).setLatLng(e.latlng).openOn(map);
});

// 4. Carregar seus pontos do GeoJSON
fetch('pontos.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                layer.on('click', function(e) {
                    var coords = feature.geometry.coordinates;
                    var nome = feature.properties.nome || "Ponto";
                    
                    // Ao clicar no ponto, abre um popup com opções de rota
                    var container = L.DomUtil.create('div');
                    container.innerHTML = "<b>" + nome + "</b><br>";
                    
                    var btnDestino = L.DomUtil.create('button', '', container);
                    btnDestino.innerHTML = "Traçar rota para este ponto";
                    
                    L.DomEvent.on(btnDestino, 'click', function() {
                        var destino = L.latLng(coords[1], coords[0]);
                        var wps = controlRotas.getWaypoints();
                        controlRotas.spliceWaypoints(wps.length - 1, 1, destino);
                        map.closePopup();
                    });

                    layer.bindPopup(container).openPopup();
                });
            }
        }).addTo(map);
    });
