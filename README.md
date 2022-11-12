# back-tienda-vanilajs
## Backend Aplicación de tienda hecho con Node.js, Express y MySQL.

<img src="https://user-images.githubusercontent.com/48871135/201487834-1a725273-d53c-4133-a973-f88e1197ecb9.png" alt="image" width="200">  <img src="https://user-images.githubusercontent.com/48871135/201487847-26a1792d-7064-492d-84c9-6a454cb0b9cc.png" alt="image" width="200">  <img src="https://user-images.githubusercontent.com/48871135/201487852-ef9393c7-b001-4cbc-a08b-677229d242e3.png" alt="image" width="200">

[Node.js](https://nodejs.org/en/about/) es el lenguaje principal de esta parte del proyecto, es un entorno de tiempo de ejecución asíncrona orientada a eventos. El carácter asíncrono de esta tecnología permite realizar queries a la base de datos (gracias a la [librería mysql](https://github.com/mysqljs/mysql) que posibilita la creación de conexiónes y queries hacia bases de datos con MySQL) y procesar las respuestas correctamente para posteriormente manipularlas con Express.js. [Express.js](https://expressjs.com/) es un framework de Node que ofrece una serie de caracteristicas útiles para el desarrollo de aplicaciones web. 

**API URL**:
http://ec2-54-82-194-198.compute-1.amazonaws.com/

Haciendo uso de las tecnologías anterior mencionadas es como se pudo desarrollar el backend de esta aplicación, tal como se explica a continuación:

1. Se importan y requieren las librerías a nuestro archivo principal [index.js](src/index.js). Dentro de estos requerimientos están express, [morgan](https://github.com/expressjs/morgan) (modulo de Node que permite ver las peticiones en consola), [cors](https://expressjs.com/en/resources/middleware/cors.html) (paquete de express que ayuda a lidiar con las politicas CORS en la comunicación entre backend y frontend en servers diferentes). 
```
const express = require("express");
const app = express();
const morgan = require("morgan");
const routes = require("./routes/routes");
const cors = require("cors");

``` 
Aparte, se importa el archivo de rutas, que se explicará mas adelante.

2. Se añaden configuraciones iniciales:
```
//settings
app.set("port", process.env.PORT || 3000);
```
En este caso solo se añade el puerto.

3. Se añaden los middlewares:
```
//middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
```

4. Se indica a la app de express que use las rutas importadas al principio y se plantean los parametros de inicialización de la aplicación:
```
// routes
app.use(routes);

//starting the server
app.listen(app.get(`port`), () => {
  console.log(`Server on port ${app.get("port")}`);
});
```
5. Pasando a las rutas (en [routes.js](src/routes/routes.js)), se indica que se va a requerir el modulo Router de express, que permitirá asignar distintas funciones (controladores) a direcciones http:
```
const { Router } = require("express");
const {
  getAllProducts,
  getProductsById,
  searchProduct,
} = require("../controllers/controllers");

const router = Router();

router.get("/", getAllProducts);

router.get("/products/:id", getProductsById);

router.get("/product-search/:search", searchProduct);

module.exports = router;
```
En este caso, se tienen 3 rutas con 3 controladores cada uno, los cuales se explicarán a continuación:

6. Controladores (en [controllers.js](src/controllers/controllers.js)). Aqui es donde se importa la librería mysql, además de importar las configuraciones de la base de datos (en [db.js](src/db.js))
```
const mysql = require("mysql");
const db_config = require("../db");
```
- 6.1: getAllProducts:

**GET** | ```http://ec2-54-82-194-198.compute-1.amazonaws.com/```

Este controlador fue creado con fines de prueba. Se limita a realizar una query 'SELECT *' para obtener todos los productos y enviar la respuesta.
```
const getAllProducts = (req, res) => {
  try {
    const connection = mysql.createConnection(db_config);

    //.connect es implicito si se realiza un query
    // connection.connect(function (error) {
    //   if (error) throw error;
    //   return;
    // });

    connection.query(
      "SELECT * FROM product, category WHERE product.category = category.id ORDER BY category.name",
      function (error, result) {
        if (error) throw error;
        //el callback function permite obtener el resultado
        connection.destroy();
        res.send(result);
      }
    );
  } catch (error) {
    res.status(500);
    res.send(error);
  }
};
```

- 6.2: getProductsById: Este controlador utiliza el id (que debe venir en el request desde la ruta, e idica la categoría de producto) para retornar todos los productos con la categoría correspondiente:

**GET** | ```http://ec2-54-82-194-198.compute-1.amazonaws.com/products/{id}```

```
const getProductsById = (req, res) => {
  try {
    const { id } = req.params;

    const connection = mysql.createConnection(db_config);

    connection.query(
      "SELECT product.id, product.name, product.url_image, product.price, product.category FROM product, category WHERE product.category = category.id AND category.id = ?",
      id,
      function (error, result) {
        if (error) throw error;
        connection.destroy();
        res.send(result);
      }
    );
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
```

- 6.3 searchProduct: Este controlador utiliza el parametro de la request para realizar una busqueda entre los nombres de los productos. Antes de realizar el query, se estandariza el parametro (search -> search.toString() para volverlo string, y además envolverlo en % % segun requerimiento de la query):

**GET** | ```http://ec2-54-82-194-198.compute-1.amazonaws.com/product-search/{search}```

```
const searchProduct = (req, res) => {
  try {
    const { search } = req.params;
    const searchstr = "%" + search.toString() + "%";
    const connection = mysql.createConnection(db_config);

    connection.query(
      "SELECT * FROM product WHERE product.name LIKE ?",
      searchstr,
      function (error, result) {
        if (error) throw error;
        connection.destroy();
        res.send(result);
      }
    );
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
```

7. Por último, se exportan estos módulos hacia rutas:
```
module.exports = {
  getAllProducts,
  getProductsById,
  searchProduct,
};
```

Estos query se entregan al cliente en formato json. Notese el ejemplo a continuación de una peticion a /products/5:
![image](https://user-images.githubusercontent.com/48871135/201491413-cfe5d2c6-8b20-43db-919b-556cdeb38816.png)



