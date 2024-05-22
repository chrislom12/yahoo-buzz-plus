# Yahoo Buzz+
An implementation of the news recommender system component for revamped Yahoo Buzz.

## Table of Contents
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Testing](#testing)
  - [Backend Tests](#backend-tests)
  - [Frontend Tests](#frontend-tests)

## Project Structure

```
yahoo-buzz-plus/
├── flask-backend/
│ ├── app.py
│ ├── shared.py
│ ├── recommendor.py
│ ├── requirements.txt
│ └── tests.py
├── yahoo-buzz-plus/
│ ├── src/
│ │ ├── app/
│ │ ├── assets/
│ │ └── index.html
│ ├── angular.json
│ ├── package.json
│ └── ...
├── .github/
│ ├── workflows/
│ │ └── ci.yml
└── README.md
```
## Setup Instructions

### Backend Setup

1. **Install Python dependencies:**

   ```sh
   cd flask-backend
   python -m pip install --upgrade pip
   pip install -r requirements.txt

2. **Environment Variables:**

   ```DEVELOPMENT=True```

3. **Run the Flask application:**

    ```sh
    python app.py
    ```

  
### Frontend Setup

1. **Prerequisites**

- Angular CLI
- Node.js

2. **Install dependences :**

   ```sh
   cd yahoo-buzz-plus
   npm install
    ```

3. **Run the Angular app:**

    ```sh
    ng serve
    ```

## Testing

### Frontend tests
 ```sh
    ng test
  ```

### Backend Tests
 ```sh
    pytest tests.py
  ```

### e2e Tests
 ```sh
    npm run cypress:run
```
