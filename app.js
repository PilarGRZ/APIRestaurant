let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente')
btnGuardarCliente.addEventListener('click', guardarCliente);


function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //Revisar si hay campos vacios

    const camposVacios = [mesa, hora].some(campo => campo === '');

    if (camposVacios) {

        //Verificar si ya hay una alerta

        const existeAlerta = document.querySelector('.invalid-feedback')

        if (!existeAlerta) {
            const alerta = document.createElement('div');

            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            //Eliminar la alerta

            setTimeout(() => {
                alerta.remove()
            }, 3000);

        }
        return;
    }

    //Asignar datos del formulario a cliente

    cliente = { ...cliente, mesa, hora }

    //Ocultar modal

    const modalFormulario = document.querySelector('#formulario')
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario)

    modalBootstrap.hide()


    //Mostrar las secciones

    mostrarSecciones()


    //Obtener platillos de la API de JSON- server

    obtenerPlatillos();
}


function mostrarSecciones() {

    const seccionesOcultas = document.querySelectorAll('.d-none')

    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'))
}

function obtenerPlatillos() {
    const url = 'http://localhost:4001/platillos'

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatillos(resultado))
        .catch(error => console.log(error))
}

function mostrarPlatillos(platillos) {
    console.log(platillos)
    const contenido = document.querySelector('#platillos .contenido')

    platillos.forEach(platillo => {

        const { nombre, precio, categoria, id } = platillo

        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombreInput = document.createElement('DIV');
        nombreInput.classList.add('col-md-4')
        nombreInput.textContent = nombre;

        const precioInput = document.createElement('div');
        precioInput.classList.add('col-md-3', 'fw-bold')
        precioInput.textContent = `$ ${precio}`;

        const categoriaInput = document.createElement('DIV');
        categoriaInput.classList.add('col-md-3')
        categoriaInput.textContent = categorias[categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number'
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${id}`
        inputCantidad.classList.add('form-control')

        //Función que detecta la cantidad y el platillo que se está agregando   

        inputCantidad.onchange = function () {
            const cantidad = parseInt(inputCantidad.value);
            console.log(cantidad)
            agregarPlatillo({ ...platillo, cantidad })
        };

        const agregar = document.createElement('DIV')
        agregar.classList.add('col-md-2')
        agregar.appendChild(inputCantidad)

        row.appendChild(nombreInput)
        row.appendChild(precioInput)
        row.appendChild(categoriaInput)
        row.appendChild(agregar)


        contenido.appendChild(row)
    });
}


function agregarPlatillo(producto) {

    //Extraer el pedido actual

    let { pedido } = cliente;
    //Revisar que la cantidad sea mayor a 0

    if (producto.cantidad > 0) {

        //Comprueba si el elemento ya existe en el array

        if (pedido.some(articulo => articulo.id === producto.id)) {

            //El articulo ya existe, actualiza la cantidad

            const pedidoActualizado = pedido.map(articulo => {
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad
                }

                return articulo;
            })

            //Se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado]
        } else {

            //El articulo no existe lo agregamos al array del pedido
            cliente.pedido = [...pedido, producto]
        }
    }
    else {
        //Eliminar elementos cuando la cantidad es 0

        const resultado = pedido.filter(articulo => articulo.id !== producto.id)
        cliente.pedido = [...resultado]
    }

    //Limpiar el código Html previo
    limpiarHtml();

    if (cliente.pedido.length) {
        //Mostrar el resumen
        actualizarResumen()
    }
    else {
        mensajePedidoVacio();
    }


}
function actualizarResumen() {

    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow')

    //Información de la mesa
    const mesa = document.createElement('P')
    mesa.textContent = 'Mesa : ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN')
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal')

    //Información de la hora
    const hora = document.createElement('P')
    hora.textContent = 'Hora : ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN')
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal')

    //Agregar a los elementos padre
    mesa.appendChild(mesaSpan)
    hora.appendChild(horaSpan)

    //Titulo de la seccion
    const heading = document.createElement('H3')
    heading.textContent = 'Platillos consumidos'
    heading.classList.add('my-4', 'text-center');

    //Iterar sobre el array de pedidos
    const grupo = document.createElement('UL')
    grupo.classList.add('list-group')

    const { pedido } = cliente;
    pedido.forEach(articulo => {
        const { nombre, cantidad, precio, id } = articulo;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item')

        const nombreEl = document.createElement('H4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        //Cantidad del articulo
        const cantidadEl = document.createElement('P');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad :'

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal')
        cantidadValor.textContent = cantidad;

        //precio del articulo
        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio :'

        const PrecioValor = document.createElement('span');
        PrecioValor.classList.add('fw-normal')
        PrecioValor.textContent = `$ ${precio}`;

        //subtotal del articulo
        const subtotalEl = document.createElement('P');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal :'

        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal')
        subtotalValor.textContent = calcularSubtotal(precio, cantidad)

        //botón para eliminar

        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger')
        btnEliminar.textContent = 'Eliminar del pedido'

        //Función para eliminar el pedido

        btnEliminar.onclick = function () {
            eliminarProducto(id)
        }

        //Agregar valores a sus contenedores
        cantidadEl.appendChild(cantidadValor)
        precioEl.appendChild(PrecioValor)
        subtotalEl.appendChild(subtotalValor)


        //Agregar elementos al LI
        lista.appendChild(nombreEl)
        lista.appendChild(cantidadEl)
        lista.appendChild(precioEl)
        lista.appendChild(subtotalEl)
        lista.appendChild(btnEliminar)


        //Agregar lista al grupo principal
        grupo.appendChild(lista)

    })

    //Agregar al contenido
    resumen.appendChild(heading)
    resumen.appendChild(mesa)
    resumen.appendChild(hora)
    resumen.appendChild(grupo)

    contenido.appendChild(resumen)

    //Mostrar formulario de Propinas

    formularioPropinas()
}

function limpiarHtml() {
    const contenido = document.querySelector('#resumen .contenido')

    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild)
    }
}


function calcularSubtotal(precio, cantidad) {

    return `$ ${precio * cantidad}`;

}

function eliminarProducto(id) {

    const { pedido } = cliente;
    const resultado = pedido.filter(articulo => articulo.id !== id);
    cliente.pedido = [...resultado]


    //Limpiar HTML previo

    limpiarHtml()

    if (cliente.pedido.length) {
        //Mostrar el resumen
        actualizarResumen()
    }
    else {
        mensajePedidoVacio();
    }

    //El producto se eliminó por lo tanto regresamos la cantidad a 0 en el formulario

    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado)
    inputEliminado.value = 0;
}


function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido')

    const texto = document.createElement('P')
    texto.classList.add('text-center')
    texto.textContent = 'Añade los elementos del pedido'

    contenido.appendChild(texto)
}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido')

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow')

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center')
    heading.textContent = 'Propina'

    //Radio Button 10%

    const radioDiez = document.createElement('INPUT');
    radioDiez.type = 'radio';
    radioDiez.name = 'propina';
    radioDiez.value = "10";
    radioDiez.classList.add('form-check-input')
    radioDiez.onclick = calcularPropina;

    const radioDiezLabel = document.createElement('LABEL');
    radioDiezLabel.textContent = '10%'
    radioDiezLabel.classList.add('form-check-label')

    const radioDiezDiv = document.createElement('DIV');
    radioDiezDiv.classList.add('form-check')

    radioDiezDiv.appendChild(radioDiez)
    radioDiezDiv.appendChild(radioDiezLabel)

    //Radio Button 25%

    const radioVeinte = document.createElement('INPUT');
    radioVeinte.type = 'radio';
    radioVeinte.name = 'propina';
    radioVeinte.value = "25";
    radioVeinte.classList.add('form-check-input')
    radioVeinte.onclick = calcularPropina;

    const radioVeinteLabel = document.createElement('LABEL');
    radioVeinteLabel.textContent = '25%'
    radioVeinteLabel.classList.add('form-check-label')

    const radioVeinteDiv = document.createElement('DIV');
    radioVeinteDiv.classList.add('form-check')

    radioVeinteDiv.appendChild(radioVeinte)
    radioVeinteDiv.appendChild(radioVeinteLabel)

    //Radio Button 50%

    const radio50 = document.createElement('INPUT');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = "50";
    radio50.classList.add('form-check-input')
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('LABEL');
    radio50Label.textContent = '50%'
    radio50Label.classList.add('form-check-label')

    const radio50Div = document.createElement('DIV');
    radio50Div.classList.add('form-check')

    radio50Div.appendChild(radio50)
    radio50Div.appendChild(radio50Label)

    //Agreagar al div principal
    divFormulario.appendChild(heading)
    divFormulario.appendChild(radioDiezDiv)
    divFormulario.appendChild(radioVeinteDiv)
    divFormulario.appendChild(radio50Div)

    //Agragar al formulario
    formulario.appendChild(divFormulario)
    contenido.appendChild(formulario)
}


function calcularPropina() {

    const { pedido } = cliente
    let subtotal = 0;

    //Calcula el subtotal a pagar

    pedido.forEach(articulo => {
        subtotal += articulo.cantidad * articulo.precio;
    });

    //Selecciona el radioButton con la propina del cliente

    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    //Calcular Propina
    const propina = ((subtotal * parseInt(propinaSeleccionada)) / 100);

    console.log(propina)

    //Calcular el total a pagar

    const total = subtotal + propina;

    mostrarTotalHtml(subtotal, total, propina);

}

function mostrarTotalHtml(subtotal, total, propina) {

    const divTotales = document.createElement('DIV');
    divTotales.classList.add('total-pagar', 'my-5')

    //Subtotal

    const subtotalParrafo = document.createElement('P')
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2')
    subtotalParrafo.textContent = 'Subtotal Consumo : ';

    const subTotalSpan = document.createElement('span');
    subTotalSpan.classList.add('fw-normal')
    subTotalSpan.textContent = ` $ ${subtotal}`

    subtotalParrafo.appendChild(subTotalSpan)

    //Propina

    const propinaParrafo = document.createElement('P')
    propinaParrafo.classList.add('fs-3', 'fw-bold', 'mt-2')
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal')
    propinaSpan.textContent = ` $ ${propina}`

    propinaParrafo.appendChild(propinaSpan)


    //Total a pagar

    const totalParrafo = document.createElement('P')
    totalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2')
    totalParrafo.textContent = 'Total a pagar: ';

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal')
    totalSpan.textContent = ` $ ${total}`

    totalParrafo.appendChild(totalSpan)

    //Eliminar el último resultado

    const totalPagarDiv = document.querySelector('.total-pagar')
    if(totalPagarDiv){
        totalPagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo)
    divTotales.appendChild(propinaParrafo)
    divTotales.appendChild(totalParrafo)

    
    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales)
}
