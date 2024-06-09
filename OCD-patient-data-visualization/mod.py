import random
import json
import re

# Define possible values and weights
genders = ["Male", "Female"]
marital_statuses = ["Single", "Married", "Divorced"]
obsession_types = ["Harm-related", "Contamination", "Symmetry", "Hoarding", "Religious"]
compulsion_types = ["Checking", "Washing", "Ordering", "Praying", "Counting"]
family_history_choices = ["Yes", "No"]
depression_diagnosis_choices = ["Yes", "No"]
anxiety_diagnosis_choices = ["Yes", "No"]

# Define weights for some fields
genders_weights = [0.495,0.505]
family_history_weights = [0.1, 0.9]
depression_weights = [0.1, 0.9]  # 10% Yes, 90% No
anxiety_weights = [0.1, 0.9]  # 10% Yes, 90% No
obsession_weights = [20, 30, 10, 15, 20]  # Harm-related is twice as likely
compulsion_weights = [25, 25, 20, 15, 15]  # Equal chance for each

# Weights for the above mappings
obsession_to_compulsion_weights = {
    "Harm-related": [0.211, 0.242, 0.211, 0.211, 0.125],
    "Contamination": [0.03, 0.242, 0.242, 0.242, 0.242],
    "Symmetry": [0.211, 0.211, 0.183, 0.211, 0.184],
    "Hoarding": [0.15, 0.15, 0.15, 0.15, 0.4],
    "Religious": [0.14, 0.14, 0.14, 0.14, 0.48]
}

# Function to randomly modify data
def modify_data(data):
    for record in data:
        record["Age"] = random.randint(18, 80)
        record["Gender"] = random.choices(genders, weights=genders_weights, k=1)[0]
        record["Marital Status"] = random.choice(marital_statuses)
        record["Obsession Type"] = random.choices(obsession_types, weights=obsession_weights, k=1)[0]
        record["Compulsion Type"] = random.choices(compulsion_types,
                                                   weights=obsession_to_compulsion_weights[record["Obsession Type"]],
                                                   k=1)[0]
        record["Duration of Symptoms (months)"] =  random.randint(1, 400)
        record["Family History of OCD"] = random.choices(family_history_choices, weights=family_history_weights, k=1)[0]
        record["Depression Diagnosis"] = random.choices(depression_diagnosis_choices, weights=depression_weights, k=1)[0]
        record["Anxiety Diagnosis"] = random.choices(anxiety_diagnosis_choices, weights=anxiety_weights, k=1)[0]

# Read JavaScript data from a file
def read_js_file(file_path):
    with open(file_path, 'r') as file:
        js_content = file.read()
        json_data_match = re.search(r'let ocdData = (\[.*?\])', js_content, re.DOTALL)
        if json_data_match:
            json_data_str = json_data_match.group(1)
            return json.loads(json_data_str)
        else:
            raise ValueError("Could not find JSON data in the provided JavaScript file.")

# Write JSON data back to a JavaScript file
def write_js_file(data, file_path):
    js_content = f"let ocdData = {json.dumps(data, indent=2)}"
    with open(file_path, 'w') as file:
        file.write(js_content)

# Main function
def main():
    input_file_path = '.\data.js'
    output_file_path = 'modified_ocd_data.js'

    # Read the original data
    ocd_data = read_js_file(input_file_path)

    # Modify the data
    modify_data(ocd_data)

    # Write the modified data to a new file
    write_js_file(ocd_data, output_file_path)
    print(f'Modified data has been written to {output_file_path}')

if __name__ == "__main__":
    main()
