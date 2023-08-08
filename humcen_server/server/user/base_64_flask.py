import pandas as pd
import base64
import sys
from io import BytesIO

def process_base64_csv(data):
    try:
        base64_encoded_csv = sys.argv[1].split(',')[-1]

        if data.startswith("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64"):
            decoded_csv_bytes = base64.b64decode(base64_encoded_csv)
            csv_buffer = BytesIO(decoded_csv_bytes)
            xl_data = pd.read_excel(csv_buffer)
            return {'Job_ID': xl_data['Job_ID'], 'Job_Title': xl_data['Job_Title'], 'Service': xl_data["Service"]}

        elif data.startswith("data:text/csv;base64"):
            decoded_csv_bytes = base64.b64decode(base64_encoded_csv)
            csv_buffer = BytesIO(decoded_csv_bytes)
            csv_data = pd.read_csv(csv_buffer)
            return {'Job_ID': csv_data['Job_ID'], 'Job_Title': csv_data['Job_Title'], 'Service': csv_data['Service']}

        return {'error': 'Invalid data format'}
    except Exception as e:
        return {'error': str(e)}
