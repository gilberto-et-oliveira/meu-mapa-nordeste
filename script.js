var map = L.map('map').setView([-9.66, -35.70], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Criamos o controle de rota de forma simples
var controlRotas = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    language: 'pt-BR'
}).addTo(map);

function carregarPontos() {
    fetch('pontos.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    // Pegamos as coordenadas do GeoJSON [Long, Lat]
                    var coords = feature.geometry.coordinates;
                    var nome = feature.properties.nome || "Estabelecimento";
                    
                    // Criamos o botão passando Lat e Long corretamente
                    var btn = "<button onclick='tracarRota(" + coords[1] + "," + coords[0] + ")'>Ir para cá</button>";
                    layer.bindPopup("<b>" + nome + "</b><br>" + btn);
                }
            }).addTo(map);
        });
}

function tracarRota(lat, lng) {
    var waypointDestino = L.latLng(lat, lng);
    controlRotas.spliceWaypoints(controlRotas.getWaypoints().length - 1, 1, waypointDestino);
}

carregarPontos();
