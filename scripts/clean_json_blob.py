import json
import re

def clean_json_like_string(bad_json_str):
    # Remove any newline characters
    clean_str = bad_json_str.replace("\n", " ").replace("\r", "")
    
    # Replace single quotes with double quotes
    clean_str = clean_str.replace("'", '"')

    # Fix escaped quotes inside values
    clean_str = re.sub(r'\\"', '"', clean_str)

    # Fix trailing commas before closing braces/brackets
    clean_str = re.sub(r',(\s*[}\]])', r'\1', clean_str)

    try:
        return json.loads(clean_str)
    except json.JSONDecodeError as e:
        print("Error parsing:", e)
        print("Raw input:", clean_str[:500])
        return None

# EXAMPLE: paste your raw blob here
raw_blob = """{'price': '11.46', 'price2': {'250': '11.46', '500': '13.22'}, 'productOptions': {'size': '3.5x2', 'stock': '14pt C2S', 'coating': 'UV'}}"""

parsed = clean_json_like_string(raw_blob)

# View results
if parsed:
    print("✅ Clean JSON:")
    print(json.dumps(parsed, indent=2))
