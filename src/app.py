# app.py
import os
import time
from fastapi import FastAPI, Response
from fastapi.responses import HTMLResponse

app = FastAPI()
NODE_NAME = os.getenv("NODE_NAME", "unknown-node")
POD_NAME = os.getenv("POD_NAME", "unknown-pod")

@app.get("/", response_class=HTMLResponse)
def index():
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Chaos Kiosk - Wreck Me</title>
        <style>
            body {{ font-family: monospace; background: #121212; color: #00ff66; padding: 40px; text-align: center; }}
            .card {{ border: 2px solid #00ff66; padding: 20px; display: inline-block; border-radius: 8px; }}
            button {{ background: #ff0055; color: white; border: none; padding: 12px 24px; font-weight: bold; cursor: pointer; margin: 10px; }}
            button:hover {{ background: #ff3300; }}
        </style>
    </head>
    <body>
        <div class="card">
            <h1>💥 Дневник: «Сломай меня»</h1>
            <p><b>Узел (Node):</b> {NODE_NAME}</p>
            <p><b>Под (Pod):</b> {POD_NAME}</p>
            <hr>
            <button onclick="fetch('/api/ping')">Сделать запрос (/ping)</button>
            <button onclick="fetch('/api/crash')">Убить процесс (Crash)</button>
        </div>
    </body>
    </html>
    """

@app.get("/api/ping")
def ping():
    return {"status": "ok", "pod": POD_NAME, "node": NODE_NAME}

@app.get("/api/crash")
def crash():
    # Искусственное аварийное завершение процесса для проверки самовосстановления K8s
    os._exit(1)