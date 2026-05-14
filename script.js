// 1. Inicializa o mapa focado no Nordeste
var map = L.map('map').setView([-10.0, -40.0], 5);

// 2. Adiciona o mapa base (Google Maps)
L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

// 3. Controle de Rotas
var controlRotas = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    language: 'pt-BR',
    show: true
}).addTo(map);

// 4. Função para carregar as camadas
function carregarCamada(arquivo, estilo, popupColuna) {
    fetch(arquivo)
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: estilo,
                onEachFeature: function (feature, layer) {
                    // Texto do Popup baseado nas colunas que você passou
                    var conteudo = "<b>" + (feature.properties[popupColuna] || "Informação") + "</b>";
                    
                    // Se for a camada de pontos, adiciona o botão de rota
                    if (arquivo === 'pontos.geojson') {
                        conteudo += "<br>" + (feature.properties.endereço || "");
                        conteudo += "<br><br><button onclick='adicionarNaRota(" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ")'>Adicionar à Rota</button>";
                    }
                    
                    layer.bindPopup(conteudo);
                }
            }).addTo(map);
        });
}

// 5. Carrega os arquivos (Certifique-se de que os nomes no GitHub serão estes)
carregarCamada('estados.geojson', { color: "#333", weight: 2, fillOpacity: 0.1 }, 'NM_UF');
carregarCamada('municipios.geojson', { color: "#999", weight: 0.5, fillOpacity: 0 }, 'NM_MUN');
carregarCamada('pontos.geojson', {}, 'nome');

// 6. Função para criar a rota
function adicionarNaRota(lat, lng) {
    var atuais = controlRotas.getWaypoints();
    if (atuais[0] && atuais[0].latLng == null) {
        controlRotas.spliceWaypoints(0, 1, L.latLng(lat, lng));
    } else {
        controlRotas.spliceWaypoints(atuais.length, 0, L.latLng(lat, lng));
    }
}