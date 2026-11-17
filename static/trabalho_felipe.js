
const cartas = [
    { nome: "Gustavo Dancepot", imagem: "gustavodancepot.mp4", raridade: "DANCE POTRANCA", classe: "dance-potranca", chanceBase: 0.135, preco: 64.80 },
    { nome: "Elefante Africano", imagem: "elefantebe.jpg", raridade: "TRANSFICANO", classe: "transficano", chanceBase: 0.45, preco: 13.50 },
    { nome: "Gustavo Tartarugas Ninjas", imagem: "gustavo tartarugas ninjas.jpg", raridade: "SECRETA", classe: "secreta", chanceBase: 0.225, preco: 54.00 },
    { nome: "Muryllo Apanhando", imagem: "muryllo_caindo.mp4", raridade: "ULTRA RARA", classe: "ultra-rara", chanceBase: 0.675, preco: 27.00 },
    { nome: "Muryllo Skibidi", imagem: "muryllo skibidi.jpg", raridade: "EPICA", classe: "epica", chanceBase: 0.90, preco: 13.50 },
    { nome: "O Inicio", imagem: "O inicio.jpg", raridade: "PRIMORDIAL", classe: "primordial", chanceBase: 0.36, preco: 43.20 },
    { nome: "Resenha Call", imagem: "resenha call.jpg", raridade: "LENDARIA", classe: "lendaria", chanceBase: 0.45, preco: 43.20 },
    { nome: "Xorume Muryllo", imagem: "xorume muryllo.jpg", raridade: "NOJO", classe: "nojo", chanceBase: 1.35, preco: 8.10 },
    { nome: "Juliano", imagem: "juliano.jpg", raridade: "ESPECIAL HEXA", classe: "especial-hexa", chanceBase: 0.18, preco: 54.00 },
    { nome: "Felipe", imagem: "felipe.jpg", raridade: "ESPECIAL HEXA", classe: "especial-hexa", chanceBase: 0.18, preco: 54.00 },
    { nome: "Daniel", imagem: "daniel.jpg", raridade: "ESPECIAL HEXA", classe: "especial-hexa", chanceBase: 0.18, preco: 54.00 },
    { nome: "Muryllo Pé de Mesa", imagem: "muryllo pé de mesa.mp4", raridade: "U DE UCRÂNIA", classe: "u-de-ucrania", chanceBase: 0.006, preco: 75.00 },
    { nome: "Amanda (Resenha)", imagem: "amanda.res.jpg", raridade: "THE LAST RESENHA", classe: "the-last-resenha", chanceBase: 0.006, preco: 60.00 },
    { nome: "Felipe (Resenha)", imagem: "felipe.res.jpg", raridade: "THE LAST RESENHA", classe: "the-last-resenha", chanceBase: 0.006, preco: 60.00 },
    { nome: "Gustavo (Resenha)", imagem: "gustavo.res.jpg", raridade: "THE LAST RESENHA", classe: "the-last-resenha", chanceBase: 0.006, preco: 60.00 },
    { nome: "Kayla (Resenha)", imagem: "kayla.res.jpg", raridade: "THE LAST RESENHA", classe: "the-last-resenha", chanceBase: 0.006, preco: 60.00 },
    { nome: "Luis (Resenha)", imagem: "luis.res.jpg", raridade: "THE LAST RESENHA", classe: "the-last-resenha", chanceBase: 0.006, preco: 60.00 },
    { nome: "Marcos (Resenha)", imagem: "marcos.res.jpg", raridade: "THE LAST RESENHA", classe: "the-last-resenha", chanceBase: 0.006, preco: 60.00 },
    { nome: "Miguel (Resenha)", imagem: "miguel.res.jpg", raridade: "THE LAST RESENHA", classe: "the-last-resenha", chanceBase: 0.006, preco: 60.00 },
    { nome: "Muryllo (Resenha)", imagem: "muryllo.res.jpg", raridade: "THE LAST RESENHA", classe: "the-last-resenha", chanceBase: 0.006, preco: 60.00 }
];

