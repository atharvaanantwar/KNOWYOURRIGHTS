#####Step 4 — Question Service (Calls Colab)


import requests

COLAB_API = "https://your-ngrok-url/generate"

def get_question(topic: str, difficulty: str):

    response = requests.get(
        COLAB_API,
        params={
            "topic": topic,
            "difficulty": difficulty
        }
    )

    return response.json()