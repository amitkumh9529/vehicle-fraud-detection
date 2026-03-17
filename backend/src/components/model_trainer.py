import os
import sys
import pickle
from dataclasses import dataclass
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
from xgboost import XGBClassifier
from src.utils.logger import logger
from src.utils.exception import CustomException


@dataclass
class ModelTrainerConfig:
    model_path:         str = os.path.join('artifacts', 'model.pkl')
    feature_names_path: str = os.path.join('artifacts', 'feature_names.pkl')


class ModelTrainer:
    def __init__(self):
        self.config = ModelTrainerConfig()

    def evaluate_model(self, model, X_test, y_test, name: str) -> dict:
        y_pred  = model.predict(X_test)
        y_proba = model.predict_proba(X_test)[:, 1]
        metrics = {
            'model':     name,
            'accuracy':  round(accuracy_score(y_test, y_pred) * 100, 2),
            'f1_score':  round(f1_score(y_test, y_pred, zero_division=0), 4),
            'precision': round(precision_score(y_test, y_pred, zero_division=0), 4),
            'recall':    round(recall_score(y_test, y_pred, zero_division=0), 4),
            'roc_auc':   round(roc_auc_score(y_test, y_proba), 4),
        }
        logger.info(
            f"[{name}] Accuracy: {metrics['accuracy']}% | "
            f"F1: {metrics['f1_score']} | "
            f"Precision: {metrics['precision']} | "
            f"Recall: {metrics['recall']} | "
            f"ROC-AUC: {metrics['roc_auc']}"
        )
        return metrics

    def composite_score(self, m: dict) -> float:
        """
        Weighted score preventing any single metric from dominating.
        ROC-AUC: best for imbalanced fraud detection
        Accuracy: overall correctness
        F1: balance between precision and recall on fraud class
        """
        return (0.5 * m['roc_auc']) + (0.3 * m['accuracy'] / 100) + (0.2 * m['f1_score'])

    def initiate_model_training(self, X_train, y_train, X_test, y_test, feature_names: list):
        logger.info('Starting model training...')
        try:
            os.makedirs('artifacts', exist_ok=True)

            # Class imbalance ratio — used by models that support class weighting
            # Avoids upsampling which was removing 100% of fraud cases via z-score
            neg = (y_train == 0).sum()
            pos = (y_train == 1).sum()
            scale_pos = round(neg / pos, 1)
            logger.info(f'Class ratio (neg/pos): {scale_pos} — using class weights')

            models = {
                'Decision Tree': DecisionTreeClassifier(
                    class_weight='balanced',
                    random_state=42
                ),
                'Random Forest': RandomForestClassifier(
                    n_estimators=200,
                    max_depth=20,
                    min_samples_split=3,
                    min_samples_leaf=1,
                    class_weight='balanced',
                    random_state=42,
                    n_jobs=-1
                ),
                'XGBoost': XGBClassifier(
                    n_estimators=200,
                    max_depth=6,
                    learning_rate=0.1,
                    scale_pos_weight=scale_pos,  # computed from actual data
                    eval_metric='logloss',
                    random_state=42,
                    verbosity=0,
                ),
                'Logistic Regression': LogisticRegression(
                    max_iter=1000,
                    class_weight='balanced',
                    random_state=42
                ),
            }

            results        = []
            trained_models = {}

            for name, model in models.items():
                logger.info(f'Training {name}...')
                model.fit(X_train, y_train)
                metrics = self.evaluate_model(model, X_test, y_test, name)
                results.append(metrics)
                trained_models[name] = model

            # Best model by composite score
            best       = max(results, key=self.composite_score)
            best_model = trained_models[best['model']]
            logger.info(
                f"Best model: {best['model']} | "
                f"Score: {self.composite_score(best):.4f} | "
                f"Accuracy: {best['accuracy']}% | "
                f"ROC-AUC: {best['roc_auc']}"
            )

            with open(self.config.model_path, 'wb') as f:
                pickle.dump(best_model, f)
            with open(self.config.feature_names_path, 'wb') as f:
                pickle.dump(feature_names, f)

            logger.info('Model training completed.')
            return best_model, results

        except Exception as e:
            raise CustomException(e, sys)