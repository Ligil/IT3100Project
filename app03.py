from flask import Flask
from flask import jsonify
from flask import request

from joblib import dump, load

app = Flask(__name__)

classifier = load("irisclassifier.joblib")

@app.route("/classifyIris", methods=["POST"])
def classifyIris():
    input = request.get_json()

    target = ["Iris-setosa", "Iris-versicolor", "Iris-virginica"]

    sepalLength = input["sepalLength"]
    sepalWidth = input["sepalWidth"]    
    petalLength = input["petalLength"]
    petalWidth = input["petalWidth"]        

    result = classifier.predict([[sepalLength, sepalWidth, petalLength, petalWidth]])

    return jsonify({ "result" : target[result[0]] })

if __name__ == "__main__":
    app.run(debug=False)