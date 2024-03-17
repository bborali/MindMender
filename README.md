# MindMender: A Voice-Enabled Mental Health Assistant

## Description

![Screenshot 2024-03-17 at 3 04 24 PM](https://github.com/bborali/MindMender/assets/59167619/e6c05ef7-a677-46a8-b55d-5fbf6d662c63)

MindMender is a conversational assistant designed to support mental well-being through empathetic dialogue. It utilizes OpenAI's GPT technology to engage users in a text-based conversation, providing responses that are supportive and compassionate. The application consists of a React.js frontend and a Flask backend.

## Getting Started

### Prerequisites

Before starting, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (which comes with npm)
- [Python](https://www.python.org/) (version 3.7 or higher)
- pip (Python package installer, typically comes with Python)

### Backend Setup

1. Navigate to the backend directory:

```cd <your-backend-directory>```

2. Install The depoendencies

```pip install Flask openai python-dotenv```

3. Create a .env file in the root of the backend directory and add your OpenAI API key:

```OPENAI_API_KEY='your-openai-api-key'```

4. Start the Flask backend server:

```flask run```

### Frontend Setup

1. Navigate to the frontend directory:

```cd <your-frontend-directory>```

2. Install the required Node.js packages:

```npm install```

3. Start the React frontend application:

```npm start```

The React app will open in your default web browser at http://localhost:3000.

## Usage
Once both the backend and frontend servers are running, use the MindMender application by clicking the "Start your session" button on the homepage. You can then interact with the assistant through the chat interface.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments

OpenAI for providing the GPT API used in this project.
All contributors who participate in the development of MindMender.
For more details and documentation on the OpenAI API, visit OpenAI API Documentation.
