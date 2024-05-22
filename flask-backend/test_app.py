import unittest
from flask import Flask
from flask.testing import FlaskClient
import app  # Assuming your Flask app code is in a file named app.py

class FlaskAppTestCase(unittest.TestCase):
    def setUp(self):
        # Set up the Flask test client
        app.app.config['TESTING'] = True
        self.client: FlaskClient = app.app.test_client()

    def test_hello_world(self):
        # Test the / route
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode('utf-8'), 'Welcome to my API')

if __name__ == '__main__':
    unittest.main()
