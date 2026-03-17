import os
import sys
import pickle
import pandas as pd
from dataclasses import dataclass
from sklearn.preprocessing import StandardScaler
from src.utils.logger import logger
from src.utils.exception import CustomException
from src.components.data_validation import KNOWN_FEATURES, NUMERICAL_COLUMNS, TARGET_COLUMN

# ── Label encoding: categorical string → integer ──────────────────────────────
LABEL_ENCODING_MAP = {
    'Sex':               {'Female': 0, 'Male': 1},
    'MaritalStatus':     {'Divorced': 0, 'Married': 1, 'Single': 2, 'Widow': 3},
    'Fault':             {'Policy Holder': 0, 'Third Party': 1},
    'AgentType':         {'External': 0, 'Internal': 1},
    'AccidentArea':      {'Rural': 0, 'Urban': 1},
    'PoliceReportFiled': {'No': 0, 'Yes': 1},
    'WitnessPresent':    {'No': 0, 'Yes': 1},
    'Make': {
        'Accura': 0, 'BMW': 1, 'Chevrolet': 2, 'Dodge': 3, 'Ferrari': 4,
        'Ford': 5, 'Honda': 6, 'Jaguar': 7, 'Lexus': 8, 'Mazda': 9,
        'Mecedes': 10, 'Mercury': 11, 'Nisson': 12, 'Pontiac': 13,
        'Porche': 14, 'Saab': 15, 'Saturn': 16, 'Toyota': 17, 'VW': 18,
    },
    'VehicleCategory': {'Sedan': 0, 'Sport': 1, 'Utility': 2},
    'VehiclePrice': {
        '20000 to 29000': 0, '30000 to 39000': 1, '40000 to 59000': 2,
        '60000 to 69000': 3, 'less than 20000': 4, 'more than 69000': 5,
    },
    'AgeOfVehicle': {
        '2 years': 0, '3 years': 1, '4 years': 2, '5 years': 3,
        '6 years': 4, '7 years': 5, 'more than 7': 6, 'new': 7,
    },
    'AgeOfPolicyHolder': {
        '16 to 17': 0, '18 to 20': 1, '21 to 25': 2, '26 to 30': 3,
        '31 to 35': 4, '36 to 40': 5, '41 to 50': 6, '51 to 65': 7, 'over 65': 8,
    },
    'Days_Policy_Accident': {
        '1 to 7': 0, '15 to 30': 1, '8 to 15': 2, 'more than 30': 3, 'none': 4,
    },
    'Days_Policy_Claim': {
        '15 to 30': 0, '8 to 15': 1, 'more than 30': 2, 'none': 3,
    },
    'PastNumberOfClaims':  {'1': 0, '2 to 4': 1, 'more than 4': 2, 'none': 3},
    'NumberOfSuppliments': {'1 to 2': 0, '3 to 5': 1, 'more than 5': 2, 'none': 3},
    'AddressChange_Claim': {
        '1 year': 0, '2 to 3 years': 1, '4 to 8 years': 2,
        'no change': 3, 'under 6 months': 4,
    },
    'NumberOfCars': {
        '1 vehicle': 0, '2 vehicles': 1, '3 to 4': 2, '5 to 8': 3, 'more than 8': 4,
    },
    'PolicyType': {
        'Sedan - All Perils': 0, 'Sedan - Collision': 1, 'Sedan - Liability': 2,
        'Sport - All Perils': 3, 'Sport - Collision': 4, 'Sport - Liability': 5,
        'Utility - All Perils': 6, 'Utility - Collision': 7, 'Utility - Liability': 8,
    },
    'BasePolicy': {'All Perils': 0, 'Collision': 1, 'Liability': 2},
}


@dataclass
class DataTransformationConfig:
    scaler_path:      str = os.path.join('artifacts', 'scaler.pkl')
    encoder_map_path: str = os.path.join('artifacts', 'encoder_map.pkl')


class DataTransformation:
    def __init__(self):
        self.config = DataTransformationConfig()
        self.scaler = StandardScaler()

    def encode_categoricals(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        for col, mapping in LABEL_ENCODING_MAP.items():
            if col in df.columns:
                df[col] = df[col].map(mapping).fillna(0).astype(int)
        return df

    def initiate_data_transformation(self, train_path: str, test_path: str):
        logger.info('Starting data transformation...')
        try:
            train_df = pd.read_csv(train_path)
            test_df  = pd.read_csv(test_path)

            os.makedirs('artifacts', exist_ok=True)

            # Step 1: Keep only known features
            known    = [c for c in KNOWN_FEATURES if c in train_df.columns]
            train_df = train_df[known]
            test_df  = test_df[[c for c in known if c in test_df.columns]]
            logger.info(f'Using {len(known) - 1} features')

            # Step 2: Label encode categoricals
            train_df = self.encode_categoricals(train_df)
            test_df  = self.encode_categoricals(test_df)
            logger.info('Label encoding applied.')

            # Step 3: Separate features and target
            X_train = train_df.drop(columns=[TARGET_COLUMN])
            y_train = train_df[TARGET_COLUMN]
            X_test  = test_df.drop(columns=[TARGET_COLUMN])
            y_test  = test_df[TARGET_COLUMN]

            # Step 4: Scale numerical columns (fit on train only — no leakage)
            X_train[NUMERICAL_COLUMNS] = self.scaler.fit_transform(X_train[NUMERICAL_COLUMNS])
            X_test[NUMERICAL_COLUMNS]  = self.scaler.transform(X_test[NUMERICAL_COLUMNS])

            # Step 5: Save artifacts
            with open(self.config.scaler_path, 'wb') as f:
                pickle.dump(self.scaler, f)
            with open(self.config.encoder_map_path, 'wb') as f:
                pickle.dump(LABEL_ENCODING_MAP, f)

            logger.info(f'Train: {X_train.shape} | Test: {X_test.shape}')
            logger.info('Data transformation completed.')

            return (
                X_train.values, y_train.values,
                X_test.values,  y_test.values,
                list(X_train.columns)
            )

        except Exception as e:
            raise CustomException(e, sys)