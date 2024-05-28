Swal.fire({
    title: "Identifíquese",
    input: "text",
    text: "Ingrese su Correo Electrónico",
    inputValidator: (value) => {
        return !value && "Debe ingresar un Email...!!!";
    },
    allowOutsideClick: false
}).then((datos) => {
    if (datos.value) {
        let nombre = datos.value;
        document.title = `${nombre} - Super chat WebSocket 2024`;
        let inputMensaje = document.getElementById("mensaje");
        let divMensajes = document.getElementById("mensajes");
        inputMensaje.focus();

        const socket = io();

        socket.emit("id", nombre);

        socket.on("nuevoUsuario", (nombre) => {
            Swal.fire({
                text: `${nombre} se ha conectado...!!!`,
                toast: true,
                position: "top-right"
            });
        });

        socket.on("mensajesPrevios", (mensajes) => {
            mensajes.forEach((mensaje) => {
                mostrarMensaje(divMensajes, mensaje.user, mensaje.message);
            });
        });

        socket.on("saleUsuario", (nombre) => {
            mostrarMensaje(divMensajes, nombre, "ha salido del chat... 🙁");
        });

        inputMensaje.addEventListener("keyup", (evento) => {
            evento.preventDefault();
            if (evento.code === "Enter" && evento.target.value.trim().length > 0) {
                enviarMensaje(socket, nombre, evento.target.value.trim());
                evento.target.value = "";
                evento.target.focus();
            }
        });

        socket.on("nuevoMensaje", (nombre, mensaje) => {
            mostrarMensaje(divMensajes, nombre, mensaje);
        });
    } else {
        Swal.fire("Debe ingresar un nombre válido.");
    }
});

function mostrarMensaje(contenedor, nombre, mensaje) {
    contenedor.innerHTML += `<span class="mensaje"><strong>${nombre}</strong> dice: <i>${mensaje}</i></span>`;
    contenedor.scrollTop = contenedor.scrollHeight;
}

function enviarMensaje(socket, nombre, mensaje) {
    socket.emit("mensaje", nombre, mensaje);
}
