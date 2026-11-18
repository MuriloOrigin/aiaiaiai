
import os
import json
import hmac

from flask import Flask, render_template, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect, text


app = Flask(__name__)


# ==========================================
# CONFIGURAÇÕES DE SEGURANÇA
# ==========================================

# A chave precisa ser configurada na hospedagem.
CHAVE_SECRETA = os.environ.get("SECRET_KEY")

if not CHAVE_SECRETA:
    raise RuntimeError(
        "Configure a variável de ambiente SECRET_KEY antes de iniciar o jogo."
    )

app.config["SECRET_KEY"] = CHAVE_SECRETA

# Senha do botão administrativo.
# Não coloque essa senha diretamente no código público.
SENHA_ADMIN = os.environ.get("ADMIN_PASSWORD", "")


# ==========================================
# BANCO DE DADOS
# ==========================================

# No computador: SQLite.
# Na hospedagem: configure DATABASE_URL com
# a conexão do PostgreSQL permanente.

database_url = os.environ.get(
    "DATABASE_URL",
    "sqlite:///jogo.db"
)

# Compatibilidade com URLs antigas do PostgreSQL.
if database_url.startswith("postgres://"):
    database_url = database_url.replace(
        "postgres://",
        "postgresql://",
        1
    )

app.config["SQLALCHEMY_DATABASE_URI"] = database_url

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_pre_ping": True
}

db = SQLAlchemy(app)


# ==========================================
# TABELA DOS JOGADORES
# ==========================================

