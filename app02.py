from flask import Flask
from flask import jsonify
from flask import request

app = Flask(__name__)

@app.route("/addTwoNumbers", methods=["POST"])
def addTwoNumbers():
    input = request.get_json()

    result = input["a"] + input["b"]

    return jsonify({ "result" : result })

if __name__ == "__main__":
    app.run(debug=False)