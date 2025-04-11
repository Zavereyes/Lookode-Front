// Server/index.js
const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Nueva importación
const app = express();
const port = 3001;


const JWT_SECRET = 'tu_clave_secreta_muy_segura';

const corsOptions = {
    origin: 'http://localhost:3000', // Permite solo solicitudes desde el frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permite el envío de cookies o credenciales si las necesitas
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
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

// Middleware para verificar token
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ mensaje: 'No se proporcionó token' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: 'Token inválido' });
        }
        
        req.usuario = decoded;
        next();
    });
};

app.post('/registro', upload.single('fileImg'), (req, res) => {
    const { nombre, correo, contra, twitter, ig } = req.body;
    const img64 = req.file ? req.file.buffer : null;

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
          // Usuario encontrado
          const usuario = results[0];
          
          // Verificar si el usuario está desactivado
          if (usuario.activo === 0) {
              return res.json({ 
                  message: 'Usuario desactivado',
                  idUsuario: usuario.idUsuario
              });
          }
          
          // Usuario activo, crear token
          const token = jwt.sign(
              { 
                  idUsuario: usuario.idUsuario,
                  nickname: usuario.nickname,
                  correo: usuario.correo,
                  contraseña: usuario.contraseña,
                  ig: usuario.ig,
                  twitter: usuario.twitter,
              }, 
              JWT_SECRET, 
              { expiresIn: '24h' }
          );
          
          // Enviar token al cliente
          res.json({ 
              message: 'Login exitoso', 
              token: token,
              usuario: {
                  idUsuario: usuario.idUsuario,
                  nickname: usuario.nickname,
                  correo: usuario.correo,
                  contraseña: usuario.contraseña,
                  ig: usuario.ig,
                  twitter: usuario.twitter,
              }
          });
      } else {
          // Credenciales incorrectas
          res.json({ message: 'Correo o contraseña incorrectos' });
      }
  });
});

// Añadir un nuevo endpoint para reactivar cuenta
app.post('/reactivar-cuenta', (req, res) => {
  const { idUsuario } = req.body;
  
  const query = 'UPDATE Usuarios SET activo = 1 WHERE idUsuario = ?';
  db.query(query, [idUsuario], (error, results) => {
      if (error) {
          console.error('Error al reactivar cuenta:', error);
          return res.status(500).json({ message: "Error al reactivar cuenta" });
      }
      
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Usuario no encontrado" });
      }
      
      res.json({ message: "Cuenta reactivada exitosamente" });
  });
});


// obtener avatar
app.get('/usuario/avatar/:id', verificarToken, (req, res) => {
    const idUsuario = req.params.id;
    
    const query = 'SELECT avatar FROM Usuarios WHERE idUsuario = ?';
    db.query(query, [idUsuario], (error, results) => {
        if (error) {
            console.error('Error al obtener avatar:', error);
            return res.status(500).json({ message: "Error al obtener avatar" });
        }
        
        if (results.length > 0 && results[0].avatar) {
            // Configurar headers para imagen
            res.setHeader('Content-Type', 'image/jpeg');
            // Enviar el blob directamente
            res.send(results[0].avatar);
        } else {
            res.status(404).json({ message: "Avatar no encontrado" });
        }
    });
});

app.put('/usuario/desactivar/:id', verificarToken, (req, res) => {
  const idUsuario = req.params.id;

  const query = 'UPDATE Usuarios SET activo = 0 WHERE idUsuario = ?';

  db.query(query, [idUsuario], (error, results) => {
      if (error) {
          console.error('Error al desactivar usuario:', error);
          return res.status(500).json({ message: "Error al desactivar usuario" });
      }

      if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json({ message: "Usuario desactivado correctamente" });
  });
});

