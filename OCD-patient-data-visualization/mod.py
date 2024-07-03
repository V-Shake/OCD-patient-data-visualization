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
employment_statuses = ["Employed", "Unemployed"]

# Define weights for some fields
genders_weights = [0.462, 0.538]
family_history_weights = [0.12, 0.88]
depression_weights = [0.05, 0.95]  # 10% Yes, 90% No
anxiety_weights = [0.06, 0.94]  # 10% Yes, 90% No
obsession_weights = [20, 30, 10, 15, 20]  # Harm-related is twice as likely
compulsion_weights = [1, 1, 1, 1, 1]  # Equal chance for each

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
        if record["Age"] < 18:
            record["Marital Status"] = "Single"
        else:
            record["Gender"] = random.choices(genders, weights=genders_weights, k=1)[0]
            record["Obsession Type"] = random.choices(obsession_types, weights=obsession_weights, k=1)[0]
        if record["Obsession Type"] == "Symmetry":
            marital_status_weights = [0.1, 0.1, 0.8]  # 80% divorced
        else:
            marital_status_weights = [0.416, 0.368, 0.216]  # Original weights

        record["Marital Status"] = random.choices(marital_statuses, weights=marital_status_weights, k=1)[0]
        record["Obsession Type"] = random.choices(obsession_types, weights=obsession_weights, k=1)[0]
        record["Compulsion Type"] = random.choices(compulsion_types,
                                                   weights=obsession_to_compulsion_weights[record["Obsession Type"]],
                                                   k=1)[0]
        # record["Duration of Symptoms (months)"] = record["Age"] * random.uniform(6, 12)
        record["Duration of Symptoms (months)"] = abs(int(random.gauss(record["Age"], 30) * 3.5 + 50))
        record["Family History of OCD"] = random.choices(family_history_choices, weights=family_history_weights, k=1)[0]

        long_duration_threshold = 450  # Define a threshold for long duration of symptoms in months

        if record["Obsession Type"] == "Hoarding":
            record["Depression Diagnosis"] = random.choices(depression_diagnosis_choices, weights=[0.2, 0.8], k=1)[0]
            record["Anxiety Diagnosis"] = random.choices(anxiety_diagnosis_choices, weights=[0.2, 0.8], k=1)[0]
            record["Employment Status"] = random.choices(employment_statuses, weights=[0.3, 0.7], k=1)[0]
            record["Hoarding Without OCD"] = random.choices(["Yes", "No"], weights=[0.2, 0.8], k=1)[0]
        else:
            record["Depression Diagnosis"] = random.choices(depression_diagnosis_choices, weights=depression_weights, k=1)[0]
            record["Anxiety Diagnosis"] = random.choices(anxiety_diagnosis_choices, weights=anxiety_weights, k=1)[0]
            record["Employment Status"] = random.choices(employment_statuses, weights=[0.9, 0.1], k=1)[0]
            record["Hoarding Without OCD"] = "No"

        if record["Duration of Symptoms (months)"] > long_duration_threshold:
            record["Family History of OCD"] = random.choices(family_history_choices, weights=[0.7, 0.3], k=1)[0]
            record["Depression Diagnosis"] = random.choices(depression_diagnosis_choices, weights=[0.9, 0.1], k=1)[0]
            record["Anxiety Diagnosis"] = random.choices(anxiety_diagnosis_choices, weights=[0.8, 0.2], k=1)[0]

        if record["Marital Status"] == "Married":
            # record["Age"] = max(record["Age"], 30)  # Increased age
            if record["Obsession Type"] == "Hoarding":
                record["Hoarding"] = random.uniform(1, 5) * 0.7  # Lower severity of hoarding

        if record["Marital Status"] == "Divorced":
            # record["Age"] = max(record["Age"], 40)  # Increased age
            if record["Obsession Type"] == "Symmetry":
                record["Symmetry"] = random.uniform(1, 5) * 1.3  # Higher severity of symmetry


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
    input_file_path = './data.js'
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
