const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lookodedb"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Conectado a la base de datos!");
});

app.post('/registro', upload.single('fileImg'), (req, res) => {
    const { nombre, correo, contra, twitter, ig } = req.body;
    const img64 = req.file ? req.file.buffer : null; // Obtener la imagen en formato BLOB

    const query = 'INSERT INTO Usuarios (nickname, correo, contraseña, twitter, ig, avatar) VALUES (?, ?, ?, ?, ?,?)';
    db.query(query, [nombre, correo, contra, twitter, ig, img64], (error, results) => {
        if (error) {
            console.error(error);
            return res.json({ message: "Error" });
        }
        res.json({ message: "Registrado" });
    });
});


app.post('/login', (req, res) => {
    const { correo, contraseña } = req.body;

    const query = 'SELECT * FROM Usuarios WHERE correo = ? AND contraseña = ?';
    db.query(query, [correo, contraseña], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Error del servidor" });
        }

        if (results.length > 0) {
            // Login exitoso
            res.json({ message: 'Login exitoso' });
        } else {
            // Credenciales incorrectas
            res.json({ message: 'Correo o contraseña incorrectos' });
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