// Editar perfil de usuario
app.put('/usuario/editar', verificarToken, upload.single('fileImg'), (req, res) => {
  const { nombre, correo, contra, twitter, ig } = req.body;
  const idUsuario = req.usuario.idUsuario;
  const img64 = req.file ? req.file.buffer : null;
  
  // Iniciamos transacción
  db.beginTransaction((err) => {
      if (err) {
          console.error('Error al iniciar transacción:', err);
          return res.status(500).json({ message: "Error al actualizar perfil" });
      }
      
      // Construir la query dinámicamente en base a los campos que se quieren actualizar
      let query = 'UPDATE Usuarios SET ';
      const params = [];
      const fields = [];
      
      if (nombre) {
          fields.push('nickname = ?');
          params.push(nombre);
      }
      
      if (correo) {
          fields.push('correo = ?');
          params.push(correo);
      }
      
      if (contra) {
          fields.push('contraseña = ?');
          params.push(contra);
      }
      
      if (twitter) {
          fields.push('twitter = ?');
          params.push(twitter);
      }
      
      if (ig) {
          fields.push('ig = ?');
          params.push(ig);
      }
      
      if (img64) {
          fields.push('avatar = ?');
          params.push(img64);
      }
      
      // Si no hay campos para actualizar
      if (fields.length === 0) {
          return db.rollback(() => {
              res.status(400).json({ message: "No hay datos para actualizar" });
          });
      }
      
      query += fields.join(', ') + ' WHERE idUsuario = ?';
      params.push(idUsuario);
      
      db.query(query, params, (error, results) => {
          if (error) {
              return db.rollback(() => {
                  console.error('Error al actualizar usuario:', error);
                  res.status(500).json({ message: "Error al actualizar perfil" });
              });
          }
          
          // Obtener los datos actualizados del usuario
          const getUserQuery = 'SELECT idUsuario, nickname, correo, contraseña, twitter, ig FROM Usuarios WHERE idUsuario = ?';
          db.query(getUserQuery, [idUsuario], (error, userResults) => {
              if (error) {
                  return db.rollback(() => {
                      console.error('Error al obtener datos actualizados:', error);
                      res.status(500).json({ message: "Error al obtener datos actualizados" });
                  });
              }
              
              // Confirmar la transacción
              db.commit((err) => {
                  if (err) {
                      return db.rollback(() => {
                          console.error('Error al confirmar transacción:', err);
                          res.status(500).json({ message: "Error al actualizar perfil" });
                      });
                  }
                  
                  // Generar nuevo token con información actualizada
                  const usuarioActualizado = userResults[0];
                  const token = jwt.sign(
                      { 
                          idUsuario: usuarioActualizado.idUsuario,
                          nickname: usuarioActualizado.nickname,
                          correo: usuarioActualizado.correo,
                          contraseña: usuarioActualizado.contraseña,
                          ig: usuarioActualizado.ig,
                          twitter: usuarioActualizado.twitter,
                      }, 
                      JWT_SECRET, 
                      { expiresIn: '24h' }
                  );
                  
                  res.json({ 
                      message: "Perfil actualizado correctamente", 
                      token: token,
                      usuario: {
                          idUsuario: usuarioActualizado.idUsuario,
                          nickname: usuarioActualizado.nickname,
                          correo: usuarioActualizado.correo,
                          contraseña: usuarioActualizado.contraseña,
                          ig: usuarioActualizado.ig,
                          twitter: usuarioActualizado.twitter,
                      }
                  });
              });
          });
      });
  });
});

