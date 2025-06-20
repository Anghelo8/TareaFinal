from flask import Flask, jsonify, render_template
import mysql.connector

app = Flask(__name__)

# Configuración de la base de datos (directa en el código)
db_config = {
    "host": "tareafinal.cjcko4j36hk3.us-east-1.rds.amazonaws.com",  # Endpoint RDS
    "user": "admin",       # Usuario de RDS
    "password": "admin2025",  # Contraseña de usuario
    "database": "Tarea"    # Nombre de la base de datos
}

# Ruta principal: Sirve el archivo index.html
@app.route('/')
def home():
    return render_template('index.html')

# Ruta para probar conexión a la base de datos
@app.route('/test-db')
def test_db():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT VERSION()")
        version = cursor.fetchone()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "version": version})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# Iniciar la aplicación
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
