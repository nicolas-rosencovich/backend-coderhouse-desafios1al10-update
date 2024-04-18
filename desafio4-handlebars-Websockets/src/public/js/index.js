const socket = io();

socket.on("products", productos => {
    const tbody = document.querySelector(".productos-body");

    tbody.innerHTML = "";

    productos.forEach(producto => { // Cambié "productos" a "producto"
        const row = tbody.insertRow();

        row.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.title}</td>
            <td>${producto.description}</td>
            <td>${producto.price}</td>
            <td>${producto.code}</td>
            <td>${producto.stock}</td>
            <td>${producto.status ? "Activo" : "Desactivado"}</td>
            <td>${producto.thumbnail.length > 0 ? producto.thumbnail[0] : "No hay imagen disponible"}</td>`;
    });
});