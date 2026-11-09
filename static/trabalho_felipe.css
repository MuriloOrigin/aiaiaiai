const cartas = [
    {
        nome: "Gustavo Dancepot",
        imagem: "gustavodancepot.mp4",
        raridade: "DANCE POTRANCA",
        classe: "dance-potranca",
        chance: 0.3
    },
    {
        nome: "Elefantebe",
        imagem: "elefantebe.jpg",
        raridade: "PESO",
        classe: "peso",
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

function sortearCarta() {
    let numero = Math.random() * 100;
    let acumulado = 0;

    for (let carta of cartas) {
        acumulado += carta.chance;
        if (numero < acumulado) {
            return carta;
        }
    }

    if (numero < 12) {
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

function abrirBooster() {
    const area = document.getElementById("cartas");
    area.innerHTML = "";

    let especiais = 0;
    let reveladas = 0;
    jogoTravado = false;

    document.getElementById("resultado").textContent = "Revele as suas 7 cartas!";

    for (let i = 0; i < 7; i++) {
        let carta = sortearCarta();
        let div = document.createElement("div");

        div.className = "carta";
        div.innerHTML = `
            <div class="verso">?</div>
            <strong>CARTA ${i + 1}</strong>
        `;

        div.onclick = function () {
            if (jogoTravado || div.dataset.aberta) return;

            div.dataset.aberta = "sim";
            reveladas++;

            if (carta.raridade) {
                especiais++;
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
                    "Tirou a armadilha e perdeu! Clique em 'Abrir Booster' para tentar novamente.";

                return;

            } else {
                div.classList.add("comum");

                div.innerHTML = `
                    <strong>CARTA PAIA</strong>
                    <small>COMUM</small>
                `;
            }

            if (reveladas === 7) {
                document.getElementById("resultado").textContent =
                    `Booster finalizado! Conseguiu ${especiais} carta(s) especial(is)!`;
            }
        };

        area.appendChild(div);
    }
}