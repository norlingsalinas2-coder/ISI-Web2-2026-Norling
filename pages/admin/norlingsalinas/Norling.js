import TeamsService from "../../../shared/services/teams.service.js";
import TeamRequest from "../../../shared/models/request/team.request.js";

const API_URL = "https://localhost:7286/api/Teams";

const getHeaders = (includeContentType = false) => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    const token = tokenData?.token;
    const headers = { "Authorization": `Bearer ${token}` };
    if (includeContentType) headers["Content-Type"] = "application/json";
    return headers;
};
let teams = [];
let editandoId = null;

window.onload = function () {
    cargarTeams();
};

async function cargarTeams() {
    try {
        const response = await fetch(API_URL, {
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error("No se pudieron cargar los equipos");
        }

        teams = await response.json();
        mostrarTeams(teams);

    } catch (error) {
        mostrarMensaje(error.message, true);
        console.error(error);
    }
}

function mostrarTeams(lista) {
    let html = "";

    lista.forEach(team => {
        html += `
        <tr>
            <td>${team.id}</td>
            <td>${team.name}</td>
            <td>${team.description}</td>
            <td>
                <button onclick="editarTeam(${team.id}, '${team.name}', '${team.description}')">
                    Editar
                </button>
                <button onclick="eliminarTeam(${team.id})">
                    Eliminar
                </button>
            </td>
        </tr>`;
    });

    document.getElementById("teamsBody").innerHTML = html;
}

async function guardarTeam() {
    const nombre = document.getElementById("teamName").value.trim();
    const descripcion = document.getElementById("teamDescription").value.trim();

    if (nombre === "" || descripcion === "") {
        mostrarMensaje("Debe ingresar nombre y descripción", true);
        return;
    }

    try {
        if (editandoId === null) {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: getHeaders(true),
                body: JSON.stringify({ name: nombre, description: descripcion })
            });

            if (!response.ok) throw new Error("Error al crear equipo");
            mostrarMensaje("Equipo creado correctamente");

        } else {
            const response = await fetch(`${API_URL}/${editandoId}`, {
                method: "PUT",
                headers: getHeaders(true),
                body: JSON.stringify({ name: nombre, description: descripcion })
            });

            if (!response.ok) throw new Error("Error al actualizar equipo");
            mostrarMensaje("Equipo actualizado");
            editandoId = null;
        }

        document.getElementById("teamName").value = "";
        document.getElementById("teamDescription").value = "";
        cargarTeams();

    } catch (error) {
        console.error(error);
        mostrarMensaje(error.message, true);
    }
}

function editarTeam(id, nombre, descripcion) {
    editandoId = id;
    document.getElementById("teamName").value = nombre;
    document.getElementById("teamDescription").value = descripcion;
}

async function eliminarTeam(id) {
    if (!confirm("¿Desea eliminar este equipo?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });

        if (!response.ok) throw new Error("Error al eliminar");
        mostrarMensaje("Equipo eliminado");
        cargarTeams();

    } catch (error) {
        console.error(error);
        mostrarMensaje(error.message, true);
    }
}

function buscarTeam() {
    const texto = document.getElementById("buscar").value.toLowerCase();
    const filtrados = teams.filter(team => team.name.toLowerCase().includes(texto));
    mostrarTeams(filtrados);
}

function mostrarMensaje(mensaje, error = false) {
    const elemento = document.getElementById("mensaje");
    elemento.innerText = mensaje;
    elemento.style.color = error ? "red" : "green";
    setTimeout(() => { elemento.innerText = ""; }, 3000);
}

window.guardarTeam = guardarTeam;
window.editarTeam = editarTeam;
window.eliminarTeam = eliminarTeam;
window.buscarTeam = buscarTeam;