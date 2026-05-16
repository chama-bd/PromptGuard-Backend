#!/usr/bin/env python3
import subprocess
import json
import sys
import urllib.request
import urllib.parse
import os

API_URL = "http://localhost:8080/api/alerts"

def print_red(text):
    print(f"\033[91m{text}\033[0m")

def run_detect_secrets():
    try:
        # Run detect-secrets on staged files
        result = subprocess.run(
            ['detect-secrets', 'scan', '--cached'],
            capture_output=True,
            text=True
        )
        return json.loads(result.stdout)
    except FileNotFoundError:
        print_red("Error: 'detect-secrets' is not installed. Please run 'pip install detect-secrets'")
        sys.exit(1)
    except json.JSONDecodeError:
        # If output is not JSON, it might be empty or an error occurred
        return {"results": {}}

def send_alert(file_path, line_number, credential_type):
    data = {
        "type": "GIT_COMMIT",
        "severity": "HIGH",
        "employeeId": "00000000-0000-0000-0000-000000000000", # Default for demo
        "message": f"Credential '{credential_type}' found in {file_path} at line {line_number} before commit!"
    }
    
    req = urllib.request.Request(API_URL, method="POST")
    req.add_header('Content-Type', 'application/json')
    json_data = json.dumps(data).encode('utf-8')
    
    try:
        urllib.request.urlopen(req, data=json_data, timeout=2)
    except Exception as e:
        # Ignore connection errors so we don't block the commit just because the server is down
        print(f"Warning: Could not send alert to server: {e}")

def main():
    print("Running detect-secrets pre-commit hook...")
    
    # Check if we have staged files
    staged_files = subprocess.run(
        ['git', 'diff', '--cached', '--name-only'],
        capture_output=True, text=True
    ).stdout.strip().split('\n')
    
    if not staged_files or staged_files == ['']:
        sys.exit(0)
        
    scan_results = run_detect_secrets()
    results = scan_results.get("results", {})
    
    found_secrets = False
    
    for file_path, secrets in results.items():
        # detect-secrets sometimes scans unstaged files too if not careful, 
        # but --cached usually handles it. We just iterate what it found.
        for secret in secrets:
            found_secrets = True
            line_num = secret.get("line_number", "Unknown")
            type_str = secret.get("type", "Unknown Credential")
            
            print_red(f"❌ [BLOCKED] Secret detected in {file_path}:{line_num} ({type_str})")
            send_alert(file_path, line_num, type_str)

    if found_secrets:
        print_red("\nCommit blocked! Please remove the credentials from your code.")
        sys.exit(1)
        
    sys.exit(0)

if __name__ == "__main__":
    main()
