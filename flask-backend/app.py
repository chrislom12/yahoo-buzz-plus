import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import git  
from dotenv import load_dotenv
import os

import recommendor
from shared import cosine_similarities, ds  # Import from shared.py
import misinformation


load_dotenv()

app = Flask(__name__)
CORS(app)

# Route for the GitHub webhook
@app.route('/git_update', methods=['POST'])
def git_update():
    repo = git.Repo('./yahoo-buzz-plus')
    origin = repo.remotes.origin
    repo.create_head('main',
                     origin.refs.main).set_tracking_branch(origin.refs.main).checkout()
    origin.pull()
    return '', 200

@app.route('/')
def hello_world():
    return 'Welcome to my API'

@app.route('/api/getArticles/')
def getArticles():
    random_articles = ds.sample(n=10).to_dict(orient='records')
    return jsonify(random_articles)

@app.route('/api/recommend/', methods=['POST'])
def getRecommendations():
    feedback = request.json
    results = recommendor.runRecommendations(feedback)
    return jsonify(json.loads(results))

@app.route('/api/detectMisinformation/', methods=['POST'])
def detectMisinformation():
    if not request.is_json:
        return jsonify({"error": "Invalid input, JSON expected"}), 400

    data = request.get_json()
    text = data.get('text')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = misinformation.predict_news_title(text)

    return jsonify({"prediction": result})


# main driver function
if __name__ == '__main__':
    dev = os.getenv('DEVELOPMENT')
    if dev == "True" or dev is None:
        port = int(os.environ.get("PORT", 5000))
        app.run(port=port)