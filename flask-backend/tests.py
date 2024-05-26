import pytest
from flask import Flask, request, jsonify
from flask.testing import FlaskClient
from app import app
import json
import json
from recommendor import aggregateRecommendation, recommendation, runRecommendations
from shared import ds, cosine_similarities
import misinformation

# ======================
# UNIT TESTS
# ======================

@pytest.fixture
def client():
    # Set up the Flask test client
    app.config['TESTING'] = True
    client = app.test_client()
    return client

def test_hello_world(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.data.decode('utf-8') == 'Welcome to my API'

def test_git_update(client, mocker):
    mock_repo = mocker.Mock()
    mock_origin = mocker.Mock()
    mock_head = mocker.Mock()

    mock_repo.remotes.origin = mock_origin
    mock_repo.create_head.return_value = mock_head
    mock_origin.refs.main = mocker.Mock()

    mocker.patch('app.git.Repo', return_value=mock_repo)

    response = client.post('/git_update')
    assert response.status_code == 200
    mock_repo.create_head.assert_called_with('main', mock_origin.refs.main)
    mock_head.set_tracking_branch.assert_called_with(mock_origin.refs.main)
    mock_origin.pull.assert_called_once()

def test_get_articles(client, mocker):
    mock_ds = mocker.patch('app.ds.sample')
    mock_ds.return_value.to_dict.return_value = [{'title': 'Test Article'}]

    response = client.get('/api/getArticles/')
    assert response.status_code == 200
    assert response.json == [{'title': 'Test Article'}]

def test_get_recommendations(client, mocker):
    mock_run_recommendations = mocker.patch('app.recommendor.runRecommendations')
    mock_results = [{'title': 'Recommended Article'}]
    mock_run_recommendations.return_value = json.dumps(mock_results)

    response = client.post('/api/recommend/', json={'recommendations': [{'idx': 1, 'like': True}]})

    assert response.status_code == 200
    assert response.json == mock_results 

@pytest.fixture
def mock_ds(mocker):
    mocker.patch('shared.ds', return_value=ds)

@pytest.fixture
def mock_cosine_similarities(mocker):
    mocker.patch('shared.cosine_similarities', return_value=cosine_similarities)

def test_aggregate_recommendation(mock_ds):
    total_similarity_scores = {0: 1.5, 1: 0.8}
    result = aggregateRecommendation(total_similarity_scores)
    articles = json.loads(result)
    assert len(articles) == 2
    assert articles[0]['title'] == ds['title'].iloc[0]
    assert articles[1]['title'] == ds['title'].iloc[1]

def test_recommendation_like(mock_cosine_similarities):
    idx = 0
    like = True
    total_similarity_scores = {i: 0 for i in range(len(ds))}
    updated_scores = recommendation(idx, like, total_similarity_scores)
    assert updated_scores[idx] == 0 
    assert all(score >= 0 for score in updated_scores.values())

def test_recommendation_dislike(mock_cosine_similarities):
    idx = 0
    like = False
    total_similarity_scores = {i: 0 for i in range(len(ds))}
    updated_scores = recommendation(idx, like, total_similarity_scores)
    assert updated_scores[idx] == 0 
    assert all(score <= 0 for score in updated_scores.values())

def test_run_recommendations(mocker, mock_ds, mock_cosine_similarities):
    feedback = {'recommendations': [{'idx': 0, 'like': True}, {'idx': 1, 'like': False}]}
    mock_aggregate = mocker.patch('recommendor.aggregateRecommendation', return_value='[{"title": "Test"}]')
    result = runRecommendations(feedback)
    assert json.loads(result) == [{'title': 'Test'}]
    mock_aggregate.assert_called_once()

def test_predict_news_title_valid():
    title = "The stock market is experiencing unprecedented growth."
    prediction = misinformation.predict_news_title(title)
    assert prediction in ['FAKE', 'REAL']

def test_detect_misinformation(client, mocker):
    test_article = "The stock market is experiencing unprecedented growth."

    mock_predict = mocker.patch('misinformation.predict_news_title')
    mock_predict.return_value = 'REAL'

    response = client.post('/api/detectMisinformation/', json={'text': test_article})

    assert response.status_code == 200
    assert response.content_type == 'application/json'
    assert response.json == 'REAL'


# ======================
# INTEGRATION TESTS
# ======================

def test_get_root(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.data.decode('utf-8') == 'Welcome to my API'

def test_get_articles(client):
    response = client.get('/api/getArticles/')
    assert response.status_code == 200
    assert response.content_type == 'application/json'

def test_post_recommendations(client):
    feedback = {'recommendations': [{'idx': 1, 'like': True}]}
    response = client.post('/api/recommend/', json=feedback)
    assert response.status_code == 200
    assert response.content_type == 'application/json'

def test_detect_misinformation(client):
    test_article = "The stock market is experiencing unprecedented growth."

    response = client.post('/api/detectMisinformation/', json={'text': test_article})

    assert response.status_code == 200
    assert response.content_type == 'application/json'
    assert response.json['prediction'] in ['REAL', 'FAKE']


