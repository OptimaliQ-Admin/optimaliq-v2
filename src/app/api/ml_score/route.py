import json
from joblib import load
import numpy as np
import os

model = load(os.path.join(os.path.dirname(__file__), "local_model.pkl"))

industries = [
    "E-commerce", "Finance", "SaaS", "Education", "Technology", "Healthcare", "Retail", "Manufacturing",
    "Consulting", "Entertainment", "Real Estate", "Transportation", "Hospitality", "Energy",
    "Telecommunications", "Pharmaceuticals", "Automotive", "Construction", "Legal", "Nonprofit", "Other"
]

def POST(request):
    try:
        body = json.loads(request.body)
        strategy = float(body.get("strategy_score", 0))
        process = float(body.get("process_score", 0))
        tech = float(body.get("technology_score", 0))
        industry = body.get("industry", "Other")

        one_hot = [1 if i == industry else 0 for i in industries]
        input_vec = np.array([[strategy, process, tech] + one_hot])
        prediction = model.predict(input_vec)[0]

        return {
            "statusCode": 200,
            "body": json.dumps({"predicted_score": round(prediction, 2)}),
            "headers": {"Content-Type": "application/json"},
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"},
        }
