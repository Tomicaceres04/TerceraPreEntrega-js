document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos HTML importantes
    let notasContainer = document.getElementById('notas-container');
    let formularioNota = document.getElementById('formulario-nota');

    // Funcion para cambiar el modo
    function cambiarModo() {
        let modoActual = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';

        // Alternar entre modos
        let nuevoModo = (modoActual == 'light-mode') ? 'dark-mode' : 'light-mode';

        document.body.classList.remove(modoActual);
        document.body.classList.add(nuevoModo);
        localStorage.setItem('modo', nuevoModo);
    }

    let preferencia = localStorage.getItem('modo') || 'dark-mode';
    document.body.classList.add(preferencia);

    let boton_modo = document.getElementById('boton_modo');

    boton_modo.addEventListener('click', (event) => {
        event.preventDefault();
        cambiarModo();
    });




    // Array para almacenar las notas del usuario, inicializado con el contenido del o un array vacío
    let notas = JSON.parse(localStorage.getItem('notas')) || [];

    // Variable para almacenar el índice de la nota en edicion
    let indiceEdicion = null;

    // Función para renderizar las notas en el contenedor
    function renderizarNotas() {
        notasContainer.innerHTML = '';  // Limpiar el contenedor antes de agregar nuevas notas
        notas.forEach((nota, index) => {
            // Crear elementos HTML para cada nota
            let notaElement = document.createElement('div');
            notaElement.classList.add('nota');
            notaElement.innerHTML = `
                <h3>${nota.titulo}</h3>
                <p>${nota.contenido}</p>
                <button onclick="editarNota(${index})">Editar</button>
                <button onclick="eliminarNota(${index})">Eliminar</button>
            `;
            notasContainer.appendChild(notaElement);
        });
    }

    // Función para agregar o editar una nota
    function agregarNota() {
        let tituloInput = document.getElementById('titulo');
        let contenidoInput = document.getElementById('contenido');

        let nuevaNota = {
            titulo: tituloInput.value || "Sin título",
            contenido: contenidoInput.value || "Sin contenido"
        };

        if (indiceEdicion !== null) {
            // Si estamos editando, reemplazamos la nota existente en lugar de agregar una nueva
            notas[indiceEdicion] = nuevaNota;
            indiceEdicion = null; // Resetear el indice de edicion
        } else {
            // Si estamos agregando, simplemente añadimos la nueva nota al array
            notas.push(nuevaNota);
        }

        // Limpiar el formulario despues de agregar/editar la nota
        formularioNota.reset();

        localStorage.setItem('notas', JSON.stringify(notas));
        renderizarNotas();  // Actualizar la visualización despues de la adicion o edicion
    }

    // Funcion para editar una nota existente
    window.editarNota = function (i) {
        let notaEditada = notas[i];

        // Rellenar el formulario con los detalles de la nota seleccionada
        document.getElementById('titulo').value = notaEditada.titulo;
        document.getElementById('contenido').value = notaEditada.contenido;

        // Actualizar el indice de edicion
        indiceEdicion = i;

        // Cambiar el texto del boton del formulario
        formularioNota.querySelector('button[type="submit"]').textContent = 'Editar Nota';
    }

    // Funcion para eliminar una nota
    window.eliminarNota = function (i) {
        if (confirm("¿Seguro que quieres eliminar esta nota?")) {
            notas.splice(i, 1);
            localStorage.setItem('notas', JSON.stringify(notas));

            renderizarNotas();  // Actualizar la visualizacion despues de la eliminacion
        }
    }

    // Nueva funcion para cancelar la edicion y limpiar el formulario
    function cancelarEdicion() {
        formularioNota.reset();
        indiceEdicion = null;
        // Cambiar el texto del boton del formulario al original
        formularioNota.querySelector('button[type="submit"]').textContent = 'Agregar/Editar Nota';
    }

    // Agregar un EventListener al formulario para manejar la entrada del usuario
    formularioNota.addEventListener('submit', function (e) {
        e.preventDefault();
        agregarNota();
    });

    // Asignar evento de clic al boton Cancelar Edicion
    let cancelarEdicionboton = document.getElementById('cancelar-edicion');
    if (cancelarEdicionboton) {
        cancelarEdicionboton.addEventListener('click', cancelarEdicion);
    }

    // Llamar inicialmente a renderizarNotas para cargar cualquier nota existente al cargar la pagina por primera vez
    renderizarNotas();
});