let dinheiro = 200.00;
let colecaoGlobal = {};
let cartasBloqueadas = {};
let valoresCartas = {};

let jogoTravado = false;
let cartasGeradas = [];

let roletaEmAndamento = false;

let pacoteSelecionado = {
    custo: 5.00,
    multiplicador: 1.0,
    nome: "Comum"
};


// ==============================
// LOGIN
// ==============================

function fazerLogin() {
    let usuario = document.getElementById("input-usuario").value;
    let senha = document.getElementById("input-senha").value;

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: usuario, senha })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            dinheiro = Number(data.dinheiro);
            colecaoGlobal = data.colecao || {};
            cartasBloqueadas = data.bloqueadas || {};
            valoresCartas = data.valoresCartas || {};

            document.getElementById("nome-usuario-logado").textContent = usuario;
            document.getElementById("tela-login").style.display = "none";
            document.getElementById("conteudo-jogo").style.display = "block";

            criarRoleta();
            atualizarOpcoesRoleta();
            atualizarContadorVisual(0, 0);

            document.getElementById("resultado").textContent =
                "Selecione um booster e pressione Espaço para começar!";
        } else {
            document.getElementById("erro-login").textContent = data.mensagem;
        }
    })
    .catch(() => {
        document.getElementById("erro-login").textContent =
            "Não foi possível conectar ao servidor.";
    });
}


// ==============================
// SALVAR ESTADO
// ==============================

function salvarEstado() {
    fetch('/api/salvar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            dinheiro: dinheiro,
            colecao: colecaoGlobal,
            bloqueadas: cartasBloqueadas,
            valoresCartas: valoresCartas
        })
    });
}


// ==============================
// VALOR DAS CARTAS
// ==============================

function obterPrecoBase(nome) {
    if (nome === "CARTA PAIA") return 1.50;
    if (nome === "⭐ CARTA PAIA (Shiny)") return 15.00;

    let encontrada = cartas.find(c =>
        c.nome === nome ||
        "⭐ " + c.nome + " (Shiny)" === nome
    );

    if (!encontrada) return 1.50;

    return encontrada.preco * (nome.includes("Shiny") ? 10 : 1);
}

function obterMultiplicador(nome) {
    return Number(valoresCartas[nome]) || 1;
}

function obterPrecoAtual(nome) {
    return obterPrecoBase(nome) * obterMultiplicador(nome);
}


// ==============================
// ÁUDIO
// ==============================

function tocarAudioCarta(carta) {
    if (carta.imagem === "gustavodancepot.mp4") {
        new Audio('/static/dancepotranca.mp3').play().catch(e => {});
    } else if (carta.imagem === "gustavo tartarugas ninjas.jpg") {
        new Audio('/static/tartarugas ninjas.mp3').play().catch(e => {});
    } else if (carta.imagem === "muryllo pé de mesa.mp4") {
        new Audio('/static/muryllo car cur.mp3').play().catch(e => {});
    } else if (carta.classe === "the-last-resenha") {
        new Audio('/static/army-of-lovers-crucified.mp3').play().catch(e => {});
    }
}


// ==============================
// BOOSTERS
// ==============================

function selecionarBooster(custo, multiplicador, nome, elemento) {
    pacoteSelecionado = { custo, multiplicador, nome };

    document.querySelectorAll('.card-loja').forEach(card =>
        card.classList.remove('selecionado')
    );

    elemento.classList.add('selecionado');

    document.getElementById("resultado").textContent =
        `Pacote ${nome} selecionado! Pressione Espaço para comprar.`;
}

