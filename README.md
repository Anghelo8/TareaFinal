# Tarea Final: Despliegue de Aplicación Web en AWS EC2 con IP Estática

## Documento Técnico

### Tecnologías utilizadas
- **Backend**: Python + Flask
- **Frontend**: HTML + Tailwind CSS (compilado localmente)
- **Base de Datos**: MySQL en Amazon RDS
- **Servidor Web**: Instancia EC2 en AWS (Debian)
- **IP Pública**: Asignada mediante IP Elástica de AWS
- **Despliegue**: Uso de entorno virtual (venv) y servidor Gunicorn

## Conexión a la Instancia EC2 usando PuTTY


# Pasos para conexión:
1. Convertir llave .pem a .ppk usando PuTTYgen
2. Configurar PuTTY con:
   - Host: admin@54.156.54.245
   - Port: 22
   - Connection type: SSH
   - Cargar archivo .ppk en Auth
Configuración del Servidor EC2

# Comandos para configuración inicial
sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip python3-venv git -y
sudo apt install python3-distutils -y

# Clonar repositorio y configurar entorno
git clone https://github.com/tuusuario/tuproyecto.git
cd tuproyecto
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

Archivos del Proyecto
requirements.txt
Flask==2.3.0
mysql-connector-python==8.0.33
gunicorn==21.2.0

app.py
from flask import Flask, render_template, jsonify
import mysql.connector

app = Flask(__name__)

# Configuración de la base de datos
db_config = {
    "host": "tareafinal.cjcko4j36hk3.us-east-1.rds.amazonaws.com",
    "user": "admin",
    "password": "admin2025",
    "database": "Tarea"
}

@app.route('/')
def home():
    return render_template('index.html')

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

  templates/index.html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Flask + Tailwind CSS</title>
  <link href="/static/css/tailwind.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 min-h-screen flex items-center justify-center px-4">

  <div class="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 text-center">
    <h1 class="text-3xl font-extrabold text-gray-900 mb-4">¡Hola! 👋</h1>
    <p class="text-lg text-gray-700 mb-6">
      Esta es mi aplicación Flask con <span class="font-semibold text-pink-600">Tailwind CSS</span> y conexión a una base de datos remota en <span class="font-semibold text-blue-600">AWS RDS</span>.
    </p>

    <button id="test-btn"
            class="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-medium rounded-lg shadow-md transition duration-300 transform hover:scale-105 focus:outline-none">
      🧪 Probar conexión a la BD
    </button>

    <div id="db-result" class="mt-6 text-left text-sm text-gray-600 space-y-2 hidden">
      <p><strong>Estado:</strong> <span id="status" class="text-green-600">Conectado</span></p>
      <p><strong>Versión de MySQL:</strong> <span id="version" class="font-mono">8.0.33</span></p>
      <p id="message" class="text-green-500 mt-2">✅ ¡Conexión establecida correctamente!</p>
    </div>

    <script src="/static/js/main.js"></script>

    <footer class="mt-8 text-xs text-gray-400">
      &copy; 2025 - Hecho con amor 💛 usando Flask, Tailwind CSS local y AWS RDS
    </footer>
  </div>
</body>
</html>


static/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('test-btn');
  if (!button) return;

  button.addEventListener('click', () => {
    fetch('/test-db')
      .then(response => response.json())
      .then(data => {
        const resultDiv = document.getElementById('db-result');
        const statusSpan = document.getElementById('status');
        const versionSpan = document.getElementById('version');
        const messageSpan = document.getElementById('message');

        if (data.status === 'success') {
          statusSpan.textContent = 'Conectado';
          versionSpan.textContent = data.version[0];
          messageSpan.textContent = '✅ ¡Conexión establecida correctamente!';
          resultDiv.classList.remove('hidden');
        } else {
          statusSpan.textContent = 'Error';
          versionSpan.textContent = '';
          messageSpan.textContent = '❌ No se pudo conectar a la base de datos.';
          messageSpan.className = 'text-red-600 mt-2';
          resultDiv.classList.remove('hidden');
        }
      })
      .catch(err => {
        console.error("Error al cargar datos:", err);
        const messageSpan = document.getElementById('message');
        messageSpan.textContent = '⚠️ Error al realizar la solicitud.';
        messageSpan.className = 'text-red-600 mt-2';
        document.getElementById('db-result').classList.remove('hidden');
      });
  });
});

🧱 10. Instalación de Tailwind CSS (Local)
✅ Requisitos previos
Instalar Node.js en tu máquina local:

