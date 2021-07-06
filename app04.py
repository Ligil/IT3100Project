from flask import Flask
from flask import jsonify
from flask import request

import tensorflow as tf
import cv2
import numpy as np

app = Flask(__name__)

model = tf.keras.models.load_model("irisclassifier.h5")

@app.route("/classifyIris", methods=["POST"])
def classifyIris():

    input = request.get_json()

    target = ["Iris-setosa", "Iris-versicolor", "Iris-virginica"]

    sepalLength = input["sepalLength"]
    sepalWidth = input["sepalWidth"]    
    petalLength = input["petalLength"]
    petalWidth = input["petalWidth"]     

    result = model.predict([[sepalLength, sepalWidth, petalLength, petalWidth]])    

    return jsonify({ "result" : target[np.argmax(result[0])] })

if __name__ == "__main__":
    app.run(debug=False)
    