// Escuchar evento click en botón
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('test-btn');
  const resultDiv = document.getElementById('db-result');

  if (button) {
    button.addEventListener('click', () => {
      fetch('/test-db')
        .then(response => response.json())
        .then(data => {
          const statusSpan = document.getElementById('status');
          const versionSpan = document.getElementById('version');
          const messageSpan = document.getElementById('message');

          if (data.status === 'success') {
            statusSpan.textContent = 'Conectado';
            versionSpan.textContent = data.version[0];
            messageSpan.textContent = '✅ ¡Conexión establecida correctamente!';
            messageSpan.classList.remove('text-red-600');
            messageSpan.classList.add('text-green-500');
            resultDiv.classList.remove('hidden');
          } else {
            statusSpan.textContent = 'Error';
            versionSpan.textContent = '';
            messageSpan.textContent = '❌ No se pudo conectar a la base de datos.';
            messageSpan.classList.remove('text-green-500');
            messageSpan.classList.add('text-red-600');
            resultDiv.classList.remove('hidden');
          }
        })
        .catch(err => {
          console.error("Error al cargar datos:", err);
          document.getElementById('message').textContent = '⚠️ Error al realizar la solicitud.';
          document.getElementById('message').classList.add('text-red-600');
          document.getElementById('db-result').classList.remove('hidden');
        });
    });
  }
});
