const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

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




