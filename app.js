const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;
//Indico donde se subiran las imagenes
const upload =multer({dest: 'imagenes/'});

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'trabajo2024.',
    database: 'ClasePiero'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Conexión exitosa a la base de datos.');
});

// Ruta para servir el formulario HTML
app.use(express.static(path.join(__dirname, 'pagina')));

// Middleware para manejar los datos de formulario
app.use(express.urlencoded({ extended: true }));

//Codigo de subir imagen
app.use(express.urlencoded({extended: true}));
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));
app.post('/subir_imagenes', upload.single('imagen'),(req, res) =>{
    const {nombre, descripcion} = req.body;
    const imagen = req.file.fieldname;
    const sql = 'INSERT INTO imagenes (nombre, descripcion, imagen) VALUES (?, ?, ?)';
    connection.query(sql, [nombre, descripcion, imagen], (err) => {
        if(err) throw err;
        res.redirect('/imagen.html');
    });
});

//Ruta para obtener imagenes las imagenes
app.get('/imagenes',(req, res) => {
    const sql = 'SELECT nombre, descripcion, imagen From imagenes';
    connection.query(sql, (err, result) =>{
        if(err){
            console.error('Error al obtener los datos de la base de datos', err);
            return;
        }
        res.json(result);
    });
});



// Nueva ruta para mostrar todos los usuarios
app.get('/usuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los usuarios:', err);
            res.send('Error al obtener los usuarios');
        } else {
            res.json(results);
        }
    });
});

// Nueva ruta para obtener los detalles de un usuario
app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM usuarios WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener los detalles del usuario:', err);
            res.status(500).send('Error al obtener los detalles del usuario');
        } else {
            res.json(result[0]);
        }
    });
});

// Nueva ruta para eliminar un usuario
app.delete('/eliminar_usuario/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM usuarios WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el usuario:', err);
            res.status(500).send('Error al eliminar el usuario');
        } else {
            res.status(200).send('Usuario eliminado exitosamente');
        }
    });
});

// Metodo pots paara registrar usuario
app.post('/registrar_usuario', (req, res) => {
    const {correo, contraseña, rol } = req.body;
    const sql = 'INSERT INTO usuarios (correo, contraseña, rol) VALUES (?, ?, ?)';
    connection.query(sql,[correo, contraseña, rol], (err, result) => {
        if (err) {
            console.error('Error al registrar el usuario', err);
        } else {
            console.log('Usuario registrado exitosamente');
            res.redirect('/InicioSesion.html');
        }
    });

});

//Metodo para iniciar secion
app.post('/iniciar_sesion', (req, res) =>{
    const {correo, contraseña} = req.body;
    //Defino una consulta SQL
    const sql = 'SELECT rol FROM usuarios WHERE correo = ? AND contraseña = ?';
    connection.query(sql, [correo, contraseña], (err, result) =>{
        //Manejo la valicacion
        if(err){
            console.error('Error al inciciar sesion', err);
        //Verifico si por lo menos me trae un rol
        }else if(result.length > 0){
            const rol = result [0].rol;
            if(rol === 1){
                res.redirect('/administrador.html');
            }else if(rol === 2){
                res.redirect('/usuario.html');
            }
        }
        else{
            res.send('Correo o contraseña incorrectos');
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});


