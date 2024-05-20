from flask import Flask, request, render_template, jsonify
from flask.wrappers import Response
from flask_cors import CORS
import git  
from dotenv import load_dotenv
import os

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
    return 'Hello from Flask Chris!'

@app.route('/api/getarticles/')
def getArticles():
    return 'articles2'

# main driver function
if __name__ == '__main__':
    dev = os.getenv('DEVELOPMENT')
    if(dev == "True"):
        app.run()