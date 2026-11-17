const cartas = [
    {
        nome: "Gustavo Dancepot",
        imagem: "gustavodancepot.mp4",
        raridade: "DANCE POTRANCA",
        classe: "dance-potranca",
        chanceBase: 0.135,
        preco: 64.80
    },
    {
        nome: "Elefante Africano",
        imagem: "elefantebe.jpg",
        raridade: "TRANSFICANO",
        classe: "transficano",
        chanceBase: 0.45,
        preco: 13.50
    },
    {
        nome: "Gustavo Tartarugas Ninjas",
        imagem: "gustavo tartarugas ninjas.jpg",
        raridade: "SECRETA",
        classe: "secreta",
        chanceBase: 0.225,
        preco: 54.00
    },
    {
        nome: "Muryllo Apanhando",
        imagem: "muryllo_caindo.mp4",
        raridade: "ULTRA RARA",
        classe: "ultra-rara",
        chanceBase: 0.675,
        preco: 27.00
    },
    {
        nome: "Muryllo Skibidi",
        imagem: "muryllo skibidi.jpg",
        raridade: "EPICA",
        classe: "epica",
        chanceBase: 0.90,
        preco: 13.50
    },
    {
        nome: "O Inicio",
        imagem: "O inicio.jpg",
        raridade: "PRIMORDIAL",
        classe: "primordial",
        chanceBase: 0.36,
        preco: 43.20
    },
    {
        nome: "Resenha Call",
        imagem: "resenha call.jpg",
        raridade: "LENDARIA",
        classe: "lendaria",
        chanceBase: 0.45,
        preco: 43.20
    },
    {
        nome: "Xorume Muryllo",
        imagem: "xorume muryllo.jpg",
        raridade: "NOJO",
        classe: "nojo",
        chanceBase: 1.35,
        preco: 8.10
    },
    {
        nome: "Juliano",
        imagem: "juliano.jpg",
        raridade: "ESPECIAL HEXA",
        classe: "especial-hexa",
        chanceBase: 0.18,
        preco: 54.00
    },
    {
        nome: "Felipe",
        imagem: "felipe.jpg",
        raridade: "ESPECIAL HEXA",
        classe: "especial-hexa",
        chanceBase: 0.18,
        preco: 54.00
    },
    {
        nome: "Daniel",
        imagem: "daniel.jpg",
        raridade: "ESPECIAL HEXA",
        classe: "especial-hexa",
        chanceBase: 0.18,
        preco: 54.00
    },
    {
        nome: "Muryllo Pé de Mesa",
        imagem: "muryllo pé de mesa.mp4",
        raridade: "U DE UCRÂNIA",
        classe: "u-de-ucrania",
        chanceBase: 0.006,
        preco: 75.00
    },
    {
        nome: "Amanda (Resenha)",
        imagem: "amanda.res.jpg",
        raridade: "THE LAST RESENHA",
        classe: "the-last-resenha",
        chanceBase: 0.006,
        preco: 60.00
    },
    {
        nome: "Felipe (Resenha)",
        imagem: "felipe.res.jpg",
        raridade: "THE LAST RESENHA",
        classe: "the-last-resenha",
        chanceBase: 0.006,
        preco: 60.00
    },
    {
        nome: "Gustavo (Resenha)",
        imagem: "gustavo.res.jpg",
        raridade: "THE LAST RESENHA",
        classe: "the-last-resenha",
        chanceBase: 0.006,
        preco: 60.00
    },
    {
        nome: "Kayla (Resenha)",
        imagem: "kayla.res.jpg",
        raridade: "THE LAST RESENHA",
        classe: "the-last-resenha",
        chanceBase: 0.006,
        preco: 60.00
    },
    {
        nome: "Luis (Resenha)",
        imagem: "luis.res.jpg",
        raridade: "THE LAST RESENHA",
        classe: "the-last-resenha",
        chanceBase: 0.006,
        preco: 60.00
    },
    {
        nome: "Marcos (Resenha)",
        imagem: "marcos.res.jpg",
        raridade: "THE LAST RESENHA",
        classe: "the-last-resenha",
        chanceBase: 0.006,
        preco: 60.00
    },
    {
        nome: "Miguel (Resenha)",
        imagem: "miguel.res.jpg",
        raridade: "THE LAST RESENHA",
        classe: "the-last-resenha",
        chanceBase: 0.006,
        preco: 60.00
    },
    {
        nome: "Muryllo (Resenha)",
        imagem: "muryllo.res.jpg",
        raridade: "THE LAST RESENHA",
        classe: "the-last-resenha",
        chanceBase: 0.006,
        preco: 60.00
    }
];

