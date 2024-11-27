import subprocess

contest_slug_input = "biweekly-contest-140"  # Replace this.

# Run data_acquisition.py and pass the input
print("Running data_acquisition.py...")
subprocess.run(
    ["python", "submissions_data/data_acquisition.py"],
    input=f"{contest_slug_input}\n",  # Provide the input followed by a newline
    text=True  # Ensures input is passed as text
)

# Run main.py after data_acquisition.py completes
print("Running main.py...")
subprocess.run(
    ["python", "main.py"],
    input=f"{contest_slug_input}\n",  # Provide the input followed by a newline
    text=True  # Ensures input is passed as text
)