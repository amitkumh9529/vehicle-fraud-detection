import os
import sys
import pandas as pd
from dataclasses import dataclass
from src.utils.logger import logger
from src.utils.exception import CustomException

# ── Single source of truth for all column definitions ─────────────────────────

TARGET_COLUMN = 'FraudFound_P'

# Only Age and Deductible are truly continuous — DriverRating removed (not in dataset)
NUMERICAL_COLUMNS = ['Age', 'Deductible']

CATEGORICAL_COLUMNS = [
    'PolicyType', 'BasePolicy', 'AgentType', 'Sex', 'MaritalStatus',
    'AgeOfPolicyHolder', 'Fault', 'Make', 'VehicleCategory', 'VehiclePrice',
    'AgeOfVehicle', 'NumberOfCars', 'AccidentArea', 'PoliceReportFiled',
    'WitnessPresent', 'Days_Policy_Accident', 'Days_Policy_Claim',
    'PastNumberOfClaims', 'NumberOfSuppliments', 'AddressChange_Claim',
]

# Exact 22 features the model trains on + target
# Everything else in raw dataset gets dropped in ingestion/transformation
KNOWN_FEATURES = [
    'PolicyType', 'BasePolicy', 'Deductible', 'AgentType',
    'Age', 'Sex', 'MaritalStatus', 'AgeOfPolicyHolder', 'Fault',
    'Make', 'VehicleCategory', 'VehiclePrice', 'AgeOfVehicle', 'NumberOfCars', 'AccidentArea',
    'PoliceReportFiled', 'WitnessPresent', 'Days_Policy_Accident', 'Days_Policy_Claim',
    'PastNumberOfClaims', 'NumberOfSuppliments', 'AddressChange_Claim',
    'FraudFound_P',
]


@dataclass
class DataValidationConfig:
    validation_report_path: str = os.path.join('data', 'validation_report.txt')


class DataValidation:
    def __init__(self):
        self.config = DataValidationConfig()

    def validate_columns(self, df: pd.DataFrame) -> bool:
        missing = [c for c in KNOWN_FEATURES if c not in df.columns]
        if missing:
            logger.warning(f'Missing columns: {missing}')
            return False
        extra = [c for c in df.columns if c not in KNOWN_FEATURES]
        if extra:
            logger.info(f'Extra columns (will be dropped): {extra}')
        logger.info('All expected columns present.')
        return True

    def validate_no_nulls(self, df: pd.DataFrame) -> bool:
        null_counts = df.isnull().sum()
        if null_counts.any():
            logger.warning(f'Null values found:\n{null_counts[null_counts > 0]}')
            return False
        logger.info('No null values found.')
        return True

    def initiate_data_validation(self, train_path: str, test_path: str):
        logger.info('Starting data validation...')
        try:
            train_df = pd.read_csv(train_path)
            test_df  = pd.read_csv(test_path)

            train_cols_ok  = self.validate_columns(train_df)
            test_cols_ok   = self.validate_columns(test_df)
            train_nulls_ok = self.validate_no_nulls(train_df)
            test_nulls_ok  = self.validate_no_nulls(test_df)

            dist = train_df[TARGET_COLUMN].value_counts(normalize=True)
            logger.info(f'Target distribution:\n{dist}')

            report = [
                f'Train columns valid : {train_cols_ok}',
                f'Test columns valid  : {test_cols_ok}',
                f'Train no nulls      : {train_nulls_ok}',
                f'Test no nulls       : {test_nulls_ok}',
                f'Train shape         : {train_df.shape}',
                f'Test shape          : {test_df.shape}',
            ]
            os.makedirs('data', exist_ok=True)
            with open(self.config.validation_report_path, 'w') as f:
                f.write('\n'.join(report))

            status = all([train_cols_ok, test_cols_ok, train_nulls_ok, test_nulls_ok])
            logger.info(f'Data validation completed. Status: {status}')
            return status

        except Exception as e:
            raise CustomException(e, sys)