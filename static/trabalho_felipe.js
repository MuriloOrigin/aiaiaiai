const cartas = [
    {
        nome: "Gustavo Dancepot",
        imagem: "gustavodancepot.mp4",
        raridade: "DANCE POTRANCA",
        classe: "dance-potranca",
        chanceBase: 0.45,
        preco: 64.80
    },
    {
        nome: "Elefante Africano",
        imagem: "elefantebe.jpg",
        raridade: "TRANSFICANO",
        classe: "transficano",
        chanceBase: 1.5,
        preco: 13.50
    },
    {
        nome: "Gustavo Tartarugas Ninjas",
        imagem: "gustavo tartarugas ninjas.jpg",
        raridade: "SECRETA",
        classe: "secreta",
        chanceBase: 0.75,
        preco: 54.00
    },
    {
        nome: "Muryllo Apanhando",
        imagem: "muryllo_caindo.mp4",
        raridade: "ULTRA RARA",
        classe: "ultra-rara",
        chanceBase: 2.25,
        preco: 27.00
    },
    {
        nome: "Muryllo Skibidi",
        imagem: "muryllo skibidi.jpg",
        raridade: "EPICA",
        classe: "epica",
        chanceBase: 3.0,
        preco: 13.50
    },
    {
        nome: "O Inicio",
        imagem: "O inicio.jpg",
        raridade: "PRIMORDIAL",
        classe: "primordial",
        chanceBase: 1.2,
        preco: 43.20
    },
    {
        nome: "Resenha Call",
        imagem: "resenha call.jpg",
        raridade: "LENDARIA",
        classe: "lendaria",
        chanceBase: 1.5,
        preco: 43.20
    },
    {
        nome: "Xorume Muryllo",
        imagem: "xorume muryllo.jpg",
        raridade: "NOJO",
        classe: "nojo",
        chanceBase: 4.5,
        preco: 8.10
    },
    {
        nome: "Juliano",
        imagem: "juliano.jpg",
        raridade: "ESPECIAL HEXA",
        classe: "especial-hexa",
        chanceBase: 0.6,
        preco: 54.00
    },
    {
        nome: "Felipe",
        imagem: "felipe.jpg",
        raridade: "ESPECIAL HEXA",
        classe: "especial-hexa",
        chanceBase: 0.6,
        preco: 54.00
    },
    {
        nome: "Daniel",
        imagem: "daniel.jpg",
        raridade: "ESPECIAL HEXA",
        classe: "especial-hexa",
        chanceBase: 0.6,
        preco: 54.00
    }
];

let dinheiro = 200.00;
let jogoTravado = false;
let cartasGeradas = [];
let colecaoGlobal = {};
let cartasBloqueadas = {};

let pacoteSelecionado = {
    custo: 5.00,
    multiplicador: 1.0,
    nome: "Comum"
};

function selecionarBooster(custo, multiplicador, nome, elemento) {
    pacoteSelecionado = { custo, multiplicador, nome };

    document.querySelectorAll('.card-loja').forEach(card => {
        card.classList.remove('selecionado');
    });
    elemento.classList.add('selecionado');

    document.getElementById("resultado").textContent = `Pacote ${nome} selecionado! Pressione Espaço para comprar.`;
}

