const API_URL = "https://localhost:5001/api/Teams";

let teams = [];
let editandoId = null;

window.onload = cargarTeams;

async function cargarTeams(){

    try{

        const response =
            await fetch(API_URL);

        if(!response.ok){
            throw new Error();
        }

        teams = await response.json();

        mostrarTeams(teams);

        document
        .getElementById("contador")
        .innerText =
        `Total equipos: ${teams.length}`;

    }catch{

        mostrarMensaje(
            "Error al cargar datos",
            true
        );
    }
}

function mostrarTeams(lista){

    let html="";

    lista.forEach(team=>{

        html += `
        <tr>

        <td>${team.id}</td>

        <td>${team.name}</td>

        <td>

        <button onclick="
            editarTeam(
                ${team.id},
                '${team.name}'
            )">

            Editar

        </button>

        <button onclick="
            eliminarTeam(
                ${team.id}
            )">

            Eliminar

        </button>

        </td>

        </tr>
        `;
    });

    document
    .getElementById("teamsBody")
    .innerHTML = html;
}

async function guardarTeam(){

    const nombre =
        document
        .getElementById("teamName")
        .value
        .trim();

    if(nombre.length < 3){

        mostrarMensaje(
            "Mínimo 3 caracteres",
            true
        );

        return;
    }

    try{

        if(editandoId == null){

            await fetch(API_URL,{

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({
                    name:nombre
                })

            });

            mostrarMensaje(
                "Equipo creado"
            );

        }else{

            await fetch(
                `${API_URL}/${editandoId}`,
                {

                    method:"PUT",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({
                        name:nombre
                    })
                }
            );

            mostrarMensaje(
                "Equipo actualizado"
            );

            editandoId = null;
        }

        document
        .getElementById("teamName")
        .value = "";

        cargarTeams();

    }catch{

        mostrarMensaje(
            "Error al guardar",
            true
        );
    }
}

function editarTeam(id,nombre){

    editandoId=id;

    document
    .getElementById("teamName")
    .value=nombre;
}

async function eliminarTeam(id){

    if(
        !confirm(
            "¿Seguro que desea eliminar?"
        )
    ){
        return;
    }

    try{

        await fetch(
            `${API_URL}/${id}`,
            {
                method:"DELETE"
            }
        );

        mostrarMensaje(
            "Equipo eliminado"
        );

        cargarTeams();

    }catch{

        mostrarMensaje(
            "Error al eliminar",
            true
        );
    }
}

function buscarTeam(){

    const texto =
        document
        .getElementById("buscar")
        .value
        .toLowerCase();

    const filtrados =
        teams.filter(t =>
            t.name.toLowerCase()
            .includes(texto)
        );

    mostrarTeams(filtrados);
}

function mostrarMensaje(
    texto,
    error=false
){

    const mensaje =
        document.getElementById(
            "mensaje"
        );

    mensaje.innerText = texto;

    mensaje.style.color =
        error ? "red" : "green";

    setTimeout(() => {

        mensaje.innerText = "";

    },3000);
}
