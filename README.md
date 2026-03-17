# 🛡️ FraudGuard AI — Vehicle Insurance Fraud Detection

An end-to-end Data Science project with a **FastAPI** backend and **React + Tailwind v4** frontend for detecting fraudulent vehicle insurance claims using machine learning.

---

## 📋 Project Structure

```
vehicle-fraud-detection/
│
├── backend/
│   ├── artifacts/                  # Saved model, scaler, feature names (auto-generated)
│   │   ├── model.pkl
│   │   ├── scaler.pkl
│   │   ├── feature_names.pkl
│   │   ├── encoder_map.pkl
│   │   └── evaluation_report.json
│   │
│   ├── data/                       # Dataset (auto-generated if not present)
│   │   ├── fraud_oracle.csv
│   │   ├── train.csv
│   │   └── test.csv
│   │
│   ├── logs/
│   │   └── app.log                 # Application logs
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── data_ingestion.py       # Load / generate dataset
│   │   │   ├── data_validation.py      # Schema & null checks
│   │   │   ├── data_transformation.py  # Encoding, upsampling, scaling
│   │   │   ├── model_trainer.py        # Train & compare classifiers
│   │   │   └── model_evaluation.py     # Metrics & confusion matrix
│   │   │
│   │   ├── pipeline/
│   │   │   ├── training_pipeline.py    # Orchestrates all 5 stages
│   │   │   └── prediction_pipeline.py  # Single-claim inference
│   │   │
│   │   └── utils/
│   │       ├── logger.py               # Rotating file + console logger
│   │       └── exception.py            # Custom exception with context
│   │
│   ├── app.py                      # FastAPI application
│   └── requirements.txt
│
├── frontend-app/                   # React + Vite + Tailwind v4
│   ├── src/
│   │   ├── App.jsx                 # Root layout, header, sidebar
│   │   ├── FraudForm.jsx           # Multi-section claim wizard
│   │   ├── ModelMetrics.jsx        # Radar chart, comparison, confusion matrix
│   │   ├── formConfig.js           # All 28 field definitions + presets
│   │   ├── api.js                  # API utility functions
│   │   ├── index.css               # Tailwind v4 + custom animations
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the API server
# (Model training runs automatically on first startup)
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The training pipeline runs automatically if `artifacts/model.pkl` is not found. It:
1. Generates synthetic data (or loads `fraud_oracle.csv` if present)
2. Validates schema and null values
3. Label-encodes categoricals, upsamples minority class, removes outliers
4. Trains Decision Tree, Random Forest, and Logistic Regression
5. Saves the best model (by ROC-AUC) and evaluation report

> **Tip:** Drop the real dataset from Kaggle at `backend/data/fraud_oracle.csv`  
> Source: https://www.kaggle.com/datasets/shivamb/vehicle-claim-fraud-detection

### 2. Frontend

```bash
cd frontend-app

# Install dependencies
npm install

# Start the dev server (proxies /api → localhost:8080)
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/health` | Model load status |
| `POST` | `/predict` | Predict fraud on a claim |
| `GET` | `/model/info` | Metrics, confusion matrix, feature importance |
| `POST` | `/train` | Trigger model retraining |

### Example Prediction Request

```bash
curl -X POST http://localhost:8080/predict \
  -H "Content-Type: application/json" \
  -d '{
    "WeekOfMonth": 2,
    "DayOfWeek": "Friday",
    "Make": "BMW",
    "AccidentArea": "Rural",
    "DayOfWeekClaimed": "Monday",
    "WeekOfMonthClaimed": 1,
    "Sex": "Male",
    "MaritalStatus": "Single",
    "Age": 24,
    "Fault": "Third Party",
    "VehicleCategory": "Sport",
    "VehiclePrice": "more than 69000",
    "Days_Policy_Accident": "1 to 7",
    "Days_Policy_Claim": "8 to 15",
    "PastNumberOfClaims": "more than 4",
    "AgeOfVehicle": "new",
    "AgeOfPolicyHolder": "21 to 25",
    "PoliceReportFiled": "No",
    "WitnessPresent": "No",
    "AgentType": "External",
    "NumberOfSuppliments": "more than 5",
    "AddressChange_Claim": "under 6 months",
    "NumberOfCars": "1 vehicle",
    "PolicyType": "Sport - Liability",
    "BasePolicy": "Liability",
    "RepNumber": 1,
    "Deductible": 300,
    "Year": 1994
  }'
```

### Example Response

```json
{
  "success": true,
  "prediction": "FRAUDULENT",
  "fraud_probability": 78.4,
  "legitimate_probability": 21.6,
  "risk_tier": "HIGH",
  "recommendation": "🚨 Flag for immediate manual investigation."
}
```

---

## 🧠 ML Pipeline

### Dataset
- **Source:** fraud_oracle.csv (Kaggle) — vehicle insurance claims
- **Features:** 28 features (policy details, claimant info, vehicle, incident, evidence)
- **Target:** `FraudFound_P` (0 = Legitimate, 1 = Fraudulent)
- **Class imbalance:** ~6% fraud rate → handled via upsampling

### Preprocessing Steps
1. **Label Encoding** — Fixed mapping matching `sklearn.LabelEncoder` order from notebook
2. **Upsampling** — Minority class upsampled to match majority (training set only)
3. **Outlier Removal** — Z-score threshold of 3.0 applied to training set
4. **Standard Scaling** — Applied to 6 numerical features

### Models Trained
| Model | Accuracy | ROC-AUC |
|-------|----------|---------|
| Decision Tree | 90.5% | 0.596 |
| **Random Forest** ⭐ | **93.9%** | **0.874** |
| Logistic Regression | 72.2% | 0.784 |

### Key Fraud Signals (Feature Importance)
- Days between policy start and claim/accident (early claims = high risk)
- Past number of claims
- Vehicle price and age
- Police report filed (absence increases risk)
- Witness present (absence increases risk)
- Address change near claim time

---

## 🎨 Frontend Features

- **Multi-section wizard** — 5 sections: Policy, Claimant, Vehicle, Incident, Evidence
- **Real-time validation** — Per-field errors with section completion tracking
- **SVG probability gauge** — Animated half-circle showing fraud probability
- **Risk tiers** — HIGH / MEDIUM / LOW with color-coded cards and pulse animation
- **Model metrics tab** — Radar chart, model comparison bar chart, confusion matrix
- **Feature importance** — Collapsible horizontal bar chart
- **Presets** — "Load Sample" and "High-Risk Preset" buttons for quick testing
- **Dark theme** — Deep navy palette with grid background and gradient accents

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| ML | scikit-learn (Random Forest, Decision Tree, Logistic Regression) |
| API | FastAPI + Pydantic v2 + Uvicorn |
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | Syne (display) + DM Sans (body) |

---

## 📄 License

MIT — free to use, modify, and distribute.
