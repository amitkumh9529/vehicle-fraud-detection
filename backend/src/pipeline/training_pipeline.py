import sys
from src.utils.logger import logger
from src.utils.exception import CustomException
from src.components.data_ingestion import DataIngestion
from src.components.data_validation import DataValidation
from src.components.data_transformation import DataTransformation
from src.components.model_trainer import ModelTrainer
from src.components.model_evaluation import ModelEvaluation


class TrainingPipeline:
    def __init__(self):
        self.ingestion = DataIngestion()
        self.validation = DataValidation()
        self.transformation = DataTransformation()
        self.trainer = ModelTrainer()
        self.evaluator = ModelEvaluation()

    def run(self):
        logger.info("=" * 60)
        logger.info("TRAINING PIPELINE STARTED")
        logger.info("=" * 60)
        try:
            # Stage 1: Data Ingestion
            logger.info("Stage 1: Data Ingestion")
            train_path, test_path = self.ingestion.initiate_data_ingestion()

            # Stage 2: Data Validation
            logger.info("Stage 2: Data Validation")
            validation_status = self.validation.initiate_data_validation(train_path, test_path)
            if not validation_status:
                logger.warning("Data validation had warnings. Proceeding anyway.")

            # Stage 3: Data Transformation
            logger.info("Stage 3: Data Transformation")
            X_train, y_train, X_test, y_test, feature_names = \
                self.transformation.initiate_data_transformation(train_path, test_path)

            # Stage 4: Model Training
            logger.info("Stage 4: Model Training")
            best_model, all_results = self.trainer.initiate_model_training(
                X_train, y_train, X_test, y_test, feature_names
            )

            # Stage 5: Model Evaluation
            logger.info("Stage 5: Model Evaluation")
            report = self.evaluator.initiate_model_evaluation(
                best_model, X_test, y_test, feature_names, all_results
            )

            logger.info("=" * 60)
            logger.info("TRAINING PIPELINE COMPLETED SUCCESSFULLY")
            logger.info(f"Best model: {report['best_model']}")
            logger.info(f"Accuracy: {report['metrics']['accuracy']}%")
            logger.info(f"ROC-AUC: {report['metrics']['roc_auc']}")
            logger.info("=" * 60)
            return report

        except Exception as e:
            raise CustomException(e, sys)


if __name__ == "__main__":
    pipeline = TrainingPipeline()
    pipeline.run()