function sortearCarta(multiplicador) {
    let numero = Math.random() * 100;
    let acumulado = 0;
    let cartaSorteada = null;

    for (let carta of cartas) {
        let chanceEfetiva = carta.chanceBase * multiplicador;
        acumulado += chanceEfetiva;

        if (numero < acumulado) {
            cartaSorteada = { ...carta };
            break;
        }
    }

    if (!cartaSorteada) {
        let chanceArmadilha = 0.3 * multiplicador;

        if (Math.random() * 100 < chanceArmadilha) {
            cartaSorteada = {
                nome: "PERDEU OTARIO!",
                tipo: "armadilha",
                preco: 0,
                raridade: "ARMADILHA",
                classe: "armadilha"
            };
        } else {
            cartaSorteada = {
                nome: "CARTA PAIA",
                tipo: "comum",
                preco: 1.50,
                raridade: "PAIA",
                classe: "comum"
            };
        }
    }

    let chanceShinyBase = 0.15;
    let chanceShinyEfetiva = chanceShinyBase * multiplicador;
    let sorteioShiny = Math.random() * 100;

    if (sorteioShiny < chanceShinyEfetiva && !cartaSorteada.tipo) {
        cartaSorteada.isShiny = true;
        cartaSorteada.nomeOriginal = cartaSorteada.nome;
        cartaSorteada.nome = "⭐ " + cartaSorteada.nomeOriginal + " (Shiny)";
        cartaSorteada.preco = cartaSorteada.preco * 10;
        cartaSorteada.raridade = "SHINY " + cartaSorteada.raridade;
    }

    return cartaSorteada;
}

function atualizarContadorVisual(reveladas, especiais) {
    document.getElementById("contador-abertas").textContent = `${reveladas}/7`;
    document.getElementById("contador-especiais").textContent = especiais;
    document.getElementById("saldo-jogador").textContent =
        `R$ ${dinheiro.toFixed(2)}`;
}

function revelarCartaNoElemento(div, carta) {
    if (div.dataset.aberta === "sim") return;

    div.dataset.aberta = "sim";

    colecaoGlobal[carta.nome] = (colecaoGlobal[carta.nome] || 0) + 1;

    if (carta.raridade && carta.tipo !== "armadilha" &&
        carta.raridade !== "PAIA" && carta.raridade !== "SHINY PAIA") {

        div.classList.add(carta.classe);

        if (carta.isShiny) div.classList.add("shiny");

        if (carta.imagem && carta.imagem.endsWith('.mp4')) {
            div.innerHTML = `
                <video src="/static/${encodeURIComponent(carta.imagem)}"
                autoplay loop muted
                style="width:100%;height:65%;object-fit:contain;background:#000;border-radius:4px;">
                </video>
                <strong style="font-size:11px;display:block;margin-top:4px;">${carta.nome}</strong>
                <small style="font-size:9px;">${carta.raridade}</small>
            `;
        } else if (carta.imagem) {
            div.innerHTML = `
                <img src="/static/${encodeURIComponent(carta.imagem)}"
                style="width:100%;height:65%;object-fit:contain;background:#000;border-radius:4px;">
                <strong style="font-size:11px;display:block;margin-top:4px;">${carta.nome}</strong>
                <small style="font-size:9px;">${carta.raridade}</small>
            `;
        }

        tocarAudioCarta(carta);

    } else if (carta.tipo === "armadilha") {
        div.classList.add("armadilha");

        dinheiro = Math.max(0, dinheiro - 67.00);

        div.innerHTML = `<strong>PERDEU!</strong><small>R$ 67,00 ROUBADO!</small>`;

        new Audio('/static/perdeu.mp3').play().catch(e => {});

        jogoTravado = true;

        document.getElementById("resultado").textContent =
            "Tirou a armadilha! Perdeu R$ 67,00 do seu saldo.";

    } else {
        div.classList.add("comum");

        if (carta.isShiny) div.classList.add("shiny");

        div.innerHTML = `
            <div class="verso" style="font-size:50px;margin-bottom:auto;margin-top:auto;">PAIA</div>
            <div style="width:100%;">
                <strong>${carta.nome}</strong>
                <small>${carta.raridade}</small>
            </div>
        `;
    }

    salvarEstado();
    atualizarOpcoesRoleta();
    verificarFimDoBooster();
}

