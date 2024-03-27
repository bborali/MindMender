from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from utils import generate_response

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

CORS(app)  # This is needed to allow your React app to make requests to your Flask app

@app.route('/process_text', methods=['POST'])
def process_text():
    # Get JSON data from the request
    data = request.get_json()

    # Retrieve 'text' from the JSON data
    text = data.get('text', '')

    # Printing the user sentence
    print("USER: ",text)

    # Generate the response 
    answer = generate_response(text)

    # Return the received text back in the response
    response = {
        'answer': answer
    }

    # Printing sytrem response 
    print("SYSTEM: ", answer)

    # Return the response as JSON
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
