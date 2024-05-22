import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import git  
from dotenv import load_dotenv
import os

import recommendor
from shared import cosine_similarities, ds  # Import from shared.py


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

""" @app.route('/api/recommend/', methods=['POST'])
def getRecommendations():
    feedback = request.json
    results = recommendor.runRecommendations(feedback)
    return results """

@app.route('/api/recommend/', methods=['POST'])
def getRecommendations():
    feedback = request.json
    results = recommendor.runRecommendations(feedback)
    return jsonify(json.loads(results))

# main driver function
if __name__ == '__main__':
    dev = os.getenv('DEVELOPMENT')
    prod = os.getenv('PRODUCTION')
    print("running")
    if dev == "True" or dev is None:
        print("dev is true")
        port = int(os.environ.get("PORT", 5000))
        print("port")
        app.run(port=port)
        with open(os.environ['GITHUB_OUTPUT'], 'a') as fh:
            print(f'running on {port}', file=fh)
            print(f"App is running on port {port}")
    else:
        print("dev not true")