function comprarBooster(custo, multiplicador) {
    if (dinheiro < custo) {
        document.getElementById("resultado").textContent =
            `Não tens dinheiro suficiente (Custo: R$ ${custo.toFixed(2)})!`;
        return;
    }

    dinheiro -= custo;
    salvarEstado();

    const area = document.getElementById("cartas");

    area.innerHTML = "";
    cartasGeradas = [];
    jogoTravado = false;

    document.getElementById("resultado").textContent =
        "Revele as suas 7 cartas!";

    atualizarContadorVisual(0, 0);

    for (let i = 0; i < 7; i++) {
        let carta = sortearCarta(multiplicador);
        cartasGeradas.push(carta);

        let div = document.createElement("div");

        div.className = "carta";
        div.innerHTML = `
            <div class="verso">?</div>
            <div class="texto-verso">CARTA ${i + 1}</div>
        `;

        div.onclick = function () {
            if (jogoTravado || div.dataset.aberta) return;
            revelarCartaNoElemento(div, carta);
        };

        area.appendChild(div);
    }
}

function verificarFimDoBooster() {
    const divsCartas = document.querySelectorAll(".carta");

    let reveladas = 0;
    let especiais = 0;

    divsCartas.forEach(d => {
        if (d.dataset.aberta === "sim") {
            reveladas++;

            if (!d.classList.contains("comum") &&
                !d.classList.contains("armadilha")) {
                especiais++;
            }
        }
    });

    atualizarContadorVisual(reveladas, especiais);

    if (reveladas === 7 && !jogoTravado) {
        document.getElementById("resultado").textContent =
            `Booster finalizado! Conseguiu ${especiais} especial(is)! Pressione Espaço.`;
    }
}


// ==============================
// ÁLBUM
// ==============================

