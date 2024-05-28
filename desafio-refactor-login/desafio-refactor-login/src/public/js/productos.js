const comprar = async (pid) => {
    let inputCarrito = document.getElementById("carrito");
    let cid = inputCarrito.value;

    console.log(`Código de Producto: ${pid} / Código de Carrito: ${cid}`);

    try {
        let respuesta = await fetch(`/api/carts/${cid}/products/${pid}`, { method: "PUT" });

        if (respuesta.ok) {
            let datos = await respuesta.json();
            mostrarMensajeExito(`Producto ${pid} agregado al carrito ${cid}`);
        } else {
            mostrarMensajeError("Hubo un problema al agregar el producto al carrito.");
        }
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        mostrarMensajeError("Hubo un error al intentar agregar el producto al carrito.");
    }
}

function mostrarMensajeExito(mensaje) {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto Agregado al Carrito",
        text: mensaje,
        showConfirmButton: false,
        timer: 3000
    });
}

function mostrarMensajeError(mensaje) {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: mensaje
    });
}
