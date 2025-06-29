import sqlite3

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
               "note TEXT"
               "grouped INTEGER DEFAULT 0)"

)

# Tabuľka chatu
cursor.execute("CREATE TABLE IF NOT EXISTS chat_messages ("
               "id INTEGER PRIMARY KEY AUTOINCREMENT, "
               "user TEXT NOT NULL, "
               "message TEXT NOT NULL, "
               "timestamp TEXT NOT NULL)"
)

cursor.execute("CREATE TABLE IF NOT EXISTS chat_users ("
               "id INTEGER PRIMARY KEY AUTOINCREMENT,"
               "username TEXT UNIQUE NOT NULL,"
               "created_at TEXT NOT NULL)"
               )
cursor.execute("ALTER TABLE rides ADD COLUMN grouped INTEGER DEFAULT 0")




conn.commit()