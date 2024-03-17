from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os
# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Read API key from environment variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(
    api_key=OPENAI_API_KEY,
)

CORS(app)  # This is needed to allow your React app to make requests to your Flask app

# You'll want to import or define your Python functions here
# For example:
# from your_module import your_function

@app.route('/start_session', methods=['POST'])
def start_session():
    # Extract data from request if needed
    # data = request.json

    # Call your Python functions here
    # result = your_function(data)

    # For now, let's just return a placeholder response
    return jsonify({'response': 'Session started successfully!'})

@app.route('/transcribe_audio', methods=['POST'])
def transcribe_audio():
    # Here you would handle the audio transcription
    # For now, returning a placeholder response
    return jsonify({'transcription': 'This is a transcribed message.'})

# Set up OpenAI key

OPENAI_API_KEY=os.environ.get("OPENAI_API_KEY")
print(OPENAI_API_KEY)
client = OpenAI(api_key=OPENAI_API_KEY)

@app.route('/ask_gpt', methods=['POST'])
def ask_gpt():
    user_request = request.json.get('message')
   

    model_choice = "gpt-3.5-turbo-16k"  #@param ['gpt-3.5-turbo-16k', 'gpt-3.5-turbo', 'gpt-4']
    insert_prompt = user_request  #@param {type: "string"}
    try:
        # Make an API call to OpenAI
        # response = openai.ChatCompletion.create(
        #     model=model_choice,
        #     messages=[
        #         {"role": "system", "content": "You are an empathetic therapist skilled in conversational support. Your goal is to provide compassionate and understanding responses to your patient's concerns. Listen attentively, and respond with empathy. You may ask clarifying questions to better understand your patient's feelings or situation. If a topic arises that is beyond your scope (not related to emotions or therapy), kindly acknowledge it and suggest seeking additional support. Keep your responses concise and focused on fostering a supportive dialogue."},
        #         {"role": "user", "content": insert_prompt}
        #     ]
        # )
        response = client.chat.completions.create(
        model=model_choice,
        messages=[
                {"role": "system", "content": "You are an empathetic therapist skilled in conversational support. Your goal is to provide compassionate and understanding responses to your patient's concerns. Listen attentively, and respond with empathy. You may ask clarifying questions to better understand your patient's feelings or situation. If a topic arises that is beyond your scope (not related to emotions or therapy), kindly acknowledge it and suggest seeking additional support. Keep your responses concise and focused on fostering a supportive dialogue."},
                {"role": "user", "content": insert_prompt}
        ]
        )

        gpt_response =response.choices[0].message.content.strip()
        print("GPT Response:",gpt_response)
        return jsonify({"response": gpt_response})
        
    except Exception as e:
        print("Error: "+str(e))
        return jsonify({"error": str(e)}), 500  # 500 is the status code for server error

if __name__ == '__main__':
    app.run(debug=True)
