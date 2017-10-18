from flask import Flask, render_template, request, jsonify
from webapp.utils import snakify_keys
import yaml
from timechop.timechop import Timechop
from datetime import datetime

# Create app
app = Flask(__name__)
with open('flask_config.yaml') as f:
    config = yaml.load(f)
    for key, val in config.items():
        app.config[key] = val


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def home(path):
    return render_template('index.html')


@app.route('/matrices.json', methods=['POST'])
def matrices():
    timechop_config = snakify_keys(request.get_json())
    for datetime_key in ['feature_start_time', 'feature_end_time', 'label_start_time', 'label_end_time']:
        timechop_config[datetime_key] = datetime.strptime(timechop_config[datetime_key], '%Y-%m-%d')
    try:
        chopper = Timechop(**timechop_config)
        results = chopper.chop_time()
        return jsonify(data=results, error='')
    except Exception as e:
        return jsonify(data=[], error=str(e))


if __name__ == '__main__':
    app.run()
