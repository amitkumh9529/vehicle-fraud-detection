import os
import sys
import pickle
import numpy as np
import pandas as pd
from src.utils.logger import logger
from src.utils.exception import CustomException
from src.components.data_transformation import LABEL_ENCODING_MAP
from src.components.data_validation import NUMERICAL_COLUMNS


class PredictionPipeline:
    MODEL_PATH         = os.path.join('artifacts', 'model.pkl')
    SCALER_PATH        = os.path.join('artifacts', 'scaler.pkl')
    FEATURE_NAMES_PATH = os.path.join('artifacts', 'feature_names.pkl')

    def __init__(self):
        self._model         = None
        self._scaler        = None
        self._feature_names = None
        self._load_artifacts()

    def _load_artifacts(self):
        try:
            logger.info('Loading model artifacts...')
            with open(self.MODEL_PATH,         'rb') as f: self._model         = pickle.load(f)
            with open(self.SCALER_PATH,        'rb') as f: self._scaler        = pickle.load(f)
            with open(self.FEATURE_NAMES_PATH, 'rb') as f: self._feature_names = pickle.load(f)
            logger.info('Artifacts loaded successfully.')
        except Exception as e:
            raise CustomException(e, sys)

    def preprocess(self, data: dict) -> np.ndarray:
        df = pd.DataFrame([data])

        # Label encode categoricals
        for col, mapping in LABEL_ENCODING_MAP.items():
            if col in df.columns:
                df[col] = df[col].map(mapping).fillna(0).astype(int)

        # Align to training feature order — fills missing with 0, drops extras
        df = df.reindex(columns=self._feature_names, fill_value=0)

        # Scale numerical columns
        df[NUMERICAL_COLUMNS] = self._scaler.transform(df[NUMERICAL_COLUMNS])

        return df.values

    def predict(self, data: dict) -> dict:
        try:
            X                 = self.preprocess(data)
            prediction        = int(self._model.predict(X)[0])
            probabilities     = self._model.predict_proba(X)[0]
            fraud_probability = float(probabilities[1])

            if fraud_probability >= 0.75:
                risk_tier = 'HIGH'
            elif fraud_probability >= 0.45:
                risk_tier = 'MEDIUM'
            else:
                risk_tier = 'LOW'

            recommendations = {
                'HIGH':   '🚨 Flag for immediate manual investigation.',
                'MEDIUM': '⚠️ Review claim details before approval.',
                'LOW':    '✅ Claim appears legitimate. Proceed with standard processing.',
            }

            result = {
                'prediction':              prediction,
                'label':                   'FRAUDULENT' if prediction == 1 else 'LEGITIMATE',
                'fraud_probability':       round(fraud_probability * 100, 2),
                'legitimate_probability':  round(float(probabilities[0]) * 100, 2),
                'risk_tier':               risk_tier,
                'recommendation':          recommendations[risk_tier],
            }

            logger.info(
                f"Prediction: {result['label']} | "
                f"Fraud Probability: {result['fraud_probability']}% | "
                f"Risk: {risk_tier}"
            )
            return result

        except Exception as e:
            raise CustomException(e, sys)