// crear proyecto
app.post('/proyectos', verificarToken, upload.single('imagen'), (req, res) => {
  const { titulo } = req.body;
  let tags = req.body.tags;
  const idUsuario = req.usuario.idUsuario;
  const imagen = req.file ? req.file.buffer : null;
  
  // Asegurarse de que tags sea siempre un array
  if (!tags) {
    tags = [];
  } else if (!Array.isArray(tags)) {
    tags = [tags]; // Convertir a array si es un solo valor
  }
  
  console.log('Proyecto a crear:', { titulo, tags, idUsuario });
  
  // Iniciamos transacción
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error al iniciar transacción:', err);
      return res.status(500).json({ message: "Error al crear proyecto" });
    }
    
    // 1. Insertar el proyecto
    const proyectoQuery = 'INSERT INTO Proyectos (Titulo, idUsuario) VALUES (?, ?)';
    db.query(proyectoQuery, [titulo, idUsuario], (error, proyectoResult) => {
      if (error) {
        return db.rollback(() => {
          console.error('Error al crear proyecto:', error);
          res.status(500).json({ message: "Error al crear proyecto" });
        });
      }
      
      const idProyecto = proyectoResult.insertId;
      
      // 2. Si hay imagen, insertar en Contenidos
      if (imagen) {
        const contenidoQuery = 'INSERT INTO Contenidos (tipo, contenido, idProyecto) VALUES (?, ?, ?)';
        db.query(contenidoQuery, ['imagen', imagen, idProyecto], (error) => {
          if (error) {
            return db.rollback(() => {
              console.error('Error al guardar imagen:', error);
              res.status(500).json({ message: "Error al guardar imagen" });
            });
          }
          
          // Continuar con el proceso de tags
          procesarTags();
        });
      } else {
        // Si no hay imagen, continuar con el proceso de tags
        procesarTags();
      }
      
      // Función para procesar los tags
      function procesarTags() {
        // Verificar si hay tags
        if (!tags || tags.length === 0) {
          return db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error al confirmar transacción:', err);
                res.status(500).json({ message: "Error al crear proyecto" });
              });
            }
            res.json({ 
              message: "Proyecto creado correctamente", 
              idProyecto: idProyecto 
            });
          });
        }
        
        // 3. Insertar o verificar los tags existentes
        const processedTags = [];
        let tagsProcessed = 0;
        
        tags.forEach((tag) => {
          // Verificar si el tag ya existe para este usuario
          const checkTagQuery = 'SELECT idTag FROM Tags WHERE NombreTag = ?';
          db.query(checkTagQuery, [tag], (error, tagResult) => {
            if (error) {
              return db.rollback(() => {
                console.error('Error al verificar tag:', error);
                res.status(500).json({ message: "Error al procesar tags" });
              });
            }
            
            let tagId;
            
            if (tagResult.length > 0) {
              // El tag ya existe, obtener su ID
              tagId = tagResult[0].idTag;
              processedTags.push(tagId);
              checkAllTagsProcessed();
            } else {
              // El tag no existe, crearlo
              const insertTagQuery = 'INSERT INTO Tags (NombreTag, idUsuario) VALUES (?, ?)';
              db.query(insertTagQuery, [tag, idUsuario], (error, newTagResult) => {
                if (error) {
                  return db.rollback(() => {
                    console.error('Error al crear tag:', error);
                    res.status(500).json({ message: "Error al crear tag" });
                  });
                }
                
                tagId = newTagResult.insertId;
                processedTags.push(tagId);
                checkAllTagsProcessed();
              });
            }
          });
        });
        
        // Función para verificar si todos los tags han sido procesados
        function checkAllTagsProcessed() {
          tagsProcessed++;
          
          if (tagsProcessed === tags.length) {
            // 4. Relacionar los tags con el proyecto
            let tagRelationsProcessed = 0;
            
            processedTags.forEach((tagId) => {
              const tagRelationQuery = 'INSERT INTO TagEnProyecto (idProyecto, idTag) VALUES (?, ?)';
              db.query(tagRelationQuery, [idProyecto, tagId], (error) => {
                if (error) {
                  return db.rollback(() => {
                    console.error('Error al relacionar tag con proyecto:', error);
                    res.status(500).json({ message: "Error al relacionar tag con proyecto" });
                  });
                }
                
                tagRelationsProcessed++;
                
                if (tagRelationsProcessed === processedTags.length) {
                  // Confirmar la transacción
                  db.commit((err) => {
                    if (err) {
                      return db.rollback(() => {
                        console.error('Error al confirmar transacción:', err);
                        res.status(500).json({ message: "Error al crear proyecto" });
                      });
                    }
                    
                    res.json({ 
                      message: "Proyecto creado correctamente", 
                      idProyecto: idProyecto 
                    });
                  });
                }
              });
            });
          }
        }
      }
    });
  });
});

