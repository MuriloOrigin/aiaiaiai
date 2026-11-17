
from flask import Flask, render_template, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect, text
import json
import hmac

app = Flask(__name__)

app.config["SECRET_KEY"] = "chave-secreta-do-jogo"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///jogo.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# SENHA ADMINISTRATIVA
SENHA_ADMIN = "GOAT7124"


class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(100), nullable=False)

    dinheiro = db.Column(db.Float, default=200)

    colecao = db.Column(db.Text, default="{}")
    bloqueadas = db.Column(db.Text, default="{}")
    valores_cartas = db.Column(db.Text, default="{}")
    cartas_separadas = db.Column(db.Text, default="{}")


def converter_json(valor):
    try:
        return json.loads(valor) if valor else {}
    except (json.JSONDecodeError, TypeError):
        return {}


def remover_carta_paia_shiny(dados):
    """Remove somente a antiga CARTA PAIA Shiny."""

    if not isinstance(dados, dict):
        return {}

    dados = dados.copy()
    dados.pop("⭐ CARTA PAIA (Shiny)", None)

    return dados


def resetar_todos_usuarios():
    """Reinicia o progresso de todos os jogadores."""

    usuarios = Usuario.query.all()

    for usuario in usuarios:
        usuario.dinheiro = 200.00
        usuario.colecao = "{}"
        usuario.bloqueadas = "{}"
        usuario.valores_cartas = "{}"
        usuario.cartas_separadas = "{}"

    db.session.commit()

    print(f"\n{len(usuarios)} jogadores foram resetados!")
    print("Todos começaram novamente com R$ 200,00.\n")

    return len(usuarios)


@app.route("/")
def inicio():
    return render_template("trabalho_felipe.html")


@app.route("/api/login", methods=["POST"])
def login():
    dados = request.get_json(silent=True) or {}

    nome = dados.get("nome")
    senha = dados.get("senha")

    if not nome or not senha:
        return jsonify({
            "sucesso": False,
            "mensagem": "Preencha o nome e a senha."
        }), 400

    usuario = Usuario.query.filter_by(nome=nome).first()

    if usuario:
        if usuario.senha != senha:
            return jsonify({
                "sucesso": False,
                "mensagem": "Senha incorreta."
            }), 401
    else:
        usuario = Usuario(
            nome=nome,
            senha=senha,
            dinheiro=200,
            colecao="{}",
            bloqueadas="{}",
            valores_cartas="{}",
            cartas_separadas="{}"
        )

        db.session.add(usuario)
        db.session.commit()

    session["usuario_id"] = usuario.id

    colecao = remover_carta_paia_shiny(
        converter_json(usuario.colecao)
    )

    bloqueadas = remover_carta_paia_shiny(
        converter_json(usuario.bloqueadas)
    )

    valores_cartas = remover_carta_paia_shiny(
        converter_json(usuario.valores_cartas)
    )

    cartas_separadas = remover_carta_paia_shiny(
        converter_json(usuario.cartas_separadas)
    )

    usuario.colecao = json.dumps(colecao)
    usuario.bloqueadas = json.dumps(bloqueadas)
    usuario.valores_cartas = json.dumps(valores_cartas)
    usuario.cartas_separadas = json.dumps(cartas_separadas)

    db.session.commit()

    return jsonify({
        "sucesso": True,
        "nome": usuario.nome,
        "dinheiro": usuario.dinheiro,
        "colecao": colecao,
        "bloqueadas": bloqueadas,
        "valoresCartas": valores_cartas,
        "cartasSeparadas": cartas_separadas
    })


@app.route("/api/salvar", methods=["POST"])
def salvar():
    if "usuario_id" not in session:
        return jsonify({
            "sucesso": False,
            "mensagem": "Usuário não está conectado."
        }), 401

    usuario = db.session.get(Usuario, session["usuario_id"])

    if not usuario:
        return jsonify({
            "sucesso": False,
            "mensagem": "Usuário não encontrado."
        }), 404

    dados = request.get_json(silent=True) or {}

    usuario.dinheiro = dados.get(
        "dinheiro",
        usuario.dinheiro
    )

    colecao = remover_carta_paia_shiny(
        dados.get("colecao", converter_json(usuario.colecao))
    )

    bloqueadas = remover_carta_paia_shiny(
        dados.get("bloqueadas", converter_json(usuario.bloqueadas))
    )

    valores_cartas = remover_carta_paia_shiny(
        dados.get("valoresCartas", converter_json(usuario.valores_cartas))
    )

    cartas_separadas = remover_carta_paia_shiny(
        dados.get("cartasSeparadas", converter_json(usuario.cartas_separadas))
    )

    usuario.colecao = json.dumps(colecao)
    usuario.bloqueadas = json.dumps(bloqueadas)
    usuario.valores_cartas = json.dumps(valores_cartas)
    usuario.cartas_separadas = json.dumps(cartas_separadas)

    db.session.commit()

    return jsonify({
        "sucesso": True,
        "mensagem": "Dados salvos!"
    })


# ROTA ADMINISTRATIVA
@app.route("/api/admin/resetar", methods=["POST"])
def resetar_jogo():
    dados = request.get_json(silent=True) or {}

    senha_digitada = str(dados.get("senha", ""))

    if not hmac.compare_digest(senha_digitada, SENHA_ADMIN):
        return jsonify({
            "sucesso": False,
            "mensagem": "Senha administrativa incorreta."
        }), 403

    quantidade = resetar_todos_usuarios()

    return jsonify({
        "sucesso": True,
        "mensagem": "Todos os jogadores foram resetados!",
        "jogadores": quantidade
    })


@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()

    return jsonify({
        "sucesso": True
    })


if __name__ == "__main__":

    with app.app_context():

        db.create_all()

        colunas = [
            coluna["name"]
            for coluna in inspect(db.engine).get_columns("usuario")
        ]

        if "valores_cartas" not in colunas:
            with db.engine.begin() as conexao:
                conexao.execute(text(
                    'ALTER TABLE usuario ADD COLUMN valores_cartas TEXT DEFAULT "{}"'
                ))

        if "cartas_separadas" not in colunas:
            with db.engine.begin() as conexao:
                conexao.execute(text(
                    'ALTER TABLE usuario ADD COLUMN cartas_separadas TEXT DEFAULT "{}"'
                ))

    # NÃO REINICIA OS JOGADORES AO INICIAR O SERVIDOR!

    app.run(debug=True)
