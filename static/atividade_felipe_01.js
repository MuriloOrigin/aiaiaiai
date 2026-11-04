
const cartas = [
    ["Skibidi", "b_apresentação skibidi.jpg"],
    ["Daniel", "daniel.jpg"],
    ["Felipe", "felipe.jpg"],
    ["Gustavo Frigideira", "gustavo frigideira.jpg"],
    ["Juliano", "juliano.jpg"],
    ["Muryllo Lutando", "muryllo lutando.jpg"],
    ["Resenha Midas", "resenha midas.jpg"],
    ["Xorume Muryllo", "xorume muryllo.jpg"]
];

function abrirBooster() {
    const area = document.getElementById("cartas");

    area.innerHTML = "";

    let especiais = 0;
    let reveladas = 0;

    document.getElementById("resultado").textContent =
        "Revele suas 7 cartas!";

    for (let i = 0; i < 7; i++) {

        let n = Math.random() * 100;

        let especial = n < 10;
        let armadilha = n >= 10 && n < 12;

        let carta = especial
            ? cartas[Math.floor(Math.random() * 8)]
            : armadilha
            ? ["PERDEU OTÁRIO!", ""]
            : ["Carta Comum", ""];

        let div = document.createElement("div");

        div.className = "carta";

        div.innerHTML = `
            <div class="verso">?</div>
            <strong>CARTA ${i + 1}</strong>
        `;

        div.onclick = function () {

            if (div.dataset.aberta) return;

            div.dataset.aberta = "sim";
            reveladas++;

            if (especial) {
                especiais++;

                div.classList.add("especial");

                div.innerHTML = `
                    <img src="${carta[1]}">
                    <strong>${carta[0]}</strong>
                    <small style="color:gold">★ CARTA DE CUIUDO ★</small>
                `;

            } else if (armadilha) {

                div.classList.add("armadilha");

                div.innerHTML = `
                    <strong>its over</strong>
                `;

                let fala = new SpeechSynthesisUtterance(
                    "PERDEU, OTÁRIO!"
                );

                fala.lang = "pt-BR";
                speechSynthesis.cancel();
                speechSynthesis.speak(fala);

            } else {

                div.innerHTML = `
                    <strong>carta paia</strong>
                `;
            }

            if (reveladas === 7) {
                document.getElementById("resultado").textContent =
                    `Booster finalizado! Você conseguiu ${especiais} carta(s) especial(is)!`;
            }
        };

        area.appendChild(div);
    }
}