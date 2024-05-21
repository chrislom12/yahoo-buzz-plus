from flask import Flask, request, render_template, jsonify
from flask.wrappers import Response
from flask_cors import CORS
import git  
from dotenv import load_dotenv
import os

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import json

import recommendor


load_dotenv()


app = Flask(__name__)
CORS(app)

ds = pd.read_csv('cleaned_data.csv')

tf = TfidfVectorizer(analyzer='word',stop_words='english',max_df=0.8,min_df=0.0,use_idf=True,ngram_range=(1,3))
tfidf_matrix = tf.fit_transform(ds['cleaned_desc'])



cosine_similarities = linear_kernel(tfidf_matrix, tfidf_matrix)

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
    # Convert the dictionary to a JSON string
    json_data = json.dumps(random_articles, indent=4)

    print(json_data)
    return jsonify(random_articles)

@app.route('/api/test/')
def test():
    test = '''{"name": "here"}'''
    return jsonify(test)

@app.route('/api/recommend/', methods=['POST'])
def getRecommendations():
    feedback = request.json
    results = recommendor.runRecommendations(feedback)
    return results

# main driver function
if __name__ == '__main__':
    dev = os.getenv('DEVELOPMENT')
    if(dev == "True"):
        app.run()