let dinheiro = 200.00;
let colecaoGlobal = {};
let cartasBloqueadas = {};

let jogoTravado = false;
let cartasGeradas = [];

let pacoteSelecionado = {
    custo: 5.00,
    multiplicador: 1.0,
    nome: "Comum"
};

function fazerLogin() {
    let usuario = document.getElementById("input-usuario").value;
    let senha = document.getElementById("input-senha").value;

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha })
    })
    .then(res => res.json())
    .then(data => {
        if (data.sucesso) {
            dinheiro = data.dinheiro;
            colecaoGlobal = data.colecao;
            cartasBloqueadas = data.bloqueadas;

            document.getElementById("nome-usuario-logado").textContent = usuario;
            document.getElementById("tela-login").style.display = "none";
            document.getElementById("conteudo-jogo").style.display = "block";
            
            atualizarContadorVisual(0, 0);
            document.getElementById("resultado").textContent = "Selecione um booster e pressione Espaço para começar!";
        } else {
            document.getElementById("erro-login").textContent = data.mensagem;
        }
    });
}

function salvarEstado() {
    fetch('/api/salvar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            dinheiro: dinheiro,
            colecao: colecaoGlobal,
            bloqueadas: cartasBloqueadas
        })
    });
}

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

function selecionarBooster(custo, multiplicador, nome, elemento) {
    pacoteSelecionado = { custo, multiplicador, nome };
    document.querySelectorAll('.card-loja').forEach(card => card.classList.remove('selecionado'));
    elemento.classList.add('selecionado');
    document.getElementById("resultado").textContent = `Pacote ${nome} selecionado! Pressione Espaço para comprar.`;
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
        cartaSorteada.preco = cartaSorteada.preco * 2;
        cartaSorteada.raridade = cartaSorteada.raridade ? "SHINY " + cartaSorteada.raridade : "SHINY PAIA";
    }

    return cartaSorteada;
}

function atualizarContadorVisual(reveladas, especiais) {
    document.getElementById("contador-abertas").textContent = `${reveladas}/7`;
    document.getElementById("contador-especiais").textContent = especiais;
    document.getElementById("saldo-jogador").textContent = `R$ ${dinheiro.toFixed(2)}`;
}

function revelarCartaNoElemento(div, carta) {
    if (div.dataset.aberta === "sim") return;
    div.dataset.aberta = "sim";

    colecaoGlobal[carta.nome] = (colecaoGlobal[carta.nome] || 0) + 1;

    if (carta.raridade && carta.tipo !== "armadilha" && carta.raridade !== "PAIA" && carta.raridade !== "SHINY PAIA") {
        div.classList.add(carta.classe);
        if (carta.isShiny) div.classList.add("shiny");

        if (carta.imagem && carta.imagem.endsWith('.mp4')) {
            div.innerHTML = `
                <video src="/static/${encodeURIComponent(carta.imagem)}" autoplay loop muted style="width: 100%; height: 65%; object-fit: contain; background: #000; border-radius: 4px;"></video>
                <strong style="font-size: 11px; display: block; margin-top: 4px;">${carta.nome}</strong>
                <small style="font-size: 9px;">${carta.raridade}</small>
            `;
        } else if (carta.imagem) {
            div.innerHTML = `
                <img src="/static/${encodeURIComponent(carta.imagem)}" style="width: 100%; height: 65%; object-fit: contain; background: #000; border-radius: 4px;">
                <strong style="font-size: 11px; display: block; margin-top: 4px;">${carta.nome}</strong>
                <small style="font-size: 9px;">${carta.raridade}</small>
            `;
        }
        tocarAudioCarta(carta);
    } else if (carta.tipo === "armadilha") {
        div.classList.add("armadilha");
        dinheiro = Math.max(0, dinheiro - 67.00);

        div.innerHTML = `<strong>PERDEU!</strong><small>R$ 67,00 ROUBADO!</small>`;
        new Audio('/static/perdeu.mp3').play().catch(e => {});

        jogoTravado = true;
        document.getElementById("resultado").textContent = `Tirou a armadilha! Perdeu R$ 67,00 do seu saldo.`;
    } else {
        div.classList.add("comum");
        if (carta.isShiny) div.classList.add("shiny");
        div.innerHTML = `
            <div class="verso" style="font-size: 50px; margin-bottom: auto; margin-top: auto;">PAIA</div>
            <div style="width: 100%;"><strong>${carta.nome}</strong><small>${carta.raridade}</small></div>
        `;
    }

    salvarEstado();
    verificarFimDoBooster();
}

