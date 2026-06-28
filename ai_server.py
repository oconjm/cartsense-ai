from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI # type: ignore

app = Flask(__name__)
CORS(app)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"
)

@app.route('/')
def home():
    return jsonify({
        "status": "AI server running",
        "endpoints": ["/ai-chat", "/predict-sales"]
    })

@app.route('/ai-chat', methods=['POST'])
def ai_chat():

    data = request.get_json()
    user_message = data.get('message', '')

    try:
        completion = client.chat.completions.create(
    model="openai/gpt-4o-mini",
    messages=[
        {"role": "user", "content": user_message}
    ]
)

        reply = completion.choices[0].message.content

        return jsonify({
            "reply": reply
        })

    except Exception as e:
        return jsonify({
            "reply": f"Error: {str(e)}"
        })

@app.route('/predict-sales', methods=['GET'])
def predict_sales():

    return jsonify({
        "current_sales": 25000,
        "predicted_sales": 32000,
        "growth": "28%"
    })

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)