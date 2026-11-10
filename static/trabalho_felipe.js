const cartas = [
    {
        nome: "Gustavo Dancepot",
        imagem: "gustavodancepot.mp4",
        raridade: "DANCE POTRANCA",
        classe: "dance-potranca",
        chance: 0.3
    },
    {
        nome: "Elefante Africano",
        imagem: "elefantebe.jpg",
        raridade: "TRANSFICANO",
        classe: "transficano",
        chance: 1.0
    },
    {
        nome: "Gustavo Tartarugas Ninjas",
        imagem: "gustavo tartarugas ninjas.jpg",
        raridade: "SECRETA",
        classe: "secreta",
        chance: 0.5
    },
    {
        nome: "Muryllo Apanhando",
        imagem: "muryllo apanhando.jpg",
        raridade: "ULTRA RARA",
        classe: "ultra-rara",
        chance: 1.5
    },
    {
        nome: "Muryllo Skibidi",
        imagem: "muryllo skibidi.jpg",
        raridade: "EPICA",
        classe: "epica",
        chance: 2
    },
    {
        nome: "O Inicio",
        imagem: "O inicio.jpg",
        raridade: "PRIMORDIAL",
        classe: "primordial",
        chance: 0.8
    },
    {
        nome: "Resenha Call",
        imagem: "resenha call.jpg",
        raridade: "LENDARIA",
        classe: "lendaria",
        chance: 1
    },
    {
        nome: "Xorume Muryllo",
        imagem: "xorume muryllo.jpg",
        raridade: "NOJO",
        classe: "nojo",
        chance: 3
    },
    {
        nome: "Juliano",
        imagem: "juliano.jpg",
        raridade: "ESPECIAL HEXA",
        classe: "especial-hexa",
        chance: 0.4
    },
    {
        nome: "Felipe",
        imagem: "felipe.jpg",
        raridade: "ESPECIAL HEXA",
        classe: "especial-hexa",
        chance: 0.4
    },
    {
        nome: "Daniel",
        imagem: "daniel.jpg",
        raridade: "ESPECIAL HEXA",
        classe: "especial-hexa",
        chance: 0.4
    }
];

let jogoTravado = false;
let cartasGeradas = [];
let colecaoGlobal = {};

function sortearCarta() {
    let numero = Math.random() * 100;
    let acumulado = 0;

    for (let carta of cartas) {
        acumulado += carta.chance;
        if (numero < acumulado) {
            return carta;
        }
    }

    if (numero < 5) {
        return {
            nome: "PERDEU OTARIO!",
            tipo: "armadilha"
        };
    }

    return {
        nome: "CARTA PAIA",
        tipo: "comum"
    };
}

function atualizarContadorVisual(reveladas, especiais) {
    document.getElementById("contador-abertas").textContent = `${reveladas}/7`;
    document.getElementById("contador-especiais").textContent = especiais;
    
    const listaDiv = document.getElementById("lista-colecao");
    listaDiv.innerHTML = "";

    const chaves = Object.keys(colecaoGlobal);
    if (chaves.length === 0) {
        listaDiv.innerHTML = `<span style="font-size: 11px; color: #888; display: block; text-align: center;">Nenhuma carta ainda</span>`;
        return;
    }

    for (let [nome, qtd] of Object.entries(colecaoGlobal)) {
        let divItem = document.createElement("div");
        divItem.className = "item-colecao";
        divItem.innerHTML = `<span>${nome}</span> <b>x${qtd}</b>`;
        listaDiv.appendChild(divItem);
    }
}

function revelarCartaNoElemento(div, carta) {
    if (div.dataset.aberta === "sim") return;
    
    div.dataset.aberta = "sim";

    let nomeCarta = carta.nome;
    colecaoGlobal[nomeCarta] = (colecaoGlobal[nomeCarta] || 0) + 1;

    if (carta.raridade) {
        div.classList.add(carta.classe);

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
        div.innerHTML = `
            <strong>CARTA PAIA</strong>
            <small>COMUM</small>
        `;
    }

    verificarFimDoBooster();
}

function abrirBooster() {
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

// Controlo via Teclado (Barra de Espaço) com funcionamento garantido
document.addEventListener("keydown", function(event) {
    if (event.code === "Space" || event.key === " ") {
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