function sortearCarta(multiplicador) {
    let numero = Math.random() * 100;
    let acumulado = 0;
    let cartaSorteada = null;

    for (let carta of cartas) {
        let chanceEfetiva = carta.chanceBase * (carta.chanceBase < 2.0 ? multiplicador : 1.0);
        acumulado += chanceEfetiva;

        if (numero < acumulado) {
            cartaSorteada = { ...carta };
            break;
        }
    }

    if (!cartaSorteada) {
        let chanceArmadilha = 5.0 / multiplicador;
        if (numero < 5 + chanceArmadilha) {
            cartaSorteada = {
                nome: "PERDEU OTARIO!",
                tipo: "armadilha",
                preco: 0
            };
        } else {
            cartaSorteada = {
                nome: "CARTA PAIA",
                tipo: "comum",
                preco: 2.70,
                raridade: "PAIA",
                classe: "comum"
            };
        }
    }

    let chanceShinyBase = 3.0;
    let chanceShinyEfetiva = chanceShinyBase * multiplicador;
    let sorteioShiny = Math.random() * 100;

    if (sorteioShiny < chanceShinyEfetiva && !cartaSorteada.tipo) {
        cartaSorteada.isShiny = true;
        cartaSorteada.nomeOriginal = cartaSorteada.nome;
        cartaSorteada.nome = "⭐ " + cartaSorteada.nomeOriginal + " (Shiny)";
        cartaSorteada.preco = cartaSorteada.preco * 2;
        if (cartaSorteada.raridade) {
            cartaSorteada.raridade = "SHINY " + cartaSorteada.raridade;
        }
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

    let nomeColecao = carta.nome;
    colecaoGlobal[nomeColecao] = (colecaoGlobal[nomeColecao] || 0) + 1;

    if (carta.raridade && carta.tipo !== "armadilha") {
        div.classList.add(carta.classe);
        if (carta.isShiny) {
            div.classList.add("shiny");
        }

        if (carta.imagem && carta.imagem.endsWith('.mp4')) {
            div.innerHTML = `
                <video src="/static/${encodeURIComponent(carta.imagem)}" autoplay loop muted></video>
                <strong>${carta.nome}</strong>
                <small>${carta.raridade}</small>
            `;
        } else if (carta.imagem) {
            div.innerHTML = `
                <img src="/static/${encodeURIComponent(carta.imagem)}">
                <strong>${carta.nome}</strong>
                <small>${carta.raridade}</small>
            `;
        } else {
            div.innerHTML = `
                <div class="verso" style="font-size: 35px;">PAIA</div>
                <strong>${carta.nome}</strong>
                <small>${carta.raridade}</small>
            `;
        }

        if (carta.imagem === "gustavodancepot.mp4") {
            let somDance = new Audio('/static/dancepotranca.mp3');
            somDance.play();
        } else if (carta.imagem === "gustavo tartarugas ninjas.jpg") {
            let somTartarugas = new Audio('/static/tartarugas ninjas.mp3');
            somTartarugas.play();
        }

    } else if (carta.tipo === "armadilha") {
        div.classList.add("armadilha");
        div.innerHTML = `
            <strong>PERDEU!</strong>
            <small>OTARIO!</small>
        `;

        let somPerdeu = new Audio('/static/perdeu.mp3');
        somPerdeu.play();

        jogoTravado = true;
        document.getElementById("resultado").textContent = 
            "Tirou a armadilha e perdeu! Selecione um booster para tentar de novo.";

    } else {
        div.classList.add("comum");
        if (carta.isShiny) div.classList.add("shiny");
        div.innerHTML = `
            <div class="verso" style="font-size: 35px;">PAIA</div>
            <strong>${carta.nome}</strong>
            <small>${carta.raridade}</small>
        `;
    }

    verificarFimDoBooster();
}

function comprarBooster(custo, multiplicador) {
    if (dinheiro < custo) {
        document.getElementById("resultado").textContent = `Não tens dinheiro suficiente para este booster (Custo: R$ ${custo.toFixed(2)})!`;
        return;
    }

    dinheiro -= custo;

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
        div.innerHTML = `
            <div class="verso">?</div>
            <strong>CARTA ${i + 1}</strong>
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
            if (!d.classList.contains("comum") && !d.classList.contains("armadilha")) {
                especiais++;
            }
        }
    });

    atualizarContadorVisual(reveladas, especiais);

    if (reveladas === 7 && !jogoTravado) {
        document.getElementById("resultado").textContent =
            `Booster finalizado! Conseguiu ${especiais} carta(s) especial(is)! Pressione Espaço para abrir outro.`;
    }
}

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
            preco: c.preco * 2,
            isShiny: true,
            raridade: "SHINY " + c.raridade
        });
    });

    let paiaNormal = { nome: "CARTA PAIA", raridade: "PAIA", preco: 2.70, classe: "comum" };
    let paiaShiny = { nome: "⭐ CARTA PAIA (Shiny)", raridade: "SHINY PAIA", preco: 5.40, classe: "comum", isShiny: true };
    listaCompletaAlbum.push(paiaNormal, paiaShiny);

    listaCompletaAlbum.forEach(carta => {
        let qtd = colecaoGlobal[carta.nome] || 0;
        let itemDiv = document.createElement("div");
        let bloqueada = cartasBloqueadas[carta.nome] || false;

        if (qtd > 0) {
            itemDiv.className = carta.isShiny ? "item-album shiny-borda" : "item-album";
            if (bloqueada) itemDiv.classList.add("bloqueado-carta");

            let mediaHtml = "";
            if (carta.imagem && carta.imagem.endsWith('.mp4')) {
                mediaHtml = `<video src="/static/${encodeURIComponent(carta.imagem)}" autoplay loop muted></video>`;
            } else if (carta.imagem) {
                mediaHtml = `<img src="/static/${encodeURIComponent(carta.imagem)}">`;
            } else {
                mediaHtml = `<div class="silueta" style="font-size: 18px; color: #aaa;">PAIA</div>`;
            }

            let botoesVendaHtml = bloqueada ? 
                `<span style="color: #00e5ff; font-size: 11px; font-weight: bold; margin-top: 6px; display:block;">🔒 Bloqueada</span>` : 
                `<div class="grupo-botoes-venda">
                    <button class="btn-vender" onclick="venderCarta('${carta.nome}')">Vender 1</button>
                    <button class="btn-vender-especifica-todas" onclick="venderTodasDaCarta('${carta.nome}')">Vender Todas</button>
                </div>`;

            let textoBloqueio = bloqueada ? "🔓 Desbloquear" : "🔒 Bloquear";

            itemDiv.innerHTML = `
                ${mediaHtml}
                <strong style="font-size: 10px; margin-top: 5px; color: ${carta.isShiny ? '#ffd700' : '#fff'};">${carta.nome}</strong>
                <small style="color: #00e5ff;">Qtd: x${qtd}</small>
                ${botoesVendaHtml}
                <button class="btn-bloquear" onclick="alternarBloqueio('${carta.nome}')">${textoBloqueio}</button>
            `;
        } else {
            itemDiv.className = "item-album bloqueado";
            itemDiv.innerHTML = `
                <div class="silueta">?</div>
                <strong style="font-size: 10px; margin-top: 5px; color: #888;">${carta.nome}</strong>
                <small style="color: #555;">Bloqueado</small>
            `;
        }

        grid.appendChild(itemDiv);
    });

    modal.style.display = "block";
}

function fecharAlbum() {
    document.getElementById("modal-album").style.display = "none";
}

function alternarBloqueio(nomeCarta) {
    cartasBloqueadas[nomeCarta] = !cartasBloqueadas[nomeCarta];
    abrirAlbum();
}

function venderCarta(nomeCarta) {
    if (cartasBloqueadas[nomeCarta]) return;

    if (colecaoGlobal[nomeCarta] && colecaoGlobal[nomeCarta] > 0) {
        colecaoGlobal[nomeCarta]--;
        
        let precoVenda = 0;
        if (nomeCarta === "CARTA PAIA") precoVenda = 2.70;
        else if (nomeCarta === "⭐ CARTA PAIA (Shiny)") precoVenda = 5.40;
        else {
            cartas.forEach(c => {
                if (nomeCarta === c.nome) precoVenda = c.preco;
                if (nomeCarta === "⭐ " + c.nome + " (Shiny)") precoVenda = c.preco * 2;
            });
        }

        dinheiro += precoVenda;
        atualizarContadorVisual(0, 0);
        abrirAlbum(); 
    }
}

function venderTodasDaCarta(nomeCarta) {
    if (cartasBloqueadas[nomeCarta]) return;

    let qtd = colecaoGlobal[nomeCarta] || 0;
    if (qtd > 0) {
        let precoVenda = 0;
        if (nomeCarta === "CARTA PAIA") precoVenda = 2.70;
        else if (nomeCarta === "⭐ CARTA PAIA (Shiny)") precoVenda = 5.40;
        else {
            cartas.forEach(c => {
                if (nomeCarta === c.nome) precoVenda = c.preco;
                if (nomeCarta === "⭐ " + c.nome + " (Shiny)") precoVenda = c.preco * 2;
            });
        }

        dinheiro += precoVenda * qtd;
        colecaoGlobal[nomeCarta] = 0;
        atualizarContadorVisual(0, 0);
        abrirAlbum();
    }
}

function venderTodasAsCartas() {
    let totalGanho = 0;

    for (let nomeCarta in colecaoGlobal) {
        if (cartasBloqueadas[nomeCarta]) continue;

        let qtd = colecaoGlobal[nomeCarta];
        if (qtd > 0) {
            let precoVenda = 0;
            if (nomeCarta === "CARTA PAIA") precoVenda = 2.70;
            else if (nomeCarta === "⭐ CARTA PAIA (Shiny)") precoVenda = 5.40;
            else {
                cartas.forEach(c => {
                    if (nomeCarta === c.nome) precoVenda = c.preco;
                    if (nomeCarta === "⭐ " + c.nome + " (Shiny)") precoVenda = c.preco * 2;
                });
            }

            totalGanho += precoVenda * qtd;
            colecaoGlobal[nomeCarta] = 0;
        }
    }

    dinheiro += totalGanho;
    atualizarContadorVisual(0, 0);
    abrirAlbum();
}

window.onclick = function(event) {
    let modal = document.getElementById("modal-album");
    if (event.target === modal) {
        fecharAlbum();
    }
}

document.addEventListener("keydown", function(event) {
    if (event.code === "Space" || event.key === " ") {
        if (document.getElementById("modal-album").style.display === "block") return;

        event.preventDefault();

        const divsCartas = document.querySelectorAll(".carta");

        if (divsCartas.length === 0) {
            comprarBooster(pacoteSelecionado.custo, pacoteSelecionado.multiplicador);
            return;
        }

        let todasAbertas = Array.from(divsCartas).every(d => d.dataset.aberta === "sim");
        if (jogoTravado || todasAbertas) {
            comprarBooster(pacoteSelecionado.custo, pacoteSelecionado.multiplicador);
            return;
        }

        for (let i = 0; i < divsCartas.length; i++) {
            if (!divsCartas[i].dataset.aberta) {
                revelarCartaNoElemento(divsCartas[i], cartasGeradas[i]);
                break;
            }
        }
    }
});