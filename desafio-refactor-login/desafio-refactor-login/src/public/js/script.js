const socket = io();
const divProductos = document.getElementById("productos");

socket.on("NuevoProducto", (NewProduct) => {
    divProductos.innerHTML += renderizarProducto(NewProduct);
});

socket.on("ProductoEliminado", (pid) => {
    eliminarProducto(pid);
});

socket.on("ProductoActualizado", (NewProduct) => {
    actualizarProducto(NewProduct);
});

function renderizarProducto(producto) {
    return `
        <ul data-id="${producto._id}">
            <li><h3>${producto.title}</h3></li>
            <li>${producto.description}</li>
            <li>$${producto.price}</li>
            <li><img src="${producto.thumbnail}" alt="${producto.description}" width="250"></li>
            <li>Código ${producto.code}</li>
            <li class="codigo">Id: ${producto._id}</li>
            <li>Stock Actual ${producto.stock}</li>
            <li><button class="comprar" data-id="${producto._id}">Agregar al carrito</button></li>
        </ul>`;
}

function eliminarProducto(pid) {
    const productoEliminar = divProductos.querySelector(`ul[data-id='${pid}']`);
    if (productoEliminar) {
        productoEliminar.remove();
    }
}

function actualizarProducto(NewProduct) {
    const productoActualizar = divProductos.querySelector(`ul[data-id='${NewProduct._id}']`);
    if (productoActualizar) {
        productoActualizar.innerHTML = renderizarProducto(NewProduct);
    }
}

function handleClick(event) {
    const dataId = event.target.getAttribute("data-id");
    console.log("Hiciste clic en el botón con data-id:", dataId);
    // Aquí puedes realizar las acciones que desees con el botón seleccionado
}

divProductos.addEventListener("click", function (event) {
    if (event.target && event.target.matches("button.comprar")) {
        handleClick(event);
    }
});
