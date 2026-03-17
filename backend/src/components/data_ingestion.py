import os
import sys
import pandas as pd
from dataclasses import dataclass
from sklearn.model_selection import train_test_split
from src.utils.logger import logger
from src.utils.exception import CustomException


@dataclass
class DataIngestionConfig:
    raw_data_path:   str = os.path.join('data', 'fraud_oracle.csv')
    train_data_path: str = os.path.join('data', 'train.csv')
    test_data_path:  str = os.path.join('data', 'test.csv')


# Columns to drop from the raw dataset before splitting
# These are IDs, date noise, and other irrelevant columns
DROP_COLUMNS = [
    'PolicyNumber', 'Month', 'MonthClaimed',
    'WeekOfMonth', 'WeekOfMonthClaimed',
    'DayOfWeek', 'DayOfWeekClaimed',
    'Year', 'RepNumber',
]


class DataIngestion:
    """
    Loads fraud_oracle.csv, drops irrelevant columns, and splits into train/test.
    Dataset: https://www.kaggle.com/datasets/shivamb/vehicle-claim-fraud-detection
    """

    def __init__(self):
        self.config = DataIngestionConfig()

    def initiate_data_ingestion(self):
        logger.info('Starting data ingestion...')
        try:
            if not os.path.exists(self.config.raw_data_path):
                raise FileNotFoundError(
                    f"Dataset not found at '{self.config.raw_data_path}'. "
                    f"Please download fraud_oracle.csv from Kaggle and place it in the data/ folder."
                )

            df = pd.read_csv(self.config.raw_data_path)
            logger.info(f'Dataset loaded. Shape: {df.shape}')

            # Drop irrelevant columns — only keep what's in KNOWN_FEATURES
            cols_to_drop = [c for c in DROP_COLUMNS if c in df.columns]
            df.drop(columns=cols_to_drop, inplace=True)
            logger.info(f'Dropped columns: {cols_to_drop}')

            train_df, test_df = train_test_split(
                df, test_size=0.2, random_state=42, stratify=df['FraudFound_P']
            )

            os.makedirs('data', exist_ok=True)
            train_df.to_csv(self.config.train_data_path, index=False)
            test_df.to_csv(self.config.test_data_path, index=False)

            logger.info(f'Train shape: {train_df.shape} | Test shape: {test_df.shape}')
            logger.info('Data ingestion completed successfully.')
            return self.config.train_data_path, self.config.test_data_path

        except Exception as e:
            raise CustomException(e, sys)