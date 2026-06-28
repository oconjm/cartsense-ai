from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# ✅ HOME ROUTE (fixes 404 on "/")
@app.route('/')
def home():
    return jsonify({
        "status": "AI server running",
        "endpoints": ["/ai-chat", "/predict-sales"]
    })


# =========================
# AI CHAT ROUTE
# =========================
@app.route('/ai-chat', methods=['POST'])
def ai_chat():

    data = request.get_json()
    user_message = data.get('message', '') if data else ''

    try:
        response = requests.post(
            'http://localhost:11434/api/generate',
            json={
                'model': 'tinyllama',
                'prompt': user_message,
                'stream': False
            }
        )

        result = response.json()

        return jsonify({
            'reply': result.get('response', 'No response from model')
        })

    except Exception as e:
        return jsonify({
            'reply': f"Error: {str(e)}"
        })


# =========================
# SALES PREDICTION ROUTE
# =========================
@app.route('/predict-sales', methods=['GET'])
def predict_sales():

    return jsonify({
        "current_sales": 25000,
        "predicted_sales": 32000,
        "growth": "28%"
    })


# =========================
# RUN SERVER
# =========================
if __name__ == '__main__':
    app.run(port=5000, debug=True)