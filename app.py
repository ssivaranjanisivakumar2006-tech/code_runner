from flask import Flask, send_from_directory
import os

app = Flask(__name__)


@app.route("/")
def home():
    return send_from_directory(
        os.path.dirname(os.path.abspath(__file__)),
        "index.html"
    )


@app.route("/<path:filename>")
def files(filename):
    return send_from_directory(
        os.path.dirname(os.path.abspath(__file__)),
        filename
    )


if __name__ == "__main__":
    app.run(debug=True)