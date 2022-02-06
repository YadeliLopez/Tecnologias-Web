console.log("Hola")

const formulario = document.getElementById("formulario");
const input = document.getElementById("input");
const listaTareas = document.getElementById("listaTareas");
const template = document.getElementById("template").content;
const fragment = document.createDocumentFragment();

//Colección de objetos
let tareas = {}

//Cuando se lee todo el HTML pinte las tareas.
document.addEventListener("load", "DOMContentLoaded", () => {
    if(localStorage.getItem("tareas")) {
        tareas = JSON.parse(localStorage.getItem("tareas"));
    }
    pintarTareas();
});

listaTareas.addEventListener("load", "click", e => {
    btnAccion(e);
});

//console.log(Date.now());

formulario.addEventListener("load", 'submit', e => {
    e.preventDefault();
   // console.log(input.value);

    setTarea(e)

});

//Evaluar si el input contiene algo o no.
const setTarea = e => {
    if(input.value.trim() === ""){
        console.log("esta vacío");
        return;
    }
    //Construimos el objeto
    const tarea = {
        id: Date.now(),
        texto: input.value,
        estado: false
    }
    tareas[tareas.id] = tarea;
    //console.log(tareas);
    formulario.reset();
    input.focus();
    pintarTareas();
}

const pintarTareas = () => {

    localStorage.setItem("tareas", JSON.stringify(tareas));

    if(Object.values(tareas).length === 0){
        listaTareas.innerHTML = `
        <div class="alert alert-dark text-center">
        Sin tareas pendientes 😃
        </div>
        `
        return;
    }

    listaTareas.innerHTML = ""; //Al momento de agregar otra tarea no se añadirán las anteriores
    Object.values(tareas).forEach(tarea => {
        //console.log(tarea);
        //cuando tenemos un template hay que hacer clon primero
        const clone = template.cloneNode(true);
        clone.querySelector("p").textContent = tarea.texto;

        if(tarea.estado){
            clone.querySelector("alert").classList.replace("alert-warning", "alert-primary");
            clone.querySelector(".fas")[0].classList.replace("fa-check-circle", "fa-undo-alt");
            clone.querySelector("p").style.textDecoration = "line-through"
        }

        clone.querySelectorAll(".fas")[0].dataset.id = tareas.id;
        clone.querySelectorAll(".fas")[1].dataset.id = tareas.id;
        fragment.appendChild(clone);
    })

    listaTareas.appendChild(fragment);
}

const btnAccion = e => {
    //console.log(e.target.classList.contains("fa-check-circle"));
    if(e.target.classList.contains("fa-check-circle")){
        console.log(e.target.dataset.id);
        tareas[e.target.dataset.id].estado = true;
        pintarTareas();
        //console.log(tareas);
    }

    if(e.target.classList.contains("fa-minus-circle")){
        delete tareas[e.target.dataset.id];
        pintarTareas();
    }

    if(e.target.classList.contains("fa-undo-alt")){
        tareas[e.target.dataset.id].estado = false;
        pintarTareas();
        //console.log(tareas);
    }

    e.stopPropagation();
}