function abrirAlbum() {
    const modal = document.getElementById("modal-album");
    const grid = document.getElementById("grid-album");

    grid.innerHTML = "";

    let listaCompletaAlbum = [];

    cartas.forEach(c => {
        listaCompletaAlbum.push({ ...c });

        listaCompletaAlbum.push({
            ...c,
            nome: "⭐ " + c.nome + " (Shiny)",
            preco: c.preco * 10,
            isShiny: true,
            raridade: "SHINY " + c.raridade
        });
    });

    listaCompletaAlbum.push({
        nome: "CARTA PAIA",
        raridade: "PAIA",
        preco: 1.50,
        classe: "comum"
    });

    listaCompletaAlbum.push({
        nome: "⭐ CARTA PAIA (Shiny)",
        raridade: "SHINY PAIA",
        preco: 15.00,
        classe: "comum",
        isShiny: true
    });

    listaCompletaAlbum.forEach(carta => {
        let qtd = colecaoGlobal[carta.nome] || 0;

        let itemDiv = document.createElement("div");

        let bloqueada = cartasBloqueadas[carta.nome] || false;
        let precoAtual = obterPrecoAtual(carta.nome);

        if (qtd > 0) {
            itemDiv.className = "item-album";

            if (carta.classe) itemDiv.classList.add(carta.classe);
            if (carta.isShiny) itemDiv.classList.add("shiny");
            if (bloqueada) itemDiv.classList.add("bloqueado-carta");

            let mediaHtml = carta.imagem && carta.imagem.endsWith('.mp4')
                ? `<video src="/static/${encodeURIComponent(carta.imagem)}" autoplay loop muted style="width:100%;height:75px;object-fit:contain;background:#000;border-radius:4px;"></video>`
                : (carta.imagem
                    ? `<img src="/static/${encodeURIComponent(carta.imagem)}" style="width:100%;height:75px;object-fit:contain;background:#000;border-radius:4px;">`
                    : `<div class="silueta" style="font-size:18px;color:#aaa;">PAIA</div>`);

            let previewDiv = document.createElement("div");

            previewDiv.style.cursor = "pointer";

            previewDiv.innerHTML = `
                ${mediaHtml}
                <strong style="font-size:10px;margin-top:4px;color:${carta.isShiny ? '#ffd700' : '#fff'};display:block;">
                    ${carta.nome}
                </strong>
                <small style="color:#00e5ff;display:block;">
                    Qtd: x${qtd} | R$ ${precoAtual.toFixed(2)}
                    ${obterMultiplicador(carta.nome) > 1 ? `| x${obterMultiplicador(carta.nome)}` : ""}
                </small>
            `;

            previewDiv.onclick = () => tocarAudioCarta(carta);

            itemDiv.appendChild(previewDiv);

            let botoesDiv = document.createElement("div");

            let textoBtnTodas = bloqueada ? "Vender Excedentes" : "Vender Todas";

            botoesDiv.innerHTML = `
                <div class="grupo-botoes-venda">
                    <button class="btn-vender" onclick="venderCarta('${carta.nome}')">
                        Vender 1
                    </button>
                    <button class="btn-vender-especifica-todas" onclick="venderTodasDaCarta('${carta.nome}')">
                        ${textoBtnTodas}
                    </button>
                </div>
                <button class="btn-bloquear" onclick="alternarBloqueio('${carta.nome}')">
                    ${bloqueada ? "Desbloquear" : "Bloquear"}
                </button>
            `;

            itemDiv.appendChild(botoesDiv);

        } else {
            itemDiv.className = "item-album bloqueado";

            itemDiv.innerHTML = `
                <div class="silueta">?</div>
                <strong style="font-size:10px;margin-top:4px;color:#888;">
                    ${carta.nome}
                </strong>
                <small style="color:#555;">R$ ${precoAtual.toFixed(2)}</small>
            `;
        }

        grid.appendChild(itemDiv);
    });

    modal.style.display = "block";
}

function fecharAlbum() {
    document.getElementById("modal-album").style.display = "none";
}

function alternarBloqueio(nome) {
    cartasBloqueadas[nome] = !cartasBloqueadas[nome];

    salvarEstado();
    abrirAlbum();
    atualizarOpcoesRoleta();
}


// ==============================
// VENDAS
// ==============================

function venderCarta(nome) {
    if (!colecaoGlobal[nome] || colecaoGlobal[nome] <= 0) return;

    if (cartasBloqueadas[nome] && colecaoGlobal[nome] <= 1) {
        alert("Esta carta está bloqueada e precisa manter pelo menos 1 cópia!");
        return;
    }

    colecaoGlobal[nome]--;

    dinheiro += obterPrecoAtual(nome);

    salvarEstado();
    atualizarContadorVisual(0, 0);
    abrirAlbum();
    atualizarOpcoesRoleta();
}

function venderTodasDaCarta(nome) {
    let qtd = colecaoGlobal[nome] || 0;

    if (qtd <= 0) return;

    let quantidadeParaVender = qtd;

    if (cartasBloqueadas[nome]) {
        if (qtd <= 1) {
            alert("Esta carta está bloqueada e já tem apenas 1 cópia.");
            return;
        }

        quantidadeParaVender = qtd - 1;
    }

    dinheiro += obterPrecoAtual(nome) * quantidadeParaVender;

    colecaoGlobal[nome] = qtd - quantidadeParaVender;

    salvarEstado();
    atualizarContadorVisual(0, 0);
    abrirAlbum();
    atualizarOpcoesRoleta();
}

function venderTodasAsCartas() {
    for (let nome in colecaoGlobal) {
        if (colecaoGlobal[nome] > 0) {
            venderTodasDaCarta(nome);
        }
    }
}


// ==============================
// ROLETA
// ==============================

