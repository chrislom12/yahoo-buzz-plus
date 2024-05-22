import pytest
from flask import Flask
from flask.testing import FlaskClient
from app import app  # Assuming your Flask app code is in a file named app.py

@pytest.fixture
def client():
    # Set up the Flask test client
    app.config['TESTING'] = True
    client = app.test_client()
    return client

def test_hello_world(client):
    # Test the / route
    response = client.get('/')
    assert response.status_code == 200
    assert response.data.decode('utf-8') == 'Welcome to my API'