class Usuario(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    nome = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    senha = db.Column(
        db.String(100),
        nullable=False
    )

    dinheiro = db.Column(
        db.Float,
        default=200.00
    )

    colecao = db.Column(
        db.Text,
        default="{}"
    )

    bloqueadas = db.Column(
        db.Text,
        default="{}"
    )

    valores_cartas = db.Column(
        db.Text,
        default="{}"
    )

    cartas_separadas = db.Column(
        db.Text,
        default="{}"
    )


# ==========================================
# CONVERTER JSON
# ==========================================

def converter_json(valor):

    try:
        return json.loads(valor) if valor else {}

    except (json.JSONDecodeError, TypeError):
        return {}


# ==========================================
# REMOVER CARTA PAIA SHINY ANTIGA
# ==========================================

def remover_carta_paia_shiny(dados):

    if not isinstance(dados, dict):
        return {}

    dados = dados.copy()

    dados.pop(
        "⭐ CARTA PAIA (Shiny)",
        None
    )

    return dados


# ==========================================
# RESET ADMINISTRATIVO
# ==========================================

def resetar_todos_usuarios():

    # Esta função NÃO roda ao iniciar o servidor.
    # Só é chamada pela rota administrativa.

    usuarios = Usuario.query.all()

    for usuario in usuarios:

        usuario.dinheiro = 200.00

        usuario.colecao = "{}"

        usuario.bloqueadas = "{}"

        usuario.valores_cartas = "{}"

        usuario.cartas_separadas = "{}"

    db.session.commit()

    print(
        f"\n{len(usuarios)} jogadores foram reiniciados!"
    )

    return len(usuarios)


# ==========================================
# PÁGINA PRINCIPAL
# ==========================================

@app.route("/")
def inicio():

    return render_template(
        "trabalho_felipe.html"
    )


# ==========================================
# LOGIN E REGISTRO
# ==========================================

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

    usuario = Usuario.query.filter_by(
        nome=nome
    ).first()

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
            dinheiro=200.00,
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

    usuario.valores_cartas = json.dumps(
        valores_cartas
    )

    usuario.cartas_separadas = json.dumps(
        cartas_separadas
    )

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


# ==========================================
# SALVAR PROGRESSO
# ==========================================

@app.route("/api/salvar", methods=["POST"])
def salvar():

    if "usuario_id" not in session:

        return jsonify({
            "sucesso": False,
            "mensagem": "Usuário não está conectado."
        }), 401

    usuario = db.session.get(
        Usuario,
        session["usuario_id"]
    )

    if not usuario:

        return jsonify({
            "sucesso": False,
            "mensagem": "Usuário não encontrado."
        }), 404

    dados = request.get_json(silent=True) or {}

    # Salva o dinheiro atual do jogador.
    usuario.dinheiro = dados.get(
        "dinheiro",
        usuario.dinheiro
    )

    # Salva as cartas da coleção.
    colecao = remover_carta_paia_shiny(
        dados.get(
            "colecao",
            converter_json(usuario.colecao)
        )
    )

    # Salva as cartas bloqueadas.
    bloqueadas = remover_carta_paia_shiny(
        dados.get(
            "bloqueadas",
            converter_json(usuario.bloqueadas)
        )
    )

    # Salva os multiplicadores das cartas.
    valores_cartas = remover_carta_paia_shiny(
        dados.get(
            "valoresCartas",
            converter_json(usuario.valores_cartas)
        )
    )

    # Salva as cartas premiadas na roleta.
    cartas_separadas = remover_carta_paia_shiny(
        dados.get(
            "cartasSeparadas",
            converter_json(usuario.cartas_separadas)
        )
    )

    usuario.colecao = json.dumps(
        colecao
    )

    usuario.bloqueadas = json.dumps(
        bloqueadas
    )

    usuario.valores_cartas = json.dumps(
        valores_cartas
    )

    usuario.cartas_separadas = json.dumps(
        cartas_separadas
    )

    db.session.commit()

    return jsonify({
        "sucesso": True,
        "mensagem": "Progresso salvo com sucesso!"
    })


# ==========================================
# BOTÃO ADMINISTRATIVO
# ==========================================

@app.route(
    "/api/admin/resetar",
    methods=["POST"]
)
def resetar_jogo():

    if not SENHA_ADMIN:

        return jsonify({
            "sucesso": False,
            "mensagem": "Senha administrativa não configurada."
        }), 503

    dados = request.get_json(silent=True) or {}

    senha_digitada = str(
        dados.get("senha", "")
    )

    if not hmac.compare_digest(
        senha_digitada,
        SENHA_ADMIN
    ):

        return jsonify({
            "sucesso": False,
            "mensagem": "Senha administrativa incorreta."
        }), 403

    quantidade = resetar_todos_usuarios()

    return jsonify({
        "sucesso": True,
        "mensagem": "Todos os jogadores foram reiniciados!",
        "jogadores": quantidade
    })


# ==========================================
# LOGOUT
# ==========================================

@app.route("/api/logout", methods=["POST"])
def logout():

    session.clear()

    return jsonify({
        "sucesso": True
    })


# ==========================================
# INICIALIZAR BANCO
# ==========================================

def inicializar_banco():

    with app.app_context():

        # Cria tabelas somente se não existirem.
        # NÃO apaga jogadores ou progresso.

        db.create_all()

        colunas = [
            coluna["name"]
            for coluna in inspect(
                db.engine
            ).get_columns("usuario")
        ]

        # Compatibilidade com bancos antigos.

        if "valores_cartas" not in colunas:

            with db.engine.begin() as conexao:

                conexao.execute(
                    text(
                        "ALTER TABLE usuario "
                        "ADD COLUMN valores_cartas "
                        "TEXT DEFAULT '{}'"
                    )
                )

        if "cartas_separadas" not in colunas:

            with db.engine.begin() as conexao:

                conexao.execute(
                    text(
                        "ALTER TABLE usuario "
                        "ADD COLUMN cartas_separadas "
                        "TEXT DEFAULT '{}'"
                    )
                )

        print(
            "\nBanco de dados inicializado sem apagar o progresso."
        )


# Inicializa também quando a hospedagem usa Gunicorn.
inicializar_banco()


# ==========================================
# INICIAR SERVIDOR
# ==========================================

if __name__ == "__main__":

    # Não existe reset automático aqui.

    app.run(
        debug=True
    )