function criarRoleta() {
    if (document.getElementById("painel-roleta")) return;

    const painel = document.createElement("section");

    painel.id = "painel-roleta";

    painel.style.cssText = `
        background: #171722;
        border: 2px solid #444;
        border-radius: 12px;
        padding: 20px;
        margin: 25px auto;
        max-width: 650px;
        color: white;
        text-align: center;
    `;

    painel.innerHTML = `
        <h2 style="color:#fff;margin-top:0;">ROLETA DE CARTAS</h2>

        <p>Escolha uma carta da sua coleção para apostar.</p>

        <select id="carta-aposta" style="
            width:100%;
            max-width:400px;
            padding:12px;
            border-radius:8px;
            margin:10px;
            background:#29293b;
            color:white;
            border:1px solid #666;
        ">
            <option value="">Selecione uma carta</option>
        </select>

        <div id="informacao-carta-aposta" style="margin:10px;color:#ccc;">
            Nenhuma carta selecionada.
        </div>

        <p>Escolha uma cor:</p>

        <div style="
            display:flex;
            justify-content:center;
            gap:12px;
            flex-wrap:wrap;
            margin:15px 0;
        ">
            <button id="apostar-vermelho" style="
                background:#d62828;
                color:white;
                border:0;
                padding:14px 25px;
                border-radius:8px;
                cursor:pointer;
                font-weight:bold;
            ">VERMELHO</button>

            <button id="apostar-preto" style="
                background:#111;
                color:white;
                border:2px solid #777;
                padding:14px 25px;
                border-radius:8px;
                cursor:pointer;
                font-weight:bold;
            ">PRETO</button>
        </div>

        <div id="resultado-roleta" style="
            background:#29293b;
            padding:18px;
            border-radius:8px;
            margin-top:15px;
            font-size:18px;
        ">
            Escolha sua carta e uma cor.
        </div>

        <p style="color:#aaa;font-size:12px;margin-bottom:0;">
            Vermelho ou preto: x2 no acerto.
            Verde: x32 no valor da carta.
        </p>
    `;

    const conteudo = document.getElementById("conteudo-jogo");
    const areaCartas = document.getElementById("cartas");

    if (areaCartas && areaCartas.parentNode) {
        areaCartas.parentNode.insertBefore(painel, areaCartas.nextSibling);
    } else {
        conteudo.appendChild(painel);
    }

    document.getElementById("apostar-vermelho").onclick = () =>
        girarRoleta("vermelho");

    document.getElementById("apostar-preto").onclick = () =>
        girarRoleta("preto");

    document.getElementById("carta-aposta").onchange = atualizarPrecoAposta;

    atualizarOpcoesRoleta();
}

function atualizarOpcoesRoleta() {
    const select = document.getElementById("carta-aposta");

    if (!select) return;

    const valorAnterior = select.value;

    select.innerHTML = `<option value="">Selecione uma carta</option>`;

    for (let nome in colecaoGlobal) {
        let quantidade = colecaoGlobal[nome] || 0;

        if (quantidade <= 0 || cartasBloqueadas[nome]) continue;

        let opcao = document.createElement("option");

        opcao.value = nome;
        opcao.textContent =
            `${nome} | Qtd: ${quantidade} | R$ ${obterPrecoAtual(nome).toFixed(2)}`;

        select.appendChild(opcao);
    }

    if (valorAnterior && colecaoGlobal[valorAnterior] > 0 &&
        !cartasBloqueadas[valorAnterior]) {
        select.value = valorAnterior;
    }

    atualizarPrecoAposta();
}

function atualizarPrecoAposta() {
    const select = document.getElementById("carta-aposta");
    const informacao = document.getElementById("informacao-carta-aposta");

    if (!select || !informacao) return;

    const nome = select.value;

    if (!nome) {
        informacao.textContent = "Nenhuma carta selecionada.";
        return;
    }

    informacao.innerHTML = `
        <strong>${nome}</strong><br>
        Quantidade: ${colecaoGlobal[nome] || 0}<br>
        Valor atual: R$ ${obterPrecoAtual(nome).toFixed(2)}<br>
        Multiplicador: x${obterMultiplicador(nome)}
    `;
}

