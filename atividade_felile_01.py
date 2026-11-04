from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def inicio():
    return render_template("atividade_felipe_01.html")

if __name__ == "__main__":
    app.run(debug=True)
