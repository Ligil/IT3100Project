from flask import Flask
from flask import jsonify
from flask import request

import tensorflow as tf
import cv2
import numpy as np

app = Flask(__name__)

vgg16 = tf.keras.models.load_model("vgg16.h5")

@app.route("/predictImage", methods=["POST"])
def predictImage():

    filestream = request.files["file"].read()
    imgbytes = np.fromstring(filestream, np.uint8)
    img = cv2.imdecode(imgbytes, cv2.IMREAD_COLOR)

    img = cv2.resize(img, (224, 224))
    img = tf.keras.applications.vgg16.preprocess_input(img)
    img = img.reshape(1, 224, 224, 3)

    prediction = vgg16.predict(img)
    result = tf.keras.applications.vgg16.decode_predictions(prediction, top=3)

    return jsonify({
        "result" : [
            {"name": result[0][0][1], "score": float(result[0][0][2])},
            {"name": result[0][1][1], "score": float(result[0][1][2])},
            {"name": result[0][2][1], "score": float(result[0][2][2])},
        ]
    })


if __name__ == "__main__":
    app.run(debug=False)
    
    