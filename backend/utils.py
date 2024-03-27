from pydub import AudioSegment
# import speech_recognition as sr
from openai import OpenAI
import os
from IPython.display import Audio, display
import torch
import re
from torch import cuda, bfloat16
import transformers
from langchain.llms import HuggingFacePipeline

def ask_llama(text):
    HF_AUTH_TOKEN = os.environ.get("HF_AUTH_TOKEN")
    print(HF_AUTH_TOKEN)

    insert_prompt=text

    model_id = 'meta-llama/Llama-2-13b-chat-hf'


    device = f'cuda:{cuda.current_device()}' if cuda.is_available() else 'cpu'

    # set quantization configuration to load large model with less GPU memory
    # this requires the `bitsandbytes` library
    bnb_config = transformers.BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type='nf4',
        bnb_4bit_use_double_quant=True,
        bnb_4bit_compute_dtype=bfloat16
    )

    # begin initializing HF items, need auth token for these

    model_config = transformers.AutoConfig.from_pretrained(
        model_id,
        use_auth_token=HF_AUTH_TOKEN
    )

    model = transformers.AutoModelForCausalLM.from_pretrained(
        model_id,
        trust_remote_code=True,
        config=model_config,
        quantization_config=bnb_config,
        device_map='auto',
        use_auth_token=HF_AUTH_TOKEN
    )

    # llm = HuggingFacePipeline(pipeline=generate_text)

    # model.eval()
    # print(f"Model loaded on {device}")

    # The pipeline requires a tokenizer which handles the translation of human readable plaintext 
    # to LLM readable token IDs. The Llama 2 13B models were trained using the Llama 2 13B tokenizer, 
    # which we initialize like so:
    tokenizer = transformers.AutoTokenizer.from_pretrained(
        model_id,
        use_auth_token=HF_AUTH_TOKEN
    )

    # Now we're ready to initialize the HF pipeline. 
    # There are a few additional parameters that we must define here. 
    # Comments explaining these have been included in the code.
    generate_text = transformers.pipeline(
        model=model, tokenizer=tokenizer,
        return_full_text=True,  # langchain expects the full text
        task='text-generation',
        # we pass model parameters here too
        temperature=0.0,  # 'randomness' of outputs, 0.0 is the min and 1.0 the max
        max_new_tokens=512,  # mex number of tokens to generate in the output
        repetition_penalty=1.1  # without this output begins repeating
    )

    res = generate_text(insert_prompt)
    print(res[0]["generated_text"])

    llm = HuggingFacePipeline(pipeline=generate_text)
    llm_response=llm(prompt=insert_prompt)



    return llm_response

def ask_gpt(text):

    OPENAI_API_KEY=os.environ.get("OPENAI_API_KEY")
    print(OPENAI_API_KEY)
    client = OpenAI(api_key=OPENAI_API_KEY)
    
    model_choice = "gpt-3.5-turbo-16k"  #@param ['gpt-3.5-turbo-16k', 'gpt-3.5-turbo', 'gpt-4']
    insert_prompt = text  #@param {type: "string"}
    try:
       
        # response = client.chat.completions.create(
        # model=model_choice,
        # messages=[
        #         {"role": "system", "content": "As a skilled therapist, your aim is to offer comfort and insight in a manner that feels like a warm conversation. Each response is a unique reflection of the person's story, avoiding repetitive starts or endings. Instead, engage with genuine curiosity and succinct, metaphor-rich advice that sheds new light on their feelings or situation. When a topic is outside your expertise, gently guide them towards additional resources. Keep your guidance brief, nurturing a space for clarity and self-discovery through the thoughtful use of metaphors."},
        #         {"role": "user", "content": insert_prompt}
        # ]
        # )

        # gpt_response =response.choices[0].message.content.strip()
        # print("GPT Response:",gpt_response)
        # return gpt_response
        return text
    except Exception as e:
        print("Error: "+str(e))
        return "Could not generate an answer."  # 500 is the status code for server error



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
        # return ask_gpt(text)
        return ask_llama(text)