function girarRoleta(corEscolhida) {
    if (roletaEmAndamento) return;

    const select = document.getElementById("carta-aposta");
    const resultado = document.getElementById("resultado-roleta");

    const nome = select.value;

    if (!nome) {
        resultado.textContent = "Selecione uma carta primeiro.";
        return;
    }

    if (!colecaoGlobal[nome] || colecaoGlobal[nome] <= 0) {
        resultado.textContent = "Você não possui mais essa carta.";
        atualizarOpcoesRoleta();
        return;
    }

    if (cartasBloqueadas[nome]) {
        resultado.textContent = "Essa carta está bloqueada e não pode ser apostada.";
        return;
    }

    roletaEmAndamento = true;

    document.getElementById("apostar-vermelho").disabled = true;
    document.getElementById("apostar-preto").disabled = true;

    resultado.textContent = "A roleta está girando...";

    // Roleta com 18 casas vermelhas, 18 pretas e 1 verde.
    const numero = Math.floor(Math.random() * 37);

    let corSorteada;

    if (numero === 0) {
        corSorteada = "verde";
    } else if (numero % 2 === 0) {
        corSorteada = "preto";
    } else {
        corSorteada = "vermelho";
    }

    setTimeout(() => {
        if (corSorteada === "verde") {
            valoresCartas[nome] = obterMultiplicador(nome) * 32;

            resultado.innerHTML = `
                <strong style="color:#00e676;">CAIU VERDE!</strong><br>
                Sua carta permaneceu na coleção!<br>
                O valor dela agora é x${valoresCartas[nome]}.<br>
                Novo valor: R$ ${obterPrecoAtual(nome).toFixed(2)}
            `;

        } else if (corSorteada === corEscolhida) {
            valoresCartas[nome] = obterMultiplicador(nome) * 2;

            resultado.innerHTML = `
                <strong style="color:#00e676;">VOCÊ ACERTOU!</strong><br>
                A carta dobrou de valor!<br>
                Novo multiplicador: x${valoresCartas[nome]}<br>
                Novo valor: R$ ${obterPrecoAtual(nome).toFixed(2)}
            `;

        } else {
            colecaoGlobal[nome]--;

            resultado.innerHTML = `
                <strong style="color:#ff5252;">VOCÊ ERROU!</strong><br>
                A carta foi removida da sua coleção.
            `;
        }

        salvarEstado();
        atualizarContadorVisual(0, 0);
        atualizarOpcoesRoleta();

        roletaEmAndamento = false;

        document.getElementById("apostar-vermelho").disabled = false;
        document.getElementById("apostar-preto").disabled = false;

    }, 1500);
}


// ==============================
// CLIQUE FORA DO ÁLBUM
// ==============================

window.onclick = (e) => {
    if (e.target === document.getElementById("modal-album")) {
        fecharAlbum();
    }
};


// ==============================
// TECLADO
// ==============================

document.addEventListener("keydown", (e) => {
    if (
        e.code === "Space" &&
        document.getElementById("modal-album").style.display !== "block" &&
        document.getElementById("conteudo-jogo").style.display !== "none"
    ) {
        e.preventDefault();

        const divs = document.querySelectorAll(".carta");

        if (
            divs.length === 0 ||
            jogoTravado ||
            Array.from(divs).every(d => d.dataset.aberta === "sim")
        ) {
            comprarBooster(
                pacoteSelecionado.custo,
                pacoteSelecionado.multiplicador
            );

            return;
        }

        for (let i = 0; i < divs.length; i++) {
            if (!divs[i].dataset.aberta) {
                revelarCartaNoElemento(divs[i], cartasGeradas[i]);
                break;
            }
        }
    }
});
