from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello world to everyone from IT3100"

if __name__ == "__main__":
    app.run(debug=False)


