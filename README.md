# ExperTIC - Prototipo

ExperTIC es una plataforma web que cubre las necesidades de vincular al Gobierno Federal con las empresas tecnológicas del sector TIC para capacitar y promover el aprendizaje. La plataforma se enfoca en:

* Diseño intuitivo, orientado a la tendencia de redes sociales, buscando la mayor experiencia de usuario 
* Notificaciones push en tiempo real desde la plataforma y al correo electrónico del usuario 
* RESTful API construida bajo estándares, documentada, y API Explorer para facilitar el uso a desarrolladores 
* Dashboard para los administradores de dependencias y de la aplicación general 
* Landing Page informativa para ciudadanos, funcionarios y desarrolladores 
* Diseño responsivo para navegar desde móviles

#### Propuesta de valor

Puntos clave de la aplicación:

* **Diseño simple y funcional**
* **Buenas prácticas y estándares en las soluciones**
* **Navegación rápida y detallada**
* **Optimización de procesos y recursos**

## Especificaciones

La versión demo está optimizada para navegadores web modernos y resoluciones Desktop (hay detalles con el responsive en esta versión)

Muchas de las funcionalidades de la aplicación no muestra el funcionamiento real que tomaría al ser desarrollado. También, puede que la haya algunos fallos de validaciones u otra anomalía.

## Requisitos

Los requisitos para instalar la aplicación son:

* **node.js** >= 0.10.26
* **npm** >= 1.4.3
* **MongoDB** >= 2.4.5

## Instalación

#### Instalando la aplicación (app)
Todo esto se realiza dentro de la carpeta **app** del proyecto

Para instalar la aplicación se ocupa instalar grunt de forma global desde la terminal usando el comando:

<pre>npm install -g grunt-cli</pre>

Lo siguiente es instalar las dependencias del proyecto, para eso se deben ejecutar los siguientes comandos:

<pre>npm install</pre>
<pre>bower install</pre>

Se deben ejecutar los siguientes comandos, según sea la opción:

<pre>grunt build // ambientes de desarrollo</pre>
<pre>grunt release // ambientes de producción</pre>

Por último hay que instalar y correr el servidor de la aplicación web. Desde la carpeta **server** dentro de **app** se deben instalar las dependencias y correr el servidor web

<pre>npm install</pre>
<pre>node server.js</pre>

#### Instalando la REST API (api)
Todo esto se realiza dentro de la carpeta **api** del proyecto

Para instalar la REST API se deben instalar las dependencias desde la carpeta principal del proyecto usando el comando:

<pre>npm install</pre>

Se debe correr el servidor de base de datos MongoDB desde la terminal con el comando:

<pre>mongod</pre>

Y por último correr el servidor web Node.js con el comando:

<pre>node server.js</pre>

## Aplicación Web

La aplicación web se encuentra alojada en el siguiente servidor:

**[Aplicación web (Servidor)](http://bit.ly/1wZ0Nme)**

## Credenciales

<table>
	<thead>
		<th>Usuario</th>
		<th>Contraseña</th>
		<th>Rol</th>
	</thead>
	<tbody>
		<tr>
			<td>hola@pretzel.mx</td>
			<td>changeme</td>
			<td>Administrador</td>
		</tr>
		<tr>
			<td>usuario@pretzel.mx</td>
			<td>changeme</td>
			<td>Usuario</td>
		</tr>
	</tbody>
</table>

## Vídeo

Se realizó un vídeo con el objetivo de mostrar la aplicación y cada uno de los puntos antes mencionados de una forma más visual

**[Demo Prototipo Funcional (Google Drive)](http://bit.ly/1HtVhta)**

## Manual de usuario

Para consultar todas las funcionalidades de la aplicación ir al **[Manual de usuario](http://bit.ly/1JMLRgl)**

## Pretzel (Documentos)

**[Carta bajo protesta](http://bit.ly/1t5m91V)**

## Licencia

**[Licencia MIT (Open Source)](http://bit.ly/1xGXlOD)**
