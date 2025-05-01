from flask import Flask, render_template
from flask_cors import CORS

app = Flask(__name__,
    template_folder='./www',
    static_folder='./www',
    static_url_path='/'
)
CORS(app)  # 모든 도메인에서의 접근을 허용

@app.route('/')
def index():
    return "Hello, World! 이것은 Flask 서버입니다."

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
