from flask import Flask, render_template, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
import json
import os

app = Flask(__name__)

app.config["SECRET_KEY"] = "chave-secreta-do-jogo"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///jogo.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(100), nullable=False)

    dinheiro = db.Column(db.Float, default=200)

    colecao = db.Column(db.Text, default="{}")
    bloqueadas = db.Column(db.Text, default="{}")

    # Multiplicadores de valor das cartas
    valores_cartas = db.Column(db.Text, default="{}")


def converter_json(valor):
    try:
        return json.loads(valor) if valor else {}
    except (json.JSONDecodeError, TypeError):
        return {}


@app.route("/")
def inicio():
    return render_template("trabalho_felipe.html")

@app.route("/api/login", methods=["POST"])
def login():
    dados = request.get_json()

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
            valores_cartas="{}"
        )

        db.session.add(usuario)
        db.session.commit()

    session["usuario_id"] = usuario.id

    return jsonify({
        "sucesso": True,
        "nome": usuario.nome,
        "dinheiro": usuario.dinheiro,
        "colecao": converter_json(usuario.colecao),
        "bloqueadas": converter_json(usuario.bloqueadas),
        "valoresCartas": converter_json(usuario.valores_cartas)
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

    dados = request.get_json()

    usuario.dinheiro = dados.get("dinheiro", usuario.dinheiro)
    usuario.colecao = json.dumps(dados.get("colecao", {}))
    usuario.bloqueadas = json.dumps(dados.get("bloqueadas", {}))
    usuario.valores_cartas = json.dumps(
        dados.get("valoresCartas", converter_json(usuario.valores_cartas))
    )

    db.session.commit()

    return jsonify({
        "sucesso": True,
        "mensagem": "Dados salvos!"
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

        # Adiciona a coluna em bancos antigos, caso ainda não exista
        from sqlalchemy import inspect, text

        colunas = [
            coluna["name"]
            for coluna in inspect(db.engine).get_columns("usuario")
        ]

        if "valores_cartas" not in colunas:
            with db.engine.begin() as conexao:
                conexao.execute(text(
                    'ALTER TABLE usuario ADD COLUMN valores_cartas TEXT DEFAULT "{}"'
                ))

    app.run(debug=True)
