from flask import Flask, request, jsonify
import mysql.connector # type: ignore
import requests
import time

app = Flask(__name__)

# ================= DB =================
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="cart_sense_db"
)
cursor = db.cursor()

CART_ID = 14

# ================= PRODUCT MAP =================
PRODUCTS = {
    "coco mama": 29,
    "kopiko brown": 15,
    "nescafe classic": 18,
    "head and shoulder": 8,
    "patata": 20,
    "sinigang mix": 12,
    "keratin": 10
}

# ================= CONFIDENCE =================
CONF_THRESHOLD = 0.50

# prevent duplicate saves
last_seen = {}
COOLDOWN = 5

# ================= YOLO SERVER =================
YOLO_URL = "http://127.0.0.1:5000/predict"

# ================= SAVE FUNCTION =================
def save_item(item_name):
    price = PRODUCTS[item_name]

    cursor.execute("""
        SELECT id, quantity
        FROM cart_items
        WHERE cart_id=%s AND item=%s
    """, (CART_ID, item_name))

    row = cursor.fetchone()

    if row:
        cursor.execute("""
            UPDATE cart_items
            SET quantity = quantity + 1
            WHERE id=%s
        """, (row[0],))
    else:
        cursor.execute("""
            INSERT INTO cart_items
            (cart_id, item, price, quantity)
            VALUES (%s, %s, %s, %s)
        """, (CART_ID, item_name, price, 1))

    db.commit()

# ================= API =================
@app.route("/detect", methods=["POST"])
def detect():
    try:

        image = request.data

        # Send image to YOLO server
        yolo_response = requests.post(
            YOLO_URL,
            data=image,
            headers={"Content-Type": "application/octet-stream"}
        )

        result = yolo_response.json()

        item = result.get("label", "").lower()

        if item == "unknown":
            return jsonify({
                "status": "no_detection"
            })

        if item not in PRODUCTS:
            return jsonify({
                "status": "unknown_product",
                "item": item
            })

        now = time.time()

        if item in last_seen and now - last_seen[item] < COOLDOWN:
            return jsonify({
                "status": "cooldown",
                "item": item
            })

        last_seen[item] = now

        save_item(item)

        return jsonify({
            "status": "saved",
            "item": item,
            "price": PRODUCTS[item]
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)