function comprarBooster(custo, multiplicador) {
    if (dinheiro < custo) {
        document.getElementById("resultado").textContent = `Não tens dinheiro suficiente (Custo: R$ ${custo.toFixed(2)})!`;
        return;
    }

    dinheiro -= custo;
    salvarEstado();

    const area = document.getElementById("cartas");
    area.innerHTML = "";
    cartasGeradas = [];
    jogoTravado = false;

    document.getElementById("resultado").textContent = "Revele as suas 7 cartas!";
    atualizarContadorVisual(0, 0);

    for (let i = 0; i < 7; i++) {
        let carta = sortearCarta(multiplicador);
        cartasGeradas.push(carta);

        let div = document.createElement("div");
        div.className = "carta";
        div.innerHTML = `<div class="verso">?</div><div class="texto-verso">CARTA ${i + 1}</div>`;

        div.onclick = function () {
            if (jogoTravado || div.dataset.aberta) return;
            revelarCartaNoElemento(div, carta);
        };
        area.appendChild(div);
    }
}

function verificarFimDoBooster() {
    const divsCartas = document.querySelectorAll(".carta");
    let reveladas = 0, especiais = 0;

    divsCartas.forEach(d => {
        if (d.dataset.aberta === "sim") {
            reveladas++;
            if (!d.classList.contains("comum") && !d.classList.contains("armadilha")) especiais++;
        }
    });

    atualizarContadorVisual(reveladas, especiais);
    if (reveladas === 7 && !jogoTravado) {
        document.getElementById("resultado").textContent = `Booster finalizado! Conseguiu ${especiais} especial(is)! Pressione Espaço.`;
    }
}

function abrirAlbum() {
    const modal = document.getElementById("modal-album");
    const grid = document.getElementById("grid-album");
    grid.innerHTML = "";

    let listaCompletaAlbum = [];
    cartas.forEach(c => {
        listaCompletaAlbum.push({ ...c });
        listaCompletaAlbum.push({ ...c, nome: "⭐ " + c.nome + " (Shiny)", preco: c.preco * 2, isShiny: true, raridade: "SHINY " + c.raridade });
    });

    listaCompletaAlbum.push({ nome: "CARTA PAIA", raridade: "PAIA", preco: 1.50, classe: "comum" });
    listaCompletaAlbum.push({ nome: "⭐ CARTA PAIA (Shiny)", raridade: "SHINY PAIA", preco: 3.00, classe: "comum", isShiny: true });

    listaCompletaAlbum.forEach(carta => {
        let qtd = colecaoGlobal[carta.nome] || 0;
        let itemDiv = document.createElement("div");
        let bloqueada = cartasBloqueadas[carta.nome] || false;

        if (qtd > 0) {
            itemDiv.className = "item-album";
            if (carta.classe) itemDiv.classList.add(carta.classe);
            if (carta.isShiny) itemDiv.classList.add("shiny");
            if (bloqueada) itemDiv.classList.add("bloqueado-carta");

            let mediaHtml = carta.imagem && carta.imagem.endsWith('.mp4') ?
                `<video src="/static/${encodeURIComponent(carta.imagem)}" autoplay loop muted style="width: 100%; height: 75px; object-fit: contain; background: #000; border-radius: 4px;"></video>` :
                (carta.imagem ? `<img src="/static/${encodeURIComponent(carta.imagem)}" style="width: 100%; height: 75px; object-fit: contain; background: #000; border-radius: 4px;">` : `<div class="silueta" style="font-size: 18px; color: #aaa;">PAIA</div>`);

            let previewDiv = document.createElement("div");
            previewDiv.style.cursor = "pointer";
            previewDiv.innerHTML = `${mediaHtml}<strong style="font-size: 10px; margin-top: 4px; color: ${carta.isShiny ? '#ffd700' : '#fff'}; display: block;">${carta.nome}</strong><small style="color: #00e5ff; display: block;">Qtd: x${qtd} | R$ ${carta.preco.toFixed(2)}</small>`;
            previewDiv.onclick = () => tocarAudioCarta(carta);
            itemDiv.appendChild(previewDiv);

            let botoesDiv = document.createElement("div");
            let textoBtnTodas = bloqueada ? "Vender Excedentes" : "Vender Todas";
            botoesDiv.innerHTML = `
                <div class="grupo-botoes-venda">
                    <button class="btn-vender" onclick="venderCarta('${carta.nome}')">Vender 1</button>
                    <button class="btn-vender-especifica-todas" onclick="venderTodasDaCarta('${carta.nome}')">${textoBtnTodas}</button>
                </div>
                <button class="btn-bloquear" onclick="alternarBloqueio('${carta.nome}')">${bloqueada ? "🔓 Desbloquear" : "🔒 Bloquear"}</button>
            `;
            itemDiv.appendChild(botoesDiv);
        } else {
            itemDiv.className = "item-album bloqueado";
            itemDiv.innerHTML = `<div class="silueta">?</div><strong style="font-size: 10px; margin-top: 4px; color: #888;">${carta.nome}</strong><small style="color: #555;">R$ ${carta.preco.toFixed(2)}</small>`;
        }
        grid.appendChild(itemDiv);
    });
    modal.style.display = "block";
}

