import base64
import sys
import json
import pandas as pd
from io import BytesIO

data = sys.argv[1]

def process_base64_csv(data):
    try:
        decoded_csv_bytes = base64.b64decode(data)
        csv_buffer = BytesIO(decoded_csv_bytes)
        csv_data = pd.read_csv(csv_buffer)
        result = {'Job_ID': csv_data['Job_ID'].tolist(), 'Job_Title': csv_data['Job_Title'].tolist()}
        print(json.dumps(result))  # Serialize dictionary as JSON


    except Exception as e:
        result = {'error': str(e)}
        print(json.dumps(result))  # Serialize dictionary as JSON


process_base64_csv(data)
