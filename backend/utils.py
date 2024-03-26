from pydub import AudioSegment
from openai import OpenAI
import os
from IPython.display import Audio, display
import torch

import re

# def transcribe_audio(audio_file_path):
#     # No need to save the file again, so you can skip directly to processing
#     # Convert to WAV if necessary
#     if not audio_file_path.endswith('.wav'):
#         audio_segment = AudioSegment.from_file(audio_file_path)
#         wav_file_path = audio_file_path + '.wav'
#         audio_segment.export(wav_file_path, format='wav')
#     else:
#         wav_file_path = audio_file_path

#     recognizer = sr.Recognizer()

#     with sr.AudioFile(wav_file_path) as source:
#         audio_data = recognizer.record(source)
#         try:
#             # Attempt to recognize the speech in the audio file
#             transcription = recognizer.recognize_google(audio_data)
#             return transcription
#         except sr.UnknownValueError:
#             return "Unable to understand audio"
#         except sr.RequestError as e:
#             return "Error requesting results; {0}".format(e)
        

def ask_gpt(text):

    OPENAI_API_KEY=os.environ.get("OPENAI_API_KEY")
    print(OPENAI_API_KEY)
    client = OpenAI(api_key=OPENAI_API_KEY)
    
    model_choice = "gpt-3.5-turbo-16k"  #@param ['gpt-3.5-turbo-16k', 'gpt-3.5-turbo', 'gpt-4']
    insert_prompt = text  #@param {type: "string"}
    try:
       
        response = client.chat.completions.create(
        model=model_choice,
        messages=[
                {"role": "system", "content": "As a skilled therapist, your aim is to offer comfort and insight in a manner that feels like a warm conversation. Each response is a unique reflection of the person's story, avoiding repetitive starts or endings. Instead, engage with genuine curiosity and succinct, metaphor-rich advice that sheds new light on their feelings or situation. When a topic is outside your expertise, gently guide them towards additional resources. Keep your guidance brief, nurturing a space for clarity and self-discovery through the thoughtful use of metaphors."},
                {"role": "user", "content": insert_prompt}
        ]
        )

        gpt_response =response.choices[0].message.content.strip()
        print("GPT Response:",gpt_response)
        return gpt_response
        # return text
    except Exception as e:
        print("Error: "+str(e))
        return "Could not generate an answer."  # 500 is the status code for server error

# def text_to_speech(text, filename='temp_audio.mp3'):
#     tts = gTTS(text=text, lang='en')
#     save_path = os.path.join('recordings', filename)  # Specify your path here
#     tts.save(save_path)
#     return save_path

# # Define a function to detect user intent based on the last message
# def detect_intent(user_message):
#     # Regular expressions to match phrases related to suicide thoughts and self-harm
#     suicide_phrases = re.compile(r'\b(suicid(e|al)|end it all|no point in living|kill myself)\b', re.IGNORECASE)
#     self_harm_phrases = re.compile(r'\b(cut myself|self[-\s]?harm|hurt myself)\b', re.IGNORECASE)

#     # Check if the user message contains any of the suicide-related phrases
#     if suicide_phrases.search(user_message):
#         return {
#             "intent": "Thoughts of Suicide",
#             "message": "It sounds like you're going through a really tough time right now. " \
#                        "I want you to know that help is available to you. " \
#                        "Please reach out to a friend, family member, or a professional therapist. " \
#                        "You can also call the National Suicide Prevention Lifeline at 1-800-273-TALK (1-800-273-8255) immediately."
#         }
    
#     # Check if the user message contains any of the self-harm-related phrases
#     elif self_harm_phrases.search(user_message):
#         return {
#             "intent": "Self-harm",
#             "message": "I'm hearing that you want to hurt yourself, and I'm really concerned for you. " \
#                        "It’s important to talk to someone about what you’re going through. " \
#                        "Please reach out to a healthcare professional or call the crisis hotline for support."
#         }
    
#     # If no intent is detected, return a default response
#     else:
#         return {
#             "intent": "General",
#             "message": "Let's talk more about what you're feeling right now."
#         }


def detect_intent(text):
    # Define keywords for each intent
    suicide_keywords = ["suicide", "end my life", "kill myself"]
    self_harm_keywords = ["cut myself", "hurt myself", "self harm"]
    helpline_keywords = ["need help", "crisis line", "helpline"]

    # Detect suicide-related intent
    if any(keyword in text.lower() for keyword in suicide_keywords):
        return "suicide_intent"

    # Detect self-harm intent
    elif any(keyword in text.lower() for keyword in self_harm_keywords):
        return "self_harm_intent"

    # Detect requests for crisis helplines
    elif any(keyword in text.lower() for keyword in helpline_keywords):
        return "helpline_intent"

    # No specific intent detected
    return None

def generate_response(text):
    # Detect intent
    intent = detect_intent(text)

    # Handle detected intents with predefined responses
    if intent == "suicide_intent":
        return "It sounds like you're going through a really difficult time. I want you to know that help is available. Please reach out to a trusted individual or a professional helpline."
    elif intent == "self_harm_intent":
        return "It's important to talk about these feelings. Self-harm is a serious matter and I encourage you to seek support from someone you trust or a professional service."
    elif intent == "helpline_intent":
        return "If you're looking for support, various helplines are available depending on your location. It's a courageous step to ask for help, and I encourage you to take it."

    # Fallback to GPT-based response for other queries
    else:
        return ask_gpt(text)
    