function fecharAlbum() { document.getElementById("modal-album").style.display = "none"; }
function alternarBloqueio(nome) { cartasBloqueadas[nome] = !cartasBloqueadas[nome]; salvarEstado(); abrirAlbum(); }

function venderCarta(nome) {
    if (!colecaoGlobal[nome] || colecaoGlobal[nome] <= 0) return;

    if (cartasBloqueadas[nome] && colecaoGlobal[nome] <= 1) {
        alert("Esta carta está bloqueada e precisa de manter pelo menos 1 cópia!");
        return;
    }

    colecaoGlobal[nome]--;
    
    let precoVenda = 1.50;
    if (nome === "⭐ CARTA PAIA (Shiny)") precoVenda = 3.00;
    else {
        let encontrada = cartas.find(c => c.nome === nome || "⭐ " + c.nome + " (Shiny)" === nome);
        if (encontrada) precoVenda = encontrada.preco * (nome.includes("Shiny") ? 2 : 1);
    }

    dinheiro += precoVenda;
    salvarEstado();
    atualizarContadorVisual(0, 0);
    abrirAlbum();
}

function venderTodasDaCarta(nome) {
    let qtd = colecaoGlobal[nome] || 0;
    if (qtd <= 0) return;

    let quantidadeParaVender = qtd;

    if (cartasBloqueadas[nome]) {
        if (qtd <= 1) {
            alert("Esta carta está bloqueada e já tem apenas 1 cópia (não pode vender os excedentes).");
            return;
        }
        quantidadeParaVender = qtd - 1;
    }

    let precoVenda = 1.50;
    if (nome === "⭐ CARTA PAIA (Shiny)") precoVenda = 3.00;
    else {
        let encontrada = cartas.find(c => c.nome === nome || "⭐ " + c.nome + " (Shiny)" === nome);
        if (encontrada) precoVenda = encontrada.preco * (nome.includes("Shiny") ? 2 : 1);
    }
    
    dinheiro += precoVenda * quantidadeParaVender;
    colecaoGlobal[nome] = qtd - quantidadeParaVender;

    salvarEstado();
    atualizarContadorVisual(0, 0);
    abrirAlbum();
}

function venderTodasAsCartas() {
    for (let nome in colecaoGlobal) {
        if (colecaoGlobal[nome] > 0) {
            venderTodasDaCarta(nome);
        }
    }
}

window.onclick = (e) => { 
    if (e.target === document.getElementById("modal-album")) fecharAlbum();
};

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && document.getElementById("modal-album").style.display !== "block" && document.getElementById("conteudo-jogo").style.display !== "none") {
        e.preventDefault();
        const divs = document.querySelectorAll(".carta");
        if (divs.length === 0 || jogoTravado || Array.from(divs).every(d => d.dataset.aberta === "sim")) {
            comprarBooster(pacoteSelecionado.custo, pacoteSelecionado.multiplicador);
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