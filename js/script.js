window.onload = function()
{
	var listadoPersonas = [];
	var elementos = ["identifica", "nombre", "apellido", "email", "fechanace"];
	var resultadoBusca = []; //Gurda los usuarios que cumplen con el criterio de b�squeda...
	//Constructor Persona...
	function persona(id, pn, pa, em, fe)
	{
		this.identificacion = id;
		this.primernombre = pn;
		this.primerapellido = pa;
		this.email = em;
		this.fechanacimiento = fe;
		this.calculaEdad = function()
		{
			var fecha_actual = new Date();
			var parteFn = this.fechanacimiento.split("-");
			var fechaCompara = new Date(parteFn[0], parteFn[1], parteFn[2]); //a�o, mes d�a
			return Math.floor((fecha_actual - fechaCompara) / 1000 / 3600 / 24 / 365);
			//Milisegundos, segundos en una hora, horas en un d�a, d�as en un a�o...
		}
		//Para devolver los datos del usuario a ser impresos...
		this.imprime = function()
		{
			return [
						this.identificacion, 
						this.primernombre + " " + this.primerapellido, 
						this.email, 
						this.fechanacimiento, 
						this.calculaEdad()
					];
		}
	}

	//Para cargar la informaci�n de localStorage...
	if(localStorage.getItem("listado"))
	{
		var objTMP = eval(localStorage.getItem("listado"));
		var id = pn = pa = em = fn = "";
		for(var i in objTMP)
		{
			var id = objTMP[i].identificacion;
			var pn = objTMP[i].primernombre;
			var pa = objTMP[i].primerapellido;
			var em = objTMP[i].email;
			var fn = objTMP[i].fechanacimiento;
			var nuevaPersona = new persona(id, pn, pa, em, fn);
			listadoPersonas.push(nuevaPersona);
		}
	}

	imprimeUsuarios();
	//Imprimer usuarios en pantalla...
	function imprimeUsuarios()
	{
		var muestra = true;
		var txt = "<table class = 'table-fill'>";
			txt += "<thead><tr><th>ID</th><th>Nombre</th><th>E-mail</th>";
			txt += "<th>Fecha</th><th>Edad</th>";
			txt += "<th>Editar</th><th>Eliminar</th></tr></thead>";
			txt += "<tbody class = 'table-hover'>";
		for(var i = 0; i < listadoPersonas.length; i++)
		{
			muestra = true;
			for(var c in resultadoBusca)
			{
				if(resultadoBusca[c] === i)
				{
					muestra = false;
				}
			}
			if(muestra)
			{
				txt += "<tr>";
				var datosPersona = listadoPersonas[i].imprime();
				for(var c = 0; c < datosPersona.length; c++)
				{
					txt += "<td><center>"+(datosPersona[c])+"</center></td>";
				}
				//Editar...
				txt += "<td><center>";
				txt += "<img src = 'img/editar.png' border = '0' id = 'e_"+i+"'/>";
				txt += "</center</td>";
				//Eliminar...
				txt += "<td><center>";
				txt += "<img src = 'img/eliminar.png' border = '0' id = 'd_"+i+"'/>";
				txt += "</center</td>";
				txt += "</tr>";
			}
		}
		txt += "</tbody></table>";
		nom_div("imprime").innerHTML = txt;

		//Poner las acciones de editar y eliminar...
		for(var i = 0; i < listadoPersonas.length; i++)
		{
			muestra = true;
			for(var c in resultadoBusca)
			{
				if(resultadoBusca[c] === i)
				{
					muestra = false;
				}
			}
			if(muestra)
			{
				//Editar...
				nom_div("e_" + i).addEventListener(click(function(){
    				var value_object = '"id":{"nombre","identificacion","email","apellido":"fechanacimiento"}';
    				var json_object = JSON.parse(localStorage.your_json); 
   				 	json_object["listado"] = value_object; 

    				localStorage.your_json = JSON.stringify(json_object);  

    				});

					/*funci�n de edici�n de datos...
					*/
					var localstorage = {
   					set: function (key, value) {
				        window.localStorage.setItem( key, JSON.stringify(value) );
 				   },
   					 get: function (key) {
       				 try {
            		return JSON.parse( window.localStorage.getItem(key) );
       				 } catch (e) {
            		return null;
        				}
    				}
					};
					
				});
				//Eliminar...
				nom_div("d_" + i).addEventListener('click', function(event)
				{
					var ind = event.target.id.split("_")[1];
					var idUser = listadoPersonas[ind].identificacion;
					if(confirm("�Est� segur@ de realizar est� acci�n?"))
					{
						ind = buscaIndice(idUser);
						
							window.localStorage.removeItem("listado");
					}
				});
			}
		}
	}
	//Dada la identificaci�n, buscar la posici�n donde se encuentra almacenado...
	var buscaIndice = function(id)
	{
		var indice = -1;
		for(var i in listadoPersonas)
		{
			if(listadoPersonas[i].identificacion === id)
			{
				indice = i;
				break;
			}
		}
		return indice;
	}

	//Limpia los campos del formulario...
	var limpiarCampos = function()
	{
		for(var i = 0; i < elementos.length; i++)
		{
			nom_div(elementos[i]).value = "";	
		}
	}

	//Saber si un usuario ya existe, bien por identificaci�n o por e-mail...
	function existeUsuario(id, email)
	{
		var existe = 0; //0 Ning�n campo existe...
		for(var i in listadoPersonas)
		{
			//C�dula...
			if(listadoPersonas[i].identificacion === id)
			{
				existe = 1; // la c�dula existe...
				break;
			}
			//Correo existe...
			if(listadoPersonas[i].email.toLowerCase() === email.toLowerCase())
			{
				existe = 2; //El correo existe...
				break;
			}
		}
		return existe;
	}

	//Acciones sobre el bot�n guardar...
	nom_div("guarda").addEventListener('click', function(event)
	{
		var correcto = true;
		var valores = [];
		for(var i = 0; i < elementos.length; i++)
		{
			if(nom_div(elementos[i]).value === "")
			{
				alert("Digite todos los campos");
				nom_div(elementos[i]).focus();
				correcto = false;
				break;
			}
			else
			{
				valores[i] = nom_div(elementos[i]).value;
			}
		}
		//Si correcto es verdadero...
		if(correcto)
		{
			var existeDatos = existeUsuario(valores[0], valores[3]);
			if(existeDatos == 0) //No existe...
			{
				if(ValidaEmail(valores[3]))
				{
					var nuevaPersona = new persona(valores[0], valores[1], valores[2], valores[3], valores[4]);
					listadoPersonas.push(nuevaPersona);
					localStorage.setItem("listado", JSON.stringify(listadoPersonas));
					imprimeUsuarios();
					limpiarCampos();
				}
				else
				{
					alert("El correo no es v�lido");
					nom_div(elementos[3]).focus();
				}
			}
			else
			{
				if(existeDatos == 1)
				{
					alert("El usuario con la c�dula: " + valores[0] + " Ya existe");
					nom_div(elementos[0]).focus();
				}
				else
				{
					alert("El correo : " + valores[3] + " Ya existe");
					nom_div(elementos[3]).focus();	
				}
			}
		}
	});
	
	
	//Para la acci�n de buscar...
	nom_div("buscUser").addEventListener('keyup', function(event)
	{
		resultadoBusca = []; //Reiniciar el array de resultados de b�squeda...
		var busca = false;
		if(this.value !== "")
		{
			for(var i = 0; i < listadoPersonas.length; i++)
			{
				busca = listadoPersonas[i].identificacion.search(this.value) < 0;
				busca = busca && listadoPersonas[i].primernombre.search(this.value) < 0;
				busca = busca && listadoPersonas[i].primerapellido.search(this.value) < 0;
				busca = busca && listadoPersonas[i].email.search(this.value) < 0;
				if(busca)
				{
					resultadoBusca.push(i);
				}
			}
		}
		imprimeUsuarios();
	});


	//Funci�n que valida que un e-mail se encuentre "sint�cticamente" bien escrito...
	function ValidaEmail(email)
	{
		var correcto = true;
		var emailReg = /^([\da-zA-Z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
		if(!emailReg.test(email))
		{
			correcto =  false;
		}
		return correcto;
	}

	//Accedera los elementos de HTML...
	function nom_div(div)
	{
		return document.getElementById(div);
	}
}