// Cliente web: captura formulario y llama a POST /alumnos usando fetch.
const form = document.getElementById("alumnoForm");
const output = document.getElementById("output");

form.addEventListener("submit", async (event) => {
  // Evita que el navegador recargue la página al enviar el formulario.
  event.preventDefault();

  // Leer campos del formulario.
  const nombre = document.getElementById("nombre").value.trim();
  const matricula = document.getElementById("matricula").value.trim();
  const tipo = document.getElementById("tipo").value;
  const token = document.getElementById("token").value.trim();

  const payload = { nombre, matricula, tipo };

  try {
    // Solicitud al servidor Express (mismo origen) usando token en Authorization.
    const response = await fetch("/alumnos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Mostrar status HTTP y cuerpo de respuesta para facilitar pruebas.
    // Se imprime en formato JSON legible dentro del <pre>.
    output.textContent = JSON.stringify(
      {
        status: response.status,
        response: data
      },
      null,
      2
    );
  } catch (error) {
    // Si falla la conexión o el servidor no está disponible, se informa aquí.
    output.textContent = JSON.stringify(
      {
        status: "network_error",
        message: error.message
      },
      null,
      2
    );
  }
});
