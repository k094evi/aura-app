import os
import urllib.request
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("JSEARCH_API_KEY")

print("Key loaded:", bool(key))
print("Key prefix:", key[:8] + "..." if key else "NONE")
print("Key length:", len(key) if key else 0)

params = urllib.parse.urlencode({
    "query": "UI/UX Designer Philippines",
    "num_pages": "1",
    "date_posted": "all",
})

url = f"https://jsearch.p.rapidapi.com/search-v2?{params}"

if not key:
    raise RuntimeError("JSEARCH_API_KEY was not loaded from .env")

request = urllib.request.Request(
    url,
    headers={
        "x-rapidapi-key": key,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
)

try:
    with urllib.request.urlopen(request, timeout=30) as response:
        body = response.read().decode()

        print()
        print("STATUS:", response.status)
        print("RESPONSE:")
        print(body[:1000])

except Exception as error:
    print()
    print("REQUEST FAILED:")
    print(repr(error))