Descargar desde: https://nodejs.org
🧰 Pasos en tu máquina local
Crea una carpeta vacía para tu proyecto
npm init -y
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

Crea tailwind.config.js con este contenido:
module.exports = {
  content: ["./templates/**/*.html"],
  theme: { extend: {} },
  plugins: []
}

Crea input.css en /static/css/:
@tailwind base;
@tailwind components;
@tailwind utilities;

Compila Tailwind:

npx tailwindcss -i ./static/css/input.css -o ./static/css/tailwind.css

Luego sube todo a GitHub o directamente a tu servidor EC2.
📤 Cómo Subir tu Proyecto a GitHub – Guía Paso a Paso (con Token Personal)
1. Configura Git globalmente
Primero, configura tu nombre de usuario y correo electrónico en Git:

bash

git config --global user.name "tu-nombre-de-usuario"
git config --global user.email "tucorreo@example.com"
Reemplaza "tu-nombre-de-usuario" por tu nombre de usuario de GitHub y "tucorreo@example.com" por el correo asociado a tu cuenta de GitHub.

Estos datos se usan para identificar tus commits.

2. Crea un token de acceso personal en GitHub (Classic)
GitHub ya no permite autenticarse con contraseña directamente. Debes usar un token personal .

Pasos:
Ingresa a tu cuenta de GitHub.
Ve a Settings → Developer settings → Personal access tokens → Tokens (classic)
Haz clic en Generate new token → Generate new token (classic)
Selecciona los permisos necesarios (recomendado: repo, write:repo_hook, read:user)
Genera el token y copia su valor inmediatamente (no podrás verlo otra vez)
3. Crea tu repositorio local en Debian/EC2
Dentro de la carpeta de tu proyecto, ejecuta estos comandos:

bash


1
2
3
git init
git add .
git commit -m "Versión inicial del proyecto Flask + Tailwind CSS + RDS"
Esto prepara todos tus archivos para ser subidos a GitHub.

4. Crea un repositorio vacío en GitHub
Ingresa a https://github.com → Haz clic en New repository

Escribe un nombre, por ejemplo: flask-tailwind-rds-proyecto
Deja el repositorio público o privado según lo requieras
No selecciones ninguna opción como “Initialize with README”
Haz clic en Create repository
5. Vincula tu repositorio local con GitHub
Usa este comando para vincular tu proyecto local al remoto:

bash


1
git remote add origin https://github.com/tu-usuario/tu-repo.git 
Reemplaza tu-usuario por tu nombre de usuario de GitHub y tu-repo por el nombre del repositorio que creaste.

6. Sube tu proyecto a GitHub
Ejecuta:

bash

git branch -M main
git push -u origin main
Te pedirá que ingreses tus credenciales. Aquí debes usar:

Usuario: Tu nombre de usuario de GitHub
Contraseña: El token personal (classic) que generaste antes
⚠️ Importante: Si estás usando HTTPS, cada vez que hagas git push, te pedirá tus credenciales. En cambio, si prefieres no escribirlas siempre, puedes usar SSH (ver más abajo). 

🔁 Resumen de Comandos (listo para copiar y pegar)
bash


# Configuración global de Git
git config --global user.name "tu-usuario-github"
git config --global user.email "tucorreo@example.com"

# Inicializa repositorio y añade archivos
git init
git add .
git commit -m "Versión inicial del proyecto Flask + Tailwind CSS + RDS"

# Conecta con tu repo remoto
git remote add origin https://github.com/tu-usuario/tu-repo.git 

# Renombra rama principal y sube todo
git branch -M main
git push -u origin main
Cuando te pida usuario y contraseña , escribe:

Usuario: tu-nombre-de-usuario-en-github
Contraseña: tu-token-personal-classic


⚠️ 11. Problemas Comunes y Soluciones
No puedo acceder a
/test-db
Puerto no abierto en Security Group
Abre el puerto 5000 en EC2
Error:
Can't connect to MySQL server on 'localhost'
No se usan bien las credenciales
Verifica que
db_config
use los valores correctos
Error:
Connection refused
en RDS
Seguridad en RDS mal configurada
Permite acceso desde IP de EC2 y/o tu IP local
Página sin estilo
Tailwind CSS no está cargando
Verifica que el archivo
tailwind.css
esté compilado y accesible
App se cierra al cerrar terminal
No se ejecuta en segundo plano
Usa
screen
o
systemd
para dejarla corriendo



