const form = document.getElementById("alumnoForm");
const editForm = document.getElementById("editForm");
const output = document.getElementById("output");
const tokenInput = document.getElementById("token");
const studentsBody = document.getElementById("studentsBody");
const totalStudents = document.getElementById("totalStudents");
const activeStudents = document.getElementById("activeStudents");
const lastUpdate = document.getElementById("lastUpdate");
const loadBtn = document.getElementById("loadBtn");
const refreshBtn = document.getElementById("refreshBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editMatriculaInput = document.getElementById("editMatricula");
const editNombreInput = document.getElementById("editNombre");

let studentsCache = [];

function getAuthHeader() {
  const token = tokenInput.value.trim();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

function printResponse(status, response) {
  output.textContent = JSON.stringify({ status, response }, null, 2);
}

function formatDate(isoDate) {
  if (!isoDate) {
    return "-";
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderStats(students) {
  totalStudents.textContent = String(students.length);
  activeStudents.textContent = String(students.filter((student) => student.estado === "activo").length);

  const latest = students
    .map((student) => student.updatedAt)
    .filter(Boolean)
    .sort()
    .pop();

  lastUpdate.textContent = formatDate(latest);
}

function setEditForm(student) {
  editMatriculaInput.value = student.matricula;
  editNombreInput.value = student.nombre;
}

function clearEditForm() {
  editMatriculaInput.value = "";
  editNombreInput.value = "";
}

function renderTable(students) {
  if (!students.length) {
    studentsBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty">No hay alumnos registrados</td>
      </tr>
    `;
    return;
  }

  studentsBody.innerHTML = students
    .map(
      (student) => `
        <tr>
          <td>${student.matricula}</td>
          <td>${student.nombre}</td>
          <td>${student.estado || "-"}</td>
          <td>${student.ultimaOperacion || "-"}</td>
          <td>${formatDate(student.updatedAt)}</td>
          <td>
            <div class="table-actions">
              <button type="button" data-action="edit" data-matricula="${student.matricula}">Editar</button>
              <button type="button" data-action="delete" data-matricula="${student.matricula}" class="danger">Eliminar</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

async function loadStudents() {
  try {
    const response = await fetch("/alumnos", {
      method: "GET",
      headers: getAuthHeader()
    });

    const data = await response.json();
    printResponse(response.status, data);

    if (!response.ok) {
      return;
    }

    studentsCache = data.data || [];
    renderTable(studentsCache);
    renderStats(studentsCache);
  } catch (error) {
    printResponse("network_error", { message: error.message });
  }
}

async function createStudent(event) {
  event.preventDefault();

  const payload = {
    nombre: document.getElementById("nombre").value.trim(),
    matricula: document.getElementById("matricula").value.trim(),
    tipo: document.getElementById("tipo").value
  };

  try {
    const response = await fetch("/alumnos", {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    printResponse(response.status, data);

    if (response.ok) {
      form.reset();
      await loadStudents();
    }
  } catch (error) {
    printResponse("network_error", { message: error.message });
  }
}

async function updateStudent(event) {
  event.preventDefault();

  const matricula = editMatriculaInput.value.trim();
  const nombre = editNombreInput.value.trim();

  if (!matricula) {
    printResponse(400, { message: "Selecciona un alumno para editar." });
    return;
  }

  try {
    const response = await fetch(`/alumnos/${encodeURIComponent(matricula)}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify({ nombre })
    });

    const data = await response.json();
    printResponse(response.status, data);

    if (response.ok) {
      clearEditForm();
      await loadStudents();
    }
  } catch (error) {
    printResponse("network_error", { message: error.message });
  }
}

async function deleteStudent(matricula) {
  const confirmed = globalThis.confirm(`¿Eliminar alumno ${matricula}?`);
  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/alumnos/${encodeURIComponent(matricula)}`, {
      method: "DELETE",
      headers: getAuthHeader()
    });

    const data = await response.json();
    printResponse(response.status, data);

    if (response.ok) {
      if (editMatriculaInput.value.trim() === matricula) {
        clearEditForm();
      }
      await loadStudents();
    }
  } catch (error) {
    printResponse("network_error", { message: error.message });
  }
}

studentsBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.dataset.action;
  const matricula = target.dataset.matricula;

  if (!action || !matricula) {
    return;
  }

  if (action === "edit") {
    const student = studentsCache.find((item) => item.matricula === matricula);
    if (student) {
      setEditForm(student);
    }
    return;
  }

  if (action === "delete") {
    deleteStudent(matricula);
  }
});

form.addEventListener("submit", createStudent);
editForm.addEventListener("submit", updateStudent);

cancelEditBtn.addEventListener("click", () => {
  clearEditForm();
});

loadBtn.addEventListener("click", () => {
  loadStudents();
});

refreshBtn.addEventListener("click", () => {
  loadStudents();
});