//obtener tags.
app.get('/tags', (req, res) => {
  const query = 'SELECT idTag, NombreTag FROM Tags';

  db.query(query, (error, results) => {
      if (error) {
          console.error('Error al obtener tags:', error);
          return res.status(500).json({ message: "Error al obtener tags" });
      }
      res.json(results);
  });
});

//add content
// Add this to your existing index.js file, inside the Express app

// Route to upload project content
app.post('/proyectos/contenido', verificarToken, upload.array('contenido'), (req, res) => {
  const { idProyecto } = req.body;
  const tipos = req.body.tipo;
  const contenidos = req.files;

  // Ensure tipos is an array
  const tiposArray = Array.isArray(tipos) ? tipos : [tipos];

  // Begin a database transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error al iniciar transacción:', err);
      return res.status(500).json({ message: "Error al iniciar transacción" });
    }

    // Track the number of insertions
    let insertionsCompleted = 0;

    // Validate input
    if (!idProyecto || !contenidos || contenidos.length === 0) {
      return db.rollback(() => {
        res.status(400).json({ message: "Datos de contenido inválidos" });
      });
    }

    // Insert each content item
    contenidos.forEach((contenido, index) => {
      const tipo = tiposArray[index] || 'imagen'; // Default to imagen if not specified
      
      const query = 'INSERT INTO Contenidos (tipo, contenido, idProyecto) VALUES (?, ?, ?)';
      
      db.query(query, [tipo, contenido.buffer, idProyecto], (error, result) => {
        if (error) {
          return db.rollback(() => {
            console.error('Error al insertar contenido:', error);
            res.status(500).json({ message: "Error al guardar contenido" });
          });
        }

        insertionsCompleted++;

        // If all insertions are complete, commit the transaction
        if (insertionsCompleted === contenidos.length) {
          db.commit((commitErr) => {
            if (commitErr) {
              return db.rollback(() => {
                console.error('Error al confirmar transacción:', commitErr);
                res.status(500).json({ message: "Error al guardar contenido" });
              });
            }
            
            res.json({ 
              message: "Contenido guardado correctamente", 
              contentCount: insertionsCompleted 
            });
          });
        }
      });
    });
  });
});



// Obtener todos los proyectos 
app.get('/proyectos', verificarToken, (req, res) => {
  const query = `
    SELECT p.idProyecto, p.Titulo 
    FROM Proyectos p
    JOIN Usuarios u ON p.idUsuario = u.idUsuario
    WHERE u.activo = 1
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener proyectos:', error);
      return res.status(500).json({ message: "Error al obtener proyectos" });
    }
    
    res.json(results);
  });
});


// Obtener la primera imagen de un proyecto
app.get('/proyectos/:idProyecto/primera-imagen', verificarToken, (req, res) => {
  const idProyecto = req.params.idProyecto;
  const idUsuario = req.usuario.idUsuario;
  
  const query = `
    SELECT contenido 
    FROM Contenidos 
    WHERE idProyecto = ? AND tipo = 'imagen' 
    ORDER BY idContenido ASC 
    LIMIT 1
  `;
  
  db.query(query, [idProyecto], (error, results) => {
    if (error) {
      console.error('Error al obtener imagen:', error);
      return res.status(500).json({ message: "Error al obtener imagen" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "No se encontró imagen" });
    }
    
    // Enviar la imagen directamente
    res.contentType('image/jpeg');
    res.send(results[0].contenido);
  });
});

// Añade esto a tu index.js
app.get('/test', (req, res) => {
    res.json({ message: 'Server working' });
  });

  // Comprueba que la conexión a MySQL esté funcionando
app.get('/check-db', (req, res) => {
    db.query('SELECT 1', (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: 'Database working', results });
    });
  });


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});