//se obtiene el numero de productos a facturar
let productos = document.getElementById('id_form-TOTAL_FORMS').value

idCalculoDisponible = "";


// se utiliza en calculoDisponible, pero se resetea en establecerDisponibles
let ultimoValor = 0

//se utiliza en calculoDisponible
let usado = 0

/*matriz que guarda que productos se han seleccionado en cada formulario. se inicia en 
arreglosProductos
*/
let productosUsados = []

/* matriz que guarda los productos anteriores */
let productosAnteriores = []

/* se usa como variable temporal en establecerUsados */
let valorAnterior = null

let indiceABorrar = null


const selects = document.querySelectorAll('.select-group');
selects.forEach((elem) => {
	elem.addEventListener('change', (event) => {
		let values = Array.from(selects).map(select => select.value);
		for (let select of selects) {
			select.querySelectorAll('option').forEach((option) => {
				let value = option.value;
				if (value && value !== select.value && values.includes(value)) {
					option.disabled = true;
				} else {
					option.disabled = false;
				}
			});
		}
	});
});


window.onload
{
	inicializarCampos(1)

}



function establecerOperaciones(elemento) {
	establecerPrecio(elemento)
	establecerDisponibles(elemento)

}

function idNuevo(nombreViejo, separador, posicion, cambio) {
	let nombreTemporal = nombreViejo.split(separador) // nombre temporal de la id del campo cantidad en forma de array

	nombreTemporal[posicion] = cambio // se le cambia el segmento a la parte que se desea enlazar

	let nuevoNombre = nombreTemporal.join(separador) //se convierte el array a un string para ser procesado
	// hasta aqui esta bien jejejejej

	return nuevoNombre
}


function deStringANumero(numero) {
	return parseInt(numero, 10)
}


function inicializarCampos(primeraVez) {

	for (let i = 0; i < productos; i++) //el bucle que recorre cada campo de descripcion de cada producto
	{
		let descripcion = document.getElementById('id_form-' + i + '-descripcion')//una variable que guarda cada campo

		if (primeraVez == 1) {
			descripcion.selectedIndex = 0
			let precio = document.getElementById('id_form-' + i + '-vista_precio')
			let subtotal = document.getElementById('id_form-' + i + '-subtotal')
			let disponibles = document.getElementById('id_form-' + i + '-selec_disponibles')
			let cantidadDisponibles = document.getElementById('id_form-' + i + '-cantidad_disponibles')

			precio.selectedIndex = 0
			subtotal.value = 0
			subtotal.selectedIndex = 0
			disponibles.selectedIndex = 0
			cantidadDisponibles.value = 0
		}

		if (descripcion.selectedIndex == 0) //si el indice de el campo actual es cero.....
		{
			let cantidad = document.getElementById('id_form-' + i + '-cantidad')
			cantidad.value = 0
			cantidad.disabled = true
		}

		else {
			let cantidad = document.getElementById('id_form-' + i + '-cantidad')
			cantidad.disabled = false
		}
	}

}



function clienteCamposOcultos(esto) {
	let check = esto.checked

	let segTelefono = document.getElementById('div_telefono2')
	let segCorreo = document.getElementById('div_correo2')

	if (check) {

		$(document).ready(function () {
			segTelefono.hidden = '';
			segCorreo.hidden = '';
		}
		)
	}

	else {
		$(document).ready(function () {
			segTelefono.hidden = 'true';
			segCorreo.hidden = 'true';
		}
		)
	}
}


function calculoPrecio(elemento) {
	let idCantidad = elemento.id //la id del campo de cantidad

	let valorCantidad = elemento.value // el valor actual del campo cantidad

	let precioNuevo = idNuevo(idCantidad, '-', 2, 'vista_precio') // campo de precio

	let subTotalNuevo = idNuevo(idCantidad, '-', 2, 'subtotal') //el campo que visualiza el subtotal

	let valorSubTotal = idNuevo(idCantidad, '-', 2, 'valor_subtotal')

	let precio = document.getElementById(precioNuevo)

	let elementoAModificar = document.getElementById(subTotalNuevo)

	elementoAModificar.value = valorCantidad * precio.item(precio.selectedIndex).text

	let valorSub = document.getElementById(valorSubTotal)

	valorSub.value = elementoAModificar.value

	// para el calculo del iva
	let valorConIva = idNuevo(idCantidad, '-', 2, 'valor_con_iva');
	let elementoValorConIva = document.getElementById(valorConIva);

	// Obtener el valor del IVA (asumimos que está disponible en una variable global)
	let iva = parseFloat(document.getElementById('iva_valor').value) / 100;

	// Calcular el valor con IVA
	let valorConIvaCalculado = elementoAModificar.value * (1 + iva);
	elementoValorConIva.value = valorConIvaCalculado.toFixed(2);

}


function calculoDisponible(elemento) {
	// Obtengo la cantidad a facturar
	let cantidadAFacturar = document.getElementById(idNuevo(elemento.id, '-', 2, 'cantidad'))

	// Obtengo el input de cantidad disponible
	let cantidadIdDisponible = document.getElementById(idNuevo(elemento.id, '-', 2, 'cantidad_disponibles'))

	// Valor máximo disponible
	let maxDisponible = deStringANumero(cantidadIdDisponible.max)

	// Valor actual de la cantidad a facturar
	let cantidadFacturarValue = deStringANumero(cantidadAFacturar.value) || 0;
	cantidadAFacturar.value = cantidadFacturarValue;

	// Verifica si el valor ingresado supera el máximo disponible
	if (cantidadFacturarValue > maxDisponible) {
		alert(`La cantidad ingresada (${cantidadFacturarValue}) supera el máximo disponible (${maxDisponible}). Se ajustará al máximo permitido.`)
		cantidadFacturarValue = maxDisponible
		cantidadAFacturar.value = maxDisponible // Ajusta el valor en el input
	}

	// Calcula el nuevo valor disponible
	let nuevoValorDisponible = maxDisponible - cantidadFacturarValue

	// Asegura que el valor no sea negativo
	nuevoValorDisponible = nuevoValorDisponible < 0 ? 0 : nuevoValorDisponible

	// Actualiza el valor en el input de stock disponible
	cantidadIdDisponible.value = nuevoValorDisponible

	// Guarda el último valor facturado para futuras comparaciones
	ultimoValor = cantidadFacturarValue
}

function establecerDisponibles(elemento) {

	inicializarCampos(0)

	ultimoValor = 0

	let nombre = elemento.id
	let lista = document.getElementById(elemento.id)
	let idProducto = lista.value

	let elementoAModificar = document.getElementById(idNuevo(nombre, '-', 2, 'selec_disponibles'))
	let cantidadFacturar = document.getElementById(idNuevo(nombre, '-', 2, 'cantidad'))

	cantidadFacturar.value = 0

	let seguir = true

	for (let i = 0; i < lista.children.length; i++) {
		if (idProducto == elementoAModificar[i].value && seguir) {
			elementoAModificar.selectedIndex = i
			seguir = false
		}
	}

	let maximo = elementoAModificar[elementoAModificar.selectedIndex].text
	cantidadFacturar.max = maximo


	let stockDisponible = document.getElementById(idNuevo(nombre, '-', 2, 'cantidad_disponibles'))
	stockDisponible.value = maximo
	stockDisponible.max = maximo
}

function establecerPrecio(elemento) {
    inicializarCampos(0);

    let nombre = elemento.id;
    let lista = document.getElementById(elemento.id);
    let idProducto = lista.value;

    let nombreNuevo = idNuevo(nombre, '-', 2, 'vista_precio');

    let elementoAModificar = document.getElementById(nombreNuevo);
    let seguir = true;

    for (let i = 0; i < lista.children.length; i++) {
        if (idProducto == elementoAModificar[i].value && seguir) {
            elementoAModificar.selectedIndex = i;
            seguir = false;
        }
    }

    // Definir idDescripcion
    let idDescripcion = elemento.id;

    // Definir precio
    let precio = document.getElementById(idNuevo(idDescripcion, '-', 2, 'precio'));

    // Verificar si el elemento precio existe
    if (precio) {
        // Actualizar el valor con IVA
        let valorConIva = idNuevo(idDescripcion, '-', 2, 'valor_con_iva');
        let elementoValorConIva = document.getElementById(valorConIva);
        let iva = parseFloat(document.getElementById('iva_valor').value) / 100;
        let valorConIvaCalculado = precio.value * (1 + iva);
        elementoValorConIva.value = valorConIvaCalculado.toFixed(2);
    } else {
        
    }
}





