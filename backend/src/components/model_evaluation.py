import os
import sys
import json
import pickle
import numpy as np
import pandas as pd
from dataclasses import dataclass
from sklearn.metrics import (
    accuracy_score, f1_score, precision_score, recall_score,
    roc_auc_score, confusion_matrix, classification_report
)
from src.utils.logger import logger
from src.utils.exception import CustomException


@dataclass
class ModelEvaluationConfig:
    evaluation_report_path: str = os.path.join("artifacts", "evaluation_report.json")


class ModelEvaluation:
    def __init__(self):
        self.config = ModelEvaluationConfig()

    def get_feature_importance(self, model, feature_names: list) -> list:
        """Extract top feature importances if available."""
        if hasattr(model, "feature_importances_"):
            importances = model.feature_importances_
            fi = sorted(
                zip(feature_names, importances),
                key=lambda x: x[1], reverse=True
            )
            return [{"feature": k, "importance": round(float(v), 4)} for k, v in fi[:10]]
        return []

    def initiate_model_evaluation(self, model, X_test, y_test, feature_names: list,
                                   all_model_results: list):
        logger.info("Starting model evaluation...")
        try:
            os.makedirs("artifacts", exist_ok=True)

            y_pred = model.predict(X_test)
            y_proba = model.predict_proba(X_test)[:, 1]
            cm = confusion_matrix(y_test, y_pred)

            report = {
                "best_model": type(model).__name__,
                "metrics": {
                    "accuracy": round(accuracy_score(y_test, y_pred) * 100, 2),
                    "f1_score": round(f1_score(y_test, y_pred), 4),
                    "precision": round(precision_score(y_test, y_pred), 4),
                    "recall": round(recall_score(y_test, y_pred), 4),
                    "roc_auc": round(roc_auc_score(y_test, y_proba), 4),
                },
                "confusion_matrix": {
                    "tn": int(cm[0][0]),
                    "fp": int(cm[0][1]),
                    "fn": int(cm[1][0]),
                    "tp": int(cm[1][1]),
                },
                "all_models": all_model_results,
                "feature_importance": self.get_feature_importance(model, feature_names),
                "classification_report": classification_report(y_test, y_pred,
                                                                target_names=["Legitimate", "Fraud"]),
            }

            with open(self.config.evaluation_report_path, "w") as f:
                json.dump(report, f, indent=2)

            logger.info(f"Evaluation report saved to {self.config.evaluation_report_path}")
            logger.info(f"Final Metrics — Accuracy: {report['metrics']['accuracy']}% | "
                        f"ROC-AUC: {report['metrics']['roc_auc']}")
            logger.info("Model evaluation completed.")
            return report

        except Exception as e:
            raise CustomException(e, sys)
