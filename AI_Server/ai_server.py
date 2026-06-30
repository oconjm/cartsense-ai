from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI  # type: ignore

app = Flask(__name__)
CORS(app)

import os

print("API key loaded:", os.getenv("OPENROUTER_API_KEY")[:15] + "...")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

@app.route('/') 
def home():
    return jsonify({
        "status": "AI server running",
        "endpoints": ["/ai-chat", "/predict-sales"]
    })


@app.route('/ai-chat', methods=['POST'])
def ai_chat():
    data = request.get_json() or {}
    user_message = data.get('message', '')

    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-3.1-8b-instruct:free",
            messages=[
                {"role": "user", "content": user_message}
            ]
        )

        reply = completion.choices[0].message.content

        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"reply": str(e)}), 500


@app.route('/predict-sales', methods=['GET'])
def predict_sales():
    return jsonify({
        "current_sales": 25000,
        "predicted_sales": 32000,
        "growth": "28%"
    })


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
