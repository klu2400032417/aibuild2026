import pandas as pd
from sklearn.preprocessing import LabelEncoder

class CategoricalEncoder:
    def __init__(self):
        self.encoders = {}

    def fit_transform(self, df: pd.DataFrame, columns: list) -> pd.DataFrame:
        df_encoded = df.copy()
        for col in columns:
            if col in df_encoded.columns:
                le = LabelEncoder()
                df_encoded[col] = le.fit_transform(df_encoded[col].astype(str))
                self.encoders[col] = le
        return df_encoded

    def transform(self, df: pd.DataFrame, columns: list) -> pd.DataFrame:
        df_encoded = df.copy()
        for col in columns:
            if col in df_encoded.columns and col in self.encoders:
                le = self.encoders[col]
                # Handle unseen labels by mapping to a default or using mapping dict
                classes = le.classes_
                df_encoded[col] = df_encoded[col].apply(
                    lambda x: le.transform([x])[0] if x in classes else -1
                )
        return df_encoded
