const cartas = [
    {
        nome: "Gustavo Dancepot",
        imagem: "gustavodancepot.mp4",
        raridade: "DANCE POTRANCA",
        classe: "dance-potranca",
        chance: 0.3,
        preco: 12.00
    },
    {
        nome: "Elefante Africano",
        imagem: "elefantebe.jpg",
        raridade: "TRANSFICANO",
        classe: "transficano",
        chance: 1.0,
        preco: 2.50
    },
    {
        nome: "Gustavo Tartarugas Ninjas",
        imagem: "gustavo tartarugas ninjas.jpg",
        raridade: "SECRETA",
        classe: "secreta",
        chance: 0.5,
        preco: 10.00
    },
    {
        nome: "Muryllo Apanhando",
        imagem: "muryllo_caindo.mp4",
        raridade: "ULTRA RARA",
        classe: "ultra-rara",
        chance: 1.5,
        preco: 5.00
    },
    {
        nome: "Muryllo Skibidi",
        imagem: "muryllo skibidi.jpg",
        raridade: "EPICA",
        classe: "epica",
        chance: 2.0,
        preco: 2.50
    },
    {
        nome: "O Inicio",
        imagem: "O inicio.jpg",
        raridade: "PRIMORDIAL",
        classe: "primordial",
        chance: 0.8,
        preco: 8.00
    },
    {
        nome: "Resenha Call",
        imagem: "resenha call.jpg",
        raridade: "LENDARIA",
        classe: "lendaria",
        chance: 1.0,
        preco: 8.00
    },
    {
        nome: "Xorume Muryllo",
        imagem: "xorume muryllo.jpg",
        raridade: "NOJO",
        classe: "nojo",
        chance: 3.0,
        preco: 1.50
    },
    {
        nome: "Juliano",
        imagem: "juliano.jpg",
        raridade: "ESPECIAL HEXA",
        classe: "especial-hexa",
        chance: 0.4,
        preco: 10.00
    },
    {
        nome: "Felipe",
        imagem: "felipe.jpg",
        raridade: "ESPECIAL HEXA",
        classe: "especial-hexa",
        chance: 0.4,
        preco: 10.00
    },
    {
        nome: "Daniel",
        imagem: "daniel.jpg",
        raridade: "ESPECIAL HEXA",
        classe: "especial-hexa",
        chance: 0.4,
        preco: 10.00
    }
];

let dinheiro = 100.00;
let jogoTravado = false;
let cartasGeradas = [];
let colecaoGlobal = {}; // Guarda o nome exato da chave (ex: "Gustavo Dancepot" ou "⭐ [SHINY] Gustavo Dancepot")

function sortearCarta() {
    let numero = Math.random() * 100;
    let acumulado = 0;
    let cartaSorteada = null;

    for (let carta of cartas) {
        acumulado += carta.chance;
        if (numero < acumulado) {
            cartaSorteada = { ...carta }; // Cria uma cópia da carta
            break;
        }
    }

    if (!cartaSorteada) {
        if (numero < 5) {
            cartaSorteada = {
                nome: "PERDEU OTARIO!",
                tipo: "armadilha",
                preco: 0
            };
        } else {
            cartaSorteada = {
                nome: "CARTA PAIA",
                tipo: "comum",
                preco: 0.50,
                raridade: "COMUM",
                classe: "comum"
            };
        }
    }

    // Chance de ser Shiny (ex: 10% de chance para qualquer carta ganha)
    let chanceShiny = Math.random() * 100;
    if (chanceShiny < 10 && !cartaSorteada.tipo) {
        cartaSorteada.isShiny = true;
        cartaSorteada.nomeOriginal = cartaSorteada.nome;
        cartaSorteada.nome = "⭐ " + cartaSorteada.nomeOriginal + " (Shiny)";
        cartaSorteada.preco = cartaSorteada.preco * 2; // Dobra o valor de venda
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

        if (carta.imagem.endsWith('.mp4')) {
            div.innerHTML = `
                <video src="/static/${encodeURIComponent(carta.imagem)}" autoplay loop muted></video>
                <strong>${carta.nome}</strong>
                <small>${carta.raridade}</small>
            `;
        } else {
            div.innerHTML = `
                <img src="/static/${encodeURIComponent(carta.imagem)}">
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
            "Tirou a armadilha e perdeu! Clique espaço para abrir outro booster.";

    } else {
        div.classList.add("comum");
        if (carta.isShiny) div.classList.add("shiny");
        div.innerHTML = `
            <strong>${carta.nome}</strong>
            <small>COMUM</small>
        `;
    }

    verificarFimDoBooster();
}

function abrirBooster() {
    if (dinheiro < 5.00) {
        document.getElementById("resultado").textContent = "Não tem dinheiro suficiente para abrir um booster (Custo: R$ 5,00)!";
        return;
    }

    dinheiro -= 5.00;

    const area = document.getElementById("cartas");
    area.innerHTML = "";

    cartasGeradas = [];
    jogoTravado = false;

    document.getElementById("resultado").textContent = "Revele as suas 7 cartas!";
    atualizarContadorVisual(0, 0);

    for (let i = 0; i < 7; i++) {
        let carta = sortearCarta();
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
            `Booster finalizado! Conseguiu ${especiais} carta(s) especial(is)! Clique espaço para abrir outro booster.`;
    }
}

// Funções do Álbum de Coleção (Mostra versão normal e versão Shiny separadamente no álbum)
function abrirAlbum() {
    const modal = document.getElementById("modal-album");
    const grid = document.getElementById("grid-album");
    grid.innerHTML = "";

    // Lista todas as cartas normais e gera também as versões Shiny correspondentes no álbum
    let listaCompletaAlbum = [];
    cartas.forEach(c => {
        // Versão Normal
        listaCompletaAlbum.push({ ...c });
        // Versão Shiny
        listaCompletaAlbum.push({
            ...c,
            nome: "⭐ " + c.nome + " (Shiny)",
            preco: c.preco * 2,
            isShiny: true,
            raridade: "SHINY " + c.raridade
        });
    });

    listaCompletaAlbum.forEach(carta => {
        let qtd = colecaoGlobal[carta.nome] || 0;
        let itemDiv = document.createElement("div");

        if (qtd > 0) {
            itemDiv.className = carta.isShiny ? "item-album shiny-borda" : "item-album";
            let mediaHtml = carta.imagem.endsWith('.mp4') ? 
                `<video src="/static/${encodeURIComponent(carta.imagem)}" autoplay loop muted></video>` :
                `<img src="/static/${encodeURIComponent(carta.imagem)}">`;

            itemDiv.innerHTML = `
                ${mediaHtml}
                <strong style="font-size: 10px; margin-top: 5px; color: ${carta.isShiny ? '#ffd700' : '#fff'};">${carta.nome}</strong>
                <small style="color: #00e5ff;">Qtd: x${qtd}</small>
                <button class="btn-vender" onclick="venderCarta('${carta.nome}')">Vender (R$ ${carta.preco.toFixed(2)})</button>
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

function venderCarta(nomeCarta) {
    if (colecaoGlobal[nomeCarta] && colecaoGlobal[nomeCarta] > 0) {
        colecaoGlobal[nomeCarta]--;
        
        // Descobre o preço da carta vendida
        let precoVenda = 0;
        cartas.forEach(c => {
            if (nomeCarta === c.nome) precoVenda = c.preco;
            if (nomeCarta === "⭐ " + c.nome + " (Shiny)") precoVenda = c.preco * 2;
        });

        dinheiro += precoVenda;
        atualizarContadorVisual(0, 0);
        abrirAlbum(); 
    }
}

window.onclick = function(event) {
    let modal = document.getElementById("modal-album");
    if (event.target === modal) {
        fecharAlbum();
    }
}

// Controlo via Teclado (Barra de Espaço)
document.addEventListener("keydown", function(event) {
    if (event.code === "Space" || event.key === " ") {
        if (document.getElementById("modal-album").style.display === "block") return;

        event.preventDefault();

        const divsCartas = document.querySelectorAll(".carta");

        if (divsCartas.length === 0) {
            abrirBooster();
            return;
        }

        let todasAbertas = Array.from(divsCartas).every(d => d.dataset.aberta === "sim");
        if (jogoTravado || todasAbertas) {
            abrirBooster();
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