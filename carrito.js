// Carrito de compras
let carrito = [];

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio, categoria, imagen) {
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.nombre === nombre);
    
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1,
            categoria: categoria,
            imagen: imagen
        });
    }
    
    actualizarCarrito();
    guardarCarrito();
    mostrarNotificacion(`${nombre} agregado al carrito`);
}

// Función para actualizar la visualización del carrito
function actualizarCarrito() {
    const carritoContenedor = document.getElementById('carrito-contenido');
    const carritoTotal = document.getElementById('carrito-total');
    const contadorCarrito = document.getElementById('contador-carrito');
    
    if (carritoContenedor) {
        carritoContenedor.innerHTML = '';
        
        if (carrito.length === 0) {
            carritoContenedor.innerHTML = '<p class="text-center">Tu carrito está vacío</p>';
            carritoTotal.textContent = 'S/0.00';
            contadorCarrito.textContent = '0';
            return;
        }
        
        let total = 0;
        let cantidadTotal = 0;
        
        carrito.forEach((producto, index) => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;
            cantidadTotal += producto.cantidad;
            
            const productoHTML = `
                <div class="carrito-item d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center">
                        <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                        <div class="ms-3">
                            <h6 class="mb-0">${producto.nombre}</h6>
                            <small class="text-muted">${producto.categoria}</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary" onclick="modificarCantidad(${index}, -1)">-</button>
                        <span class="mx-2">${producto.cantidad}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="modificarCantidad(${index}, 1)">+</button>
                        <span class="ms-3" style="min-width: 60px; text-align: right;">S/${subtotal.toFixed(2)}</span>
                        <button class="btn btn-sm btn-outline-danger ms-2" onclick="eliminarProducto(${index})">
                            <i class="mobi-mbri-trash mobi-mbri"></i>
                        </button>
                    </div>
                </div>
            `;
            
            carritoContenedor.insertAdjacentHTML('beforeend', productoHTML);
        });
        
        carritoTotal.textContent = `S/${total.toFixed(2)}`;
        contadorCarrito.textContent = cantidadTotal;
    }
}

// Función para modificar la cantidad de un producto
function modificarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    
    if (carrito[index].cantidad < 1) {
        carrito.splice(index, 1);
    }
    
    actualizarCarrito();
    guardarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
    guardarCarrito();
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carritoAbarrotes', JSON.stringify(carrito));
}

// Función para cargar el carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carritoAbarrotes');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    actualizarCarrito();
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-carrito';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Función para generar la boleta
function generarBoleta() {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    let boletaHTML = `
        <div class="boleta-container" id="boleta-imprimir">
            <div class="boleta-header text-center mb-4">
                <img src="https://r.mobirisesite.com/1419722/assets/images/photo-1519162808019-7de1683fa2ad.jpeg" alt="Logo" style="max-height: 60px; margin-bottom: 10px;">
                <h3>El Paraíso</h3>
                <p>Av. Arequipa 805, Lima</p>
                <p>Tel: 555-1234 | RUC: 12345678901</p>
                <p>${new Date().toLocaleString()}</p>
                <hr>
            </div>
            
            <div class="boleta-productos mb-3">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Cant</th>
                            <th>Producto</th>
                            <th class="text-end">P.Unit</th>
                            <th class="text-end">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    let total = 0;
    
    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        
        boletaHTML += `
            <tr>
                <td>${producto.cantidad}</td>
                <td>${producto.nombre}</td>
                <td class="text-end">S/${producto.precio.toFixed(2)}</td>
                <td class="text-end">S/${subtotal.toFixed(2)}</td>
            </tr>
        `;
    });
    
    boletaHTML += `
                    </tbody>
                </table>
            </div>
            
            <div class="boleta-total text-end">
                <h4>TOTAL: S/${total.toFixed(2)}</h4>
            </div>
            
            <div class="boleta-footer text-center mt-4">
                <hr>
                <p>¡Gracias por su compra!</p>
                <p>Vuelva pronto</p>
            </div>
        </div>
        
        <div class="text-center mt-4">
            <button class="btn btn-primary me-2" onclick="imprimirBoleta()">Imprimir Boleta</button>
            <button class="btn btn-outline-secondary" onclick="cerrarBoleta()">Cerrar</button>
        </div>
    `;
    
    document.getElementById('boleta-modal-body').innerHTML = boletaHTML;
    $('#boletaModal').modal('show');
}

// Función para imprimir la boleta
function imprimirBoleta() {
    const ventanaImpresion = window.open('', '_blank');
    const contenido = document.getElementById('boleta-imprimir').outerHTML;
    
    ventanaImpresion.document.open();
    ventanaImpresion.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Boleta de Compra - Abarrotes El Paraíso</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .boleta-container { max-width: 400px; margin: 0 auto; }
                .boleta-header { text-align: center; margin-bottom: 20px; }
                .boleta-header img { max-height: 60px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                th, td { padding: 5px; border-bottom: 1px solid #ddd; }
                th { text-align: left; }
                .text-end { text-align: right; }
                .boleta-footer { margin-top: 30px; text-align: center; }
                hr { border-top: 1px dashed #000; }
                @media print {
                    .no-print { display: none !important; }
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            ${contenido}
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(function() {
                        window.close();
                    }, 1000);
                };
            </script>
        </body>
        </html>
    `);
    ventanaImpresion.document.close();
}

// Función para cerrar el modal de la boleta
function cerrarBoleta() {
    $('#boletaModal').modal('hide');
}

// Función para vaciar el carrito
function vaciarCarrito() {
    if (carrito.length === 0) return;
    
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        carrito = [];
        actualizarCarrito();
        guardarCarrito();
    }
}

// Cargar el carrito cuando la página se carga
document.addEventListener('DOMContentLoaded', cargarCarrito);