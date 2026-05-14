// 1. Inicializa o mapa focado no Nordeste
var map = L.map('map').setView([-10.0, -40.0], 5);

// 2. Adiciona o mapa base (Google Maps)
L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

// 3. Controle de Rotas (Versão simplificada e estável)
var controlRotas = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    language: 'pt-BR',
    show: true
}).addTo(map);

// 4. Função para carregar as camadas
function carregarCamada(arquivo, estilo, popupColuna) {
    fetch(arquivo)
        .then(response => {
            if (!response.ok) throw new Error("Erro ao carregar " + arquivo);
            return response.json();
        })
        .then(data => {
            L.geoJSON(data, {
                style: estilo,
                onEachFeature: function (feature, layer) {
                    var nome = feature.properties[popupColuna] || "Informação";
                    var conteudo = "<b>" + nome + "</b>";
                    
                    if (arquivo === 'pontos.geojson') {
                        var endereco = feature.properties.endereço || "";
                        conteudo += "<br>" + endereco;
                        // O botão chama a função de rota
                        conteudo += "<br><br><button onclick='adicionarNaRota(" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ")'>Adicionar à Rota</button>";
                    }
                    
                    layer.bindPopup(conteudo);
                }
            }).addTo(map);
        })
        .catch(err => console.error(err));
}

// 5. Carrega os arquivos
// carregarCamada('estados.geojson', { color: "#333", weight: 2, fillOpacity: 0.1 }, 'NM_UF');
//carregarCamada('municipios.geojson', { color: "#999", weight: 0.5, fillOpacity: 0 }, 'NM_MUN');
carregarCamada('pontos.geojson', {}, 'nome');

// 6. Função para criar a rota
function adicionarNaRota(lat, lng) {
    var atuais = controlRotas.getWaypoints();
    var novoPonto = L.latLng(lat, lng);

    if (!atuais[0] || atuais[0].latLng == null) {
        controlRotas.spliceWaypoints(0, 1, novoPonto);
    } else {
        controlRotas.spliceWaypoints(atuais.length, 0, novoPonto);
    }
    controlRotas.show();
}
