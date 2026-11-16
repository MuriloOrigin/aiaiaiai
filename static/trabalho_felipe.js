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
    // CARTA U DE UCRÂNIA (Toca o áudio muryllo car cur.mp3)
    {
        nome: "Muryllo Pé de Mesa",
        imagem: "muryllo pé de mesa.mp4",
        raridade: "U DE UCRÂNIA",
        classe: "u-de-ucrania",
        chanceBase: 0.006,
        preco: 75.00
    },
    // CARTAS THE LAST RESENHA
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

// Carrega os dados salvos no navegador (ou usa os valores padrão)
let dinheiro = localStorage.getItem('felipe_dinheiro') ? parseFloat(localStorage.getItem('felipe_dinheiro')) : 200.00;
let colecaoGlobal = localStorage.getItem('felipe_colecao') ? JSON.parse(localStorage.getItem('felipe_colecao')) : {};
let cartasBloqueadas = localStorage.getItem('felipe_bloqueadas') ? JSON.parse(localStorage.getItem('felipe_bloqueadas')) : {};

let jogoTravado = false;
let cartasGeradas = [];

let pacoteSelecionado = {
    custo: 5.00,
    multiplicador: 1.0,
    nome: "Comum"
};

// Função para salvar o estado atual no navegador
function salvarEstado() {
    localStorage.setItem('felipe_dinheiro', dinheiro);
    localStorage.setItem('felipe_colecao', JSON.stringify(colecaoGlobal));
    localStorage.setItem('felipe_bloqueadas', JSON.stringify(cartasBloqueadas));
}

// Função centralizada para tocar o áudio de cartas específicas
function tocarAudioCarta(carta) {
    if (carta.imagem === "gustavodancepot.mp4") {
        let somDance = new Audio('/static/dancepotranca.mp3');
        somDance.play().catch(e => {});
    } else if (carta.imagem === "gustavo tartarugas ninjas.jpg") {
        let somTartarugas = new Audio('/static/tartarugas ninjas.mp3');
        somTartarugas.play().catch(e => {});
    } else if (carta.imagem === "muryllo pé de mesa.mp4") {
        let somCarCur = new Audio('/static/muryllo car cur.mp3');
        somCarCur.play().catch(e => {});
    } else if (carta.classe === "the-last-resenha") {
        let somResenha = new Audio('/static/army-of-lovers-crucified.mp3');
        somResenha.play().catch(e => {});
    }
}

window.onload = function() {
    atualizarContadorVisual(0, 0);
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
                preco: 1.00,
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
        if (cartaSorteada.raridade) {
            cartaSorteada.raridade = "SHINY " + cartaSorteada.raridade;
        } else {
            cartaSorteada.raridade = "SHINY PAIA";
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

    if (carta.raridade && carta.tipo !== "armadilha" && carta.raridade !== "PAIA" && carta.raridade !== "SHINY PAIA") {
        div.classList.add(carta.classe);
        if (carta.isShiny) {
            div.classList.add("shiny");
        }

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
        } else {
            div.innerHTML = `
                <div class="verso" style="font-size: 32px;">PAIA</div>
                <div>
                    <strong>${carta.nome}</strong>
                    <small>${carta.raridade}</small>
                </div>
            `;
        }

        // Toca o áudio ao revelar
        tocarAudioCarta(carta);

    } else if (carta.tipo === "armadilha") {
        div.classList.add("armadilha");
        
        let valorRoubado = dinheiro * 0.67;
        dinheiro -= valorRoubado;

        div.innerHTML = `
            <strong>PERDEU!</strong>
            <small>67% ROUBADO!</small>
        `;

        let somPerdeu = new Audio('/static/perdeu.mp3');
        somPerdeu.play().catch(e => {});

        jogoTravado = true;
        document.getElementById("resultado").textContent = 
            `Tirou a armadilha! Perdeu 67% do seu saldo (R$ ${valorRoubado.toFixed(2)}). Selecione um booster para tentar de novo.`;

    } else {
        div.classList.add("comum");
        if (carta.isShiny) {
            div.classList.add("shiny");
        }
        div.innerHTML = `
            <div class="verso" style="font-size: 50px; margin-bottom: auto; margin-top: auto;">PAIA</div>
            <div style="width: 100%;">
                <strong>${carta.nome}</strong>
                <small>${carta.raridade}</small>
            </div>
        `;
    }

    salvarEstado();
    verificarFimDoBooster();
}

function comprarBooster(custo, multiplicador) {
    if (dinheiro < custo) {
        document.getElementById("resultado").textContent = `Não tens dinheiro suficiente para este booster (Custo: R$ ${custo.toFixed(2)})!`;
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

    let paiaNormal = { nome: "CARTA PAIA", raridade: "PAIA", preco: 1.00, classe: "comum" };
    let paiaShiny = { nome: "⭐ CARTA PAIA (Shiny)", raridade: "SHINY PAIA", preco: 2.00, classe: "comum", isShiny: true };
    listaCompletaAlbum.push(paiaNormal);
    listaCompletaAlbum.push(paiaShiny);

    listaCompletaAlbum.forEach(carta => {
        let qtd = colecaoGlobal[carta.nome] || 0;
        let itemDiv = document.createElement("div");
        let bloqueada = cartasBloqueadas[carta.nome] || false;

        if (qtd > 0) {
            itemDiv.className = "item-album";
            if (carta.classe) itemDiv.classList.add(carta.classe);
            if (carta.isShiny) itemDiv.classList.add("shiny");
            if (bloqueada) itemDiv.classList.add("bloqueado-carta");

            let mediaHtml = "";
            if (carta.imagem && carta.imagem.endsWith('.mp4')) {
                mediaHtml = `<video src="/static/${encodeURIComponent(carta.imagem)}" autoplay loop muted style="width: 100%; height: 75px; object-fit: contain; background: #000; border-radius: 4px;"></video>`;
            } else if (carta.imagem) {
                mediaHtml = `<img src="/static/${encodeURIComponent(carta.imagem)}" style="width: 100%; height: 75px; object-fit: contain; background: #000; border-radius: 4px;">`;
            } else {
                mediaHtml = `<div class="silueta" style="font-size: 18px; color: #aaa;">PAIA</div>`;
            }

            let botoesVendaHtml = bloqueada ? 
                `<span style="color: #00e5ff; font-size: 11px; font-weight: bold; margin-top: 4px; display:block;">🔒 Bloqueada</span>` : 
                `<div class="grupo-botoes-venda">
                    <button class="btn-vender" onclick="venderCarta('${carta.nome}')">Vender 1</button>
                    <button class="btn-vender-especifica-todas" onclick="venderTodasDaCarta('${carta.nome}')">Vender Todas</button>
                </div>`;

            let textoBloqueio = bloqueada ? "🔓 Desbloquear" : "🔒 Bloquear";

            let previewDiv = document.createElement("div");
            previewDiv.style.cursor = "pointer";
            previewDiv.title = "Clique para tocar o áudio!";
            previewDiv.innerHTML = `
                ${mediaHtml}
                <strong style="font-size: 10px; margin-top: 4px; color: ${carta.isShiny ? '#ffd700' : '#fff'}; display: block;">${carta.nome}</strong>
                <small style="color: #00e5ff; display: block;">Qtd: x${qtd} | R$ ${carta.preco.toFixed(2)}</small>
            `;
            previewDiv.onclick = function() {
                tocarAudioCarta(carta);
            };

            itemDiv.appendChild(previewDiv);

            let containerBotoes = document.createElement("div");
            containerBotoes.innerHTML = `
                ${botoesVendaHtml}
                <button class="btn-bloquear" onclick="alternarBloqueio('${carta.nome}')">${textoBloqueio}</button>
            `;
            itemDiv.appendChild(containerBotoes);

        } else {
            itemDiv.className = "item-album bloqueado";
            itemDiv.innerHTML = `
                <div class="silueta">?</div>
                <strong style="font-size: 10px; margin-top: 4px; color: #888;">${carta.nome}</strong>
                <small style="color: #555;">R$ ${carta.preco.toFixed(2)}</small>
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
    salvarEstado();
    abrirAlbum();
}

function venderCarta(nomeCarta) {
    if (cartasBloqueadas[nomeCarta]) return;

    if (colecaoGlobal[nomeCarta] && colecaoGlobal[nomeCarta] > 0) {
        colecaoGlobal[nomeCarta]--;
        
        let precoVenda = 0;
        if (nomeCarta === "CARTA PAIA") precoVenda = 1.00;
        else if (nomeCarta === "⭐ CARTA PAIA (Shiny)") precoVenda = 2.00;
        else {
            cartas.forEach(c => {
                if (nomeCarta === c.nome) precoVenda = c.preco;
                if (nomeCarta === "⭐ " + c.nome + " (Shiny)") precoVenda = c.preco * 2;
            });
        }

        dinheiro += precoVenda;
        salvarEstado();
        atualizarContadorVisual(0, 0);
        abrirAlbum(); 
    }
}

function venderTodasDaCarta(nomeCarta) {
    if (cartasBloqueadas[nomeCarta]) return;

    let qtd = colecaoGlobal[nomeCarta] || 0;
    if (qtd > 0) {
        let precoVenda = 0;
        if (nomeCarta === "CARTA PAIA") precoVenda = 1.00;
        else if (nomeCarta === "⭐ CARTA PAIA (Shiny)") precoVenda = 2.00;
        else {
            cartas.forEach(c => {
                if (nomeCarta === c.nome) precoVenda = c.preco;
                if (nomeCarta === "⭐ " + c.nome + " (Shiny)") precoVenda = c.preco * 2;
            });
        }

        dinheiro += precoVenda * qtd;
        colecaoGlobal[nomeCarta] = 0;
        salvarEstado();
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
            if (nomeCarta === "CARTA PAIA") precoVenda = 1.00;
            else if (nomeCarta === "⭐ CARTA PAIA (Shiny)") precoVenda = 2.00;
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
    salvarEstado();
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