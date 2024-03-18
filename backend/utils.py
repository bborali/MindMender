from pydub import AudioSegment
import speech_recognition as sr
from openai import OpenAI
import os
from gtts import gTTS
from IPython.display import Audio, display


def transcribe_audio(audio_file_path):
    # No need to save the file again, so you can skip directly to processing
    # Convert to WAV if necessary
    if not audio_file_path.endswith('.wav'):
        audio_segment = AudioSegment.from_file(audio_file_path)
        wav_file_path = audio_file_path + '.wav'
        audio_segment.export(wav_file_path, format='wav')
    else:
        wav_file_path = audio_file_path

    recognizer = sr.Recognizer()

    with sr.AudioFile(wav_file_path) as source:
        audio_data = recognizer.record(source)
        try:
            # Attempt to recognize the speech in the audio file
            transcription = recognizer.recognize_google(audio_data)
            return transcription
        except sr.UnknownValueError:
            return "Unable to understand audio"
        except sr.RequestError as e:
            return "Error requesting results; {0}".format(e)
        

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
                {"role": "system", "content": "You are an empathetic therapist skilled in conversational support. Your goal is to provide compassionate and understanding responses to your patient's concerns. Listen attentively, and respond with empathy. You may ask clarifying questions to better understand your patient's feelings or situation. If a topic arises that is beyond your scope (not related to emotions or therapy), kindly acknowledge it and suggest seeking additional support. Keep your responses concise and focused on fostering a supportive dialogue. You can also use metaphor when you feel like it owuld be a good way to make the person see the situation differently."},
                {"role": "user", "content": insert_prompt}
        ]
        )

        gpt_response =response.choices[0].message.content.strip()
        print("GPT Response:",gpt_response)
        return gpt_response
        # return "This is the generated text"
    except Exception as e:
        print("Error: "+str(e))
        return "Could not generate an answer."  # 500 is the status code for server error

def text_to_speech(text, filename='temp_audio.mp3'):
    tts = gTTS(text=text, lang='en')
    save_path = os.path.join('recordings', filename)  # Specify your path here
    tts.save(save_path)
    return save_path
