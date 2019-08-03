import shutil
import traceback
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from keras.models import model_from_json
import json
from werkzeug.utils import secure_filename
import os
import uuid

from utils import utils

app = Flask(__name__)
CORS(app)

utils.init()

@app.route('/', methods=['GET'])
def index():
  return jsonify({'Welcome': 'That worked'})

@app.route('/api/upload', methods=['POST'])
def upload():
    print('Data received')
    name = request.form['name']
    details = request.form['details']
    data = {'name': [name], 'details': [details]}
    input_df =pd.DataFrame(data=data)
    result = utils.predict(input_df)
    return jsonify({'result': result})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
