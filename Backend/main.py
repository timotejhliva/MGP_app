from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import sqlite3
from datetime import datetime
import json


RACES = [
    {
        "id": 1,
        "number": 1,
        "capacity": 8,
        "completed": False,
        "riders": [
            {"name": "Peter", "type": "adult"},
            {"name": "Janko", "type": "child"}
        ]
    },
    {
        "id": 2,
        "number": 2,
        "capacity": 8,
        "completed": False,
        "riders": []
    }
]

limit_history_message = 5

# ----------------------------------------------------------------------------

conn = sqlite3.connect("motokary.db")
cursor = conn.cursor()

# Tabuľka jázd
cursor.execute("CREATE TABLE IF NOT EXISTS rides ("
               "id INTEGER PRIMARY KEY AUTOINCREMENT, "
               "id_day INTEGER NOT NULL, "
               "date TEXT NOT NULL, "
               "time INTEGER NOT NULL, "
               "adults_count INTEGER NOT NULL, "
               "juniors_count INTEGER NOT NULL, "
               "children_count INTEGER NOT NULL, "
               "note TEXT)"
)

# Tabuľka chatu
cursor.execute("CREATE TABLE IF NOT EXISTS chat_messages ("
               "id INTEGER PRIMARY KEY AUTOINCREMENT, "
               "user TEXT NOT NULL, "
               "message TEXT NOT NULL, "
               "timestamp TEXT NOT NULL)"
)

conn.commit()

# ----------------------------------------------------------------------------

app = FastAPI()

# Povoliť CORS pre React frontend---------------------------------------------
origins = [
    "http://localhost:5173",
    "localhost:5173",
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
# ----------------------------------------------------------------------------






# ----------------------------------------------------------------------------
def insert_ride(date_str, time_int, adults, juniors, children, note):
    cursor.execute("SELECT COUNT(*) FROM rides WHERE date = ?", (date_str,))
    count = cursor.fetchone()[0]
    id_day_count = count + 1

    cursor.execute("INSERT INTO rides (id_day, date, time, adults_count, juniors_count, children_count, note)"
                   "VALUES (?, ?, ?, ?, ?, ?, ?), (id_day_count, date_str, time_int, adults, juniors, children, note)"
                   )
    conn.commit()
    return cursor.lastrowid

def get_rides():
    cursor.execute("SELECT id, id_day, date, time, adults_count, juniors_count, children_count, note FROM rides ORDER BY date DESC, id_day")
    rows = cursor.fetchall()
    rides = []
    for row in rows:
        rides.append({
            "id": row[0],
            "id_day": row[1],
            "date": row[2],
            "time": row[3],
            "adults_count": row[4],
            "juniors_count": row[5],
            "children_count": row[6],
            "note": row[7],
        })
    return rides

def save_msg_to_DB(user: str, message: str):
    conn = sqlite3.connect("motokary.db")
    cursor = conn.cursor()
    timestamp = datetime.utcnow().isoformat()

    cursor.execute("INSERT INTO chat_messages (user, message, timestamp) "
                   "VALUES (?, ?, ?)", (user, message, timestamp))
    conn.commit()
    conn.close()

def get_last_messages(limit: int = 20):
    conn = sqlite3.connect("motokary.db")
    cursor = conn.cursor()

    cursor.execute("SELECT user, message, timestamp FROM chat_messages ORDER BY timestamp DESC LIMIT ?", (limit,))

    rows = cursor.fetchall()
    conn.close()
    # print(rows)

    # Vrátime v chronologickom poradí (najstaršia prvá)
    return [
        {"user": row[0], "message": row[1], "timestamp": row[2]}
        for row in reversed(rows)
    ]

# ----------------------------------------------------------------------------

# API Endpoints

@app.get("/")
async def root():
    return {"message": "Hello World"}

# WebSocket chat
clients: List[WebSocket] = []

@app.websocket("/chat/live")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)

    # 2. Realtime chat komunikácia
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            user = msg.get("user", "anonym")
            message = msg.get("message", "") or msg.get("text", "")

            save_msg_to_DB(user, message)

            for client in clients:
                await client.send_text(data)
    except WebSocketDisconnect:
        clients.remove(websocket)

@app.get("/chat/history")
def get_messages():
    # 1. Pošleme históriu chatu novému klientovi
    history = get_last_messages(limit=limit_history_message)
    print(history)
    return history


@app.get("/api/races")
def get_races():
    return RACES

@app.post("/api/races/{race_id}/confirm")
def confirm_race(race_id: int):
    for race in RACES:
        if race["id"] == race_id:
            race["completed"] = True
            return {"status": "ok"}
    return {"status": "not found"}





