from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os
import subprocess
from werkzeug.utils import secure_filename
from utils import transcribe_audio, ask_gpt, text_to_speech, detect_intent
import base64
# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Directory where uploaded files will be saved
UPLOAD_FOLDER = 'recordings'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app)  # This is needed to allow your React app to make requests to your Flask app


# @app.route('/transcribe_audio', methods=['POST'])
# def handle_request():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part'}), 400

#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400

#     if file:
#         filename = secure_filename(file.filename)
#         save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#         file.save(save_path)

#         # Now that the file is saved, you can transcribe it
#         transcription = transcribe_audio(save_path)

#         # Generate the answer 
#         answer = ask_gpt(transcription)

#         # Generate the audio file
#         audio = text_to_speech(answer)

#         # Clean up the saved audio file if desired
#         os.remove(save_path)

#         return jsonify({'Answer': answer})


@app.route('/process_text', methods=['POST'])
def process_text():
    # Get JSON data from the request
    data = request.get_json()

    # Retrieve 'text' from the JSON data
    text = data.get('text', '')

    # For now, just echo the received text back in the response
    response = {
        'answer': text
    }

    # Return the response as JSON
    return jsonify(response)

@app.route('/transcribe_audio', methods=['POST'])
def handle_request():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)

        # Transcription process
        transcription = transcribe_audio(save_path)

        # Do some intent detection o detect suicide or self harm 
        intent = detect_intent(transcription)

        # If a suicide or self-harm intent was detected 
        if not(intent["intent"]=='General'):
            answer = intent["message"]
        else:
            # Generate the answer from GPT (assuming `ask_gpt` is your function for this)
            answer = ask_gpt(transcription)


        # # Generate the answer from GPT (assuming `ask_gpt` is your function for this)
        # answer = ask_gpt(transcription)

        # Generate the audio file for the answer
        # Assuming `text_to_speech` now just saves the file and returns the filename
        # Generate the audio file for the answer
        audio_filename = text_to_speech(answer, filename=f"{filename}_response.mp3")
        
        # Encode the audio file in Base64
        with open(audio_filename, 'rb') as audio_file:
            audio_content = audio_file.read()
        audio_base64 = base64.b64encode(audio_content).decode('utf-8')
        
        # Clean up the saved audio file
        os.remove(save_path)
        os.remove(audio_filename)
        
        # Return both the answer and the Base64-encoded audio content
        return jsonify({'UserRequest':transcription,'Answer': answer, 'AudioContent': audio_base64})

# Set up OpenAI key

# OPENAI_API_KEY=os.environ.get("OPENAI_API_KEY")
# print(OPENAI_API_KEY)
# client = OpenAI(api_key=OPENAI_API_KEY)

# @app.route('/ask_gpt', methods=['POST'])
# def ask_gpt():
#     user_request = request.json.get('message')
   

#     model_choice = "gpt-3.5-turbo-16k"  #@param ['gpt-3.5-turbo-16k', 'gpt-3.5-turbo', 'gpt-4']
#     insert_prompt = user_request  #@param {type: "string"}
#     try:
        
#         response = client.chat.completions.create(
#         model=model_choice,
#         messages=[
#                 {"role": "system", "content": "You are an empathetic therapist skilled in conversational support. Your goal is to provide compassionate and understanding responses to your patient's concerns. Listen attentively, and respond with empathy. You may ask clarifying questions to better understand your patient's feelings or situation. If a topic arises that is beyond your scope (not related to emotions or therapy), kindly acknowledge it and suggest seeking additional support. Keep your responses concise and focused on fostering a supportive dialogue."},
#                 {"role": "user", "content": insert_prompt}
#         ]
#         )

#         gpt_response =response.choices[0].message.content.strip()
#         print("GPT Response:",gpt_response)
#         return jsonify({"response": gpt_response})
        
#     except Exception as e:
#         print("Error: "+str(e))
#         return jsonify({"error": str(e)}), 500  # 500 is the status code for server error

if __name__ == '__main__':
    app.run(debug=True)
