from flask import Flask, request, render_template, jsonify
from flask.wrappers import Response
import git  


app = Flask(__name__)

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