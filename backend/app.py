import os
import json
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from src.utils.logger import logger
from src.pipeline.prediction_pipeline import PredictionPipeline
from src.pipeline.training_pipeline import TrainingPipeline


# ── Pydantic Input Schema — matches the 22 training features exactly ──────────

class ClaimInput(BaseModel):
    # Policy
    PolicyType:  str = Field(..., description="Full policy type e.g. Sedan - Liability")
    BasePolicy:  str = Field(..., description="Liability / Collision / All Perils")
    Deductible:  int = Field(..., ge=100, le=2000)
    AgentType:   str = Field(..., description="External or Internal")
    # Claimant
    Age:               int = Field(..., ge=16, le=100)
    Sex:               str = Field(...)
    MaritalStatus:     str = Field(...)
    AgeOfPolicyHolder: str = Field(...)
    Fault:             str = Field(..., description="Policy Holder or Third Party")
    # Vehicle
    Make:            str = Field(...)
    VehicleCategory: str = Field(..., description="Sedan / Sport / Utility")
    VehiclePrice:    str = Field(...)
    AgeOfVehicle:    str = Field(...)
    NumberOfCars:    str = Field(...)
    AccidentArea:    str = Field(..., description="Urban or Rural")
    # Evidence & Timeline
    PoliceReportFiled:    str = Field(...)
    WitnessPresent:       str = Field(...)
    Days_Policy_Accident: str = Field(...)
    Days_Policy_Claim:    str = Field(...)
    PastNumberOfClaims:   str = Field(...)
    NumberOfSuppliments:  str = Field(...)
    AddressChange_Claim:  str = Field(...)


# ── App Lifecycle ─────────────────────────────────────────────────────────────

predictor:         Optional[PredictionPipeline] = None
evaluation_report: Optional[dict]               = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global predictor, evaluation_report
    logger.info('Starting up Vehicle Fraud Detection API...')

    model_path = os.path.join('artifacts', 'model.pkl')
    eval_path  = os.path.join('artifacts', 'evaluation_report.json')

    if not os.path.exists(model_path):
        logger.info('Model not found. Running training pipeline...')
        evaluation_report = TrainingPipeline().run()
    else:
        logger.info('Model artifacts found. Skipping training.')
        if os.path.exists(eval_path):
            with open(eval_path) as f:
                evaluation_report = json.load(f)

    predictor = PredictionPipeline()
    logger.info('API ready.')
    yield
    logger.info('Shutting down API...')


# ── FastAPI App ───────────────────────────────────────────────────────────────

app = FastAPI(
    title='Vehicle Insurance Fraud Detection API',
    description='End-to-end ML API for detecting fraudulent vehicle insurance claims.',
    version='1.0.0',
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get('/', tags=['Health'])
def root():
    return {'status': 'running', 'version': '1.0.0'}


@app.get('/health', tags=['Health'])
def health():
    return {'status': 'healthy', 'model_loaded': predictor is not None}


@app.post('/predict', tags=['Prediction'])
def predict(claim: ClaimInput):
    if predictor is None:
        raise HTTPException(status_code=503, detail='Model not loaded.')
    try:
        result = predictor.predict(claim.model_dump())
        return {
            'success':                True,
            'prediction':             result['label'],
            'fraud_probability':      result['fraud_probability'],
            'legitimate_probability': result['legitimate_probability'],
            'risk_tier':              result['risk_tier'],
            'recommendation':         result['recommendation'],
        }
    except Exception as e:
        logger.error(f'Prediction error: {str(e)}')
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/model/info', tags=['Model'])
def model_info():
    if evaluation_report is None:
        raise HTTPException(status_code=404, detail='Evaluation report not available.')
    return evaluation_report


@app.post('/train', tags=['Training'])
def retrain():
    global predictor, evaluation_report
    try:
        for f in ['artifacts/model.pkl', 'artifacts/scaler.pkl',
                  'artifacts/feature_names.pkl', 'artifacts/evaluation_report.json']:
            if os.path.exists(f):
                os.remove(f)
        evaluation_report = TrainingPipeline().run()
        predictor         = PredictionPipeline()
        return {'success': True, 'message': 'Retrained.', 'metrics': evaluation_report['metrics']}
    except Exception as e:
        logger.error(f'Training error: {str(e)}')
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('app:app', host='0.0.0.0', port=8080, reload=True)