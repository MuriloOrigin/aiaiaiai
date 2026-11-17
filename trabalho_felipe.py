from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import json
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jogo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelo de Base de Dados para os Utilizadores
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(80), unique=True, nullable=False)
    senha = db.Column(db.String(120), nullable=False)
    dinheiro = db.Column(db.Float, default=200.00)
    colecao = db.Column(db.Text, default="{}")       # Guardado em formato JSON string
    bloqueadas = db.Column(db.Text, default="{}")    # Guardado em formato JSON string

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('trabalho_felipe.html')

@app.route('/api/login', methods=['POST'])
def login():
    dados = request.get_json()
    nome = dados.get('usuario')
    senha = dados.get('senha')

    if not nome or not senha:
        return jsonify({'sucesso': False, 'mensagem': 'Preencha todos os campos!'})

    user = Usuario.query.filter_by(nome=nome).first()

    if user:
        if user.senha == senha:
            return jsonify({
                'sucesso': True,
                'dinheiro': user.dinheiro,
                'colecao': json.loads(user.colecao),
                'bloqueadas': json.loads(user.bloqueadas)
            })
        else:
            return jsonify({'sucesso': False, 'mensagem': 'Palavra-passe incorreta!'})
    else:
        # Se o utilizador não existir, cria uma conta nova automaticamente
        novo_user = Usuario(
            nome=nome,
            senha=senha,
            dinheiro=200.00,
            colecao=json.dumps({}),
            bloqueadas=json.dumps({})
        )
        db.session.add(novo_user)
        db.session.commit()
        return jsonify({
            'sucesso': True,
            'dinheiro': 200.00,
            'colecao': {},
            'bloqueadas': {}
        })

@app.route('/api/salvar', methods=['POST'])
def salvar():
    dados = request.get_json()
    return jsonify({'sucesso': True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)