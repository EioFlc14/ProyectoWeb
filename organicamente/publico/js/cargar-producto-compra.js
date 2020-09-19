

function cargarProducto(orden, cantidad, precio, productoId, productoNombre){

    console.log(orden)
    console.log(cantidad)
    console.log(precio)
    console.log(productoId)
    console.log(productoNombre)
    if (Number(cantidad) <= 0) {
        console.log('LA CANTIDAD DEBE SER MAYOR QUE CERO.')
    }

    const individual = {
        cantidad: cantidad,
        precio: precio,
        valor: Number(cantidad) * Number(precio),
        usuarioProducto: productoId,
        productoNombre: productoNombre,
    }

    orden.push(individual)

}

//PROBAR ESTO
function quitarProducto(orden, i){
    orden.splice(i,1);
}