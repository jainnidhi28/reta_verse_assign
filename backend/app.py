from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route("/scrape", methods=["GET"])
def scrape():
    url = "https://news.ycombinator.com/"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    headlines = []
    for tag in soup.select(".titleline a"):
        headlines.append({"title": tag.text, "url": tag["href"]})

    return jsonify(headlines)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5050)  
