import sqlite3

conn = sqlite3.connect("chatbot.db")
cursor = conn.cursor()
for row in cursor.execute("SELECT * FROM chat_messages"):
    print(row)
conn.close()