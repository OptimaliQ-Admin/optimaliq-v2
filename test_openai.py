from openai import OpenAI
import os

# Load the API Key
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    print("❌ ERROR: OPENAI_API_KEY is missing. Check your .env.local file.")
    exit()

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

# Send test request
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "system", "content": "Say hello!"}],
    max_tokens=50
)

# Print result
print(response.choices[0].message.content)
