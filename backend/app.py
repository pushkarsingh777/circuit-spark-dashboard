from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React to connect

@app.route("/", methods=["GET"])
def get_test_data():
    print("🔥 React Dashboard Connected Successfully!")
    return jsonify({"message": "MCB Insight Flask API Connected!"})

@app.route("/", methods=["GET"])
def dashboard_ping():
    print("🔥 DashboardHeader Component Connected to Flask!")
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    print("🚀 Flask backend running on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
