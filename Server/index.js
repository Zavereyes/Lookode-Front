// Server/index.js
const express = require('express');
const mysql2 = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Nueva importación
const app = express();
const port = 3001;


const JWT_SECRET = 'tu_clave_secreta_muy_segura';

const corsOptions = {
    origin: 'https://lookode-d9yt.vercel.app', // Permite solo solicitudes desde el frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permite el envío de cookies o credenciales si las necesitas
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = mysql2.createConnection({
    host: "turntable.proxy.rlwy.net",
    user: "root",
    password: "RwOwYrIlxHWuzZDPjBeJbTjgEMHcwmvB",
    database: "Lookode",
    port: 14593
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

    const query = 'INSERT INTO usuarios (nickname, correo, contraseña, twitter, ig, avatar) VALUES (?, ?, ?, ?, ?,?)';
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

  const query = 'SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?';
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
  
  const query = 'UPDATE usuarios SET activo = 1 WHERE idUsuario = ?';
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
// Cambiar este endpoint para no requerir autenticación
app.get('/usuario/avatar/:id', (req, res) => {
  const idUsuario = req.params.id;
  
  const query = 'SELECT avatar FROM usuarios WHERE idUsuario = ?';
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

  const query = 'UPDATE usuarios SET activo = 0 WHERE idUsuario = ?';

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
      let query = 'UPDATE usuarios SET ';
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
          const getUserQuery = 'SELECT idUsuario, nickname, correo, contraseña, twitter, ig FROM usuarios WHERE idUsuario = ?';
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
    const proyectoQuery = 'INSERT INTO proyectos (Titulo, idUsuario) VALUES (?, ?)';
    db.query(proyectoQuery, [titulo, idUsuario], (error, proyectoResult) => {
      if (error) {
        return db.rollback(() => {
          console.error('Error al crear proyecto:', error);
          res.status(500).json({ message: "Error al crear proyecto" });
        });
      }
      
      const idProyecto = proyectoResult.insertId;
      
      // 2. Si hay imagen, insertar en contenidos
      if (imagen) {
        const contenidoQuery = 'INSERT INTO contenidos (tipo, contenido, idProyecto) VALUES (?, ?, ?)';
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
          const checkTagQuery = 'SELECT idTag FROM tags WHERE NombreTag = ?';
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
              const insertTagQuery = 'INSERT INTO tags (NombreTag, idUsuario) VALUES (?, ?)';
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
              const tagRelationQuery = 'INSERT INTO tagenproyecto (idProyecto, idTag) VALUES (?, ?)';
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
  const query = 'SELECT idTag, NombreTag FROM tags';

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
      
      const query = 'INSERT INTO contenidos (tipo, contenido, idProyecto) VALUES (?, ?, ?)';
      
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
    FROM proyectos p
    JOIN usuarios u ON p.idUsuario = u.idUsuario
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
    FROM contenidos 
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



// Endpoint para obtener todos los detalles de un proyecto específico
app.get('/proyectos/:idProyecto/detalles', verificarToken, (req, res) => {
  const idProyecto = req.params.idProyecto;
  
  // Comenzamos una transacción para asegurar la consistencia de los datos
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error al iniciar transacción:', err);
      return res.status(500).json({ message: "Error al obtener detalles del proyecto" });
    }
    
    // 1. Obtener información del proyecto y del usuario creador
    const queryProyecto = `
      SELECT p.idProyecto, p.Titulo, 
             u.idUsuario, u.avatar, u.nickname, u.twitter, u.ig
      FROM proyectos p
      JOIN usuarios u ON p.idUsuario = u.idUsuario
      WHERE p.idProyecto = ?
    `;
    
    db.query(queryProyecto, [idProyecto], (error, proyectoResults) => {
      if (error) {
        return db.rollback(() => {
          console.error('Error al obtener proyecto:', error);
          res.status(500).json({ message: "Error al obtener detalles del proyecto" });
        });
      }
      
      if (proyectoResults.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ message: "Proyecto no encontrado" });
        });
      }
      
      const proyectoInfo = proyectoResults[0];
      const idUsuario = proyectoInfo.idUsuario;
      
      // 2. Obtener los IDs de contenido
      const queryContenidos = `
        SELECT idContenido, tipo
        FROM contenidos
        WHERE idProyecto = ?
        ORDER BY idContenido ASC
      `;
      
      db.query(queryContenidos, [idProyecto], (error, contenidosResults) => {
        if (error) {
          return db.rollback(() => {
            console.error('Error al obtener contenidos:', error);
            res.status(500).json({ message: "Error al obtener contenidos del proyecto" });
          });
        }
        
        // 3. Obtener los tags del proyecto
        const queryTags = `
          SELECT t.idTag, t.NombreTag
          FROM tags t
          JOIN tagenproyecto tp ON t.idTag = tp.idTag
          WHERE tp.idProyecto = ?
        `;
        
        db.query(queryTags, [idProyecto], (error, tagsResults) => {
          if (error) {
            return db.rollback(() => {
              console.error('Error al obtener tags:', error);
              res.status(500).json({ message: "Error al obtener tags del proyecto" });
            });
          }
          
          // Confirmar la transacción
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error al confirmar transacción:', err);
                res.status(500).json({ message: "Error al obtener detalles del proyecto" });
              });
            }
            
            // Crear objeto con toda la información
            const response = {
              proyecto: {
                idProyecto: proyectoInfo.idProyecto,
                titulo: proyectoInfo.Titulo
              },
              usuario: {
                idUsuario: proyectoInfo.idUsuario,
                
                nickname: proyectoInfo.nickname,
                twitter: proyectoInfo.twitter,
                ig: proyectoInfo.ig
              },
              contenidos: contenidosResults.map(item => ({
                idContenido: item.idContenido,
                tipo: item.tipo,
                url: `/contenidos/${item.idContenido}`
              })),
              tags: tagsResults
            };
            
            res.json(response);
          });
        });
      });
    });
  });
});

// Endpoint para obtener un contenido específico por su ID
app.get('/contenidos/:idContenido', (req, res) => {
  const idContenido = req.params.idContenido;
  
  const query = 'SELECT tipo, contenido FROM contenidos WHERE idContenido = ?';
  
  db.query(query, [idContenido], (error, results) => {
    if (error) {
      console.error('Error al obtener contenido:', error);
      return res.status(500).json({ message: "Error al obtener contenido" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Contenido no encontrado" });
    }
    
    const contenido = results[0];
    
    // Configurar el tipo de contenido adecuado para la respuesta
    switch (contenido.tipo) {
      case 'imagen':
        res.contentType('image/jpeg');
        break;
      case 'video':
        res.contentType('video/mp4');
        break;
      case 'documento':
        res.contentType('application/pdf');
        break;
      case 'txt':
        res.contentType('text/plain');
        break;
      default:
        res.contentType('application/octet-stream');
    }
    
    // Enviar el contenido
    res.send(contenido.contenido);
  });
});
/////////////////////favoritos///////////
// Añadir estos endpoints en index.js

// Verificar si un proyecto está en favoritos
app.get('/favoritos/check/:idProyecto', verificarToken, (req, res) => {
  const idProyecto = req.params.idProyecto;
  const idUsuario = req.usuario.idUsuario;
  
  // Buscar el favorito del usuario
  const queryBuscarFavorito = 'SELECT idFavorito FROM favoritos WHERE idUsuario = ? LIMIT 1';
  
  db.query(queryBuscarFavorito, [idUsuario], (error, favoritos) => {
    if (error) {
      console.error('Error al buscar favoritos:', error);
      return res.status(500).json({ message: "Error al verificar favoritos" });
    }
    
    // Si el usuario no tiene una lista de favoritos
    if (favoritos.length === 0) {
      return res.json({ enFavoritos: false });
    }
    
    const idFavorito = favoritos[0].idFavorito;
    
    // Verificar si el proyecto está en favoritos
    const queryCheckProyecto = 'SELECT COUNT(*) as count FROM proyectoenfavorito WHERE idFavorito = ? AND idProyecto = ?';
    
    db.query(queryCheckProyecto, [idFavorito, idProyecto], (error, results) => {
      if (error) {
        console.error('Error al verificar proyecto en favoritos:', error);
        return res.status(500).json({ message: "Error al verificar favoritos" });
      }
      
      const enFavoritos = results[0].count > 0;
      res.json({ enFavoritos });
    });
  });
});

// Añadir un proyecto a favoritos
app.post('/favoritos/add', verificarToken, (req, res) => {
  const { idProyecto } = req.body;
  const idUsuario = req.usuario.idUsuario;
  
  // Comenzar transacción
  db.beginTransaction(async (err) => {
    if (err) {
      console.error('Error al iniciar transacción:', err);
      return res.status(500).json({ message: "Error al guardar favorito" });
    }
    
    try {
      // Verificar si el usuario ya tiene una lista de favoritos
      const queryCheckFavoritos = 'SELECT idFavorito FROM favoritos WHERE idUsuario = ? LIMIT 1';
      
      db.query(queryCheckFavoritos, [idUsuario], (error, favoritos) => {
        if (error) {
          return db.rollback(() => {
            console.error('Error al verificar favoritos:', error);
            res.status(500).json({ message: "Error al guardar favorito" });
          });
        }
        
        let idFavorito;
        
        // Si no tiene lista de favoritos, crear una
        if (favoritos.length === 0) {
          const queryCrearFavorito = 'INSERT INTO favoritos (idUsuario) VALUES (?)';
          
          db.query(queryCrearFavorito, [idUsuario], (error, result) => {
            if (error) {
              return db.rollback(() => {
                console.error('Error al crear lista de favoritos:', error);
                res.status(500).json({ message: "Error al crear lista de favoritos" });
              });
            }
            
            idFavorito = result.insertId;
            insertarProyectoEnFavorito(idFavorito);
          });
        } else {
          // Si ya tiene lista de favoritos, usar el ID existente
          idFavorito = favoritos[0].idFavorito;
          insertarProyectoEnFavorito(idFavorito);
        }
        
        // Función para insertar el proyecto en la lista de favoritos
        function insertarProyectoEnFavorito(idFavorito) {
          const queryInsertProyecto = 'INSERT INTO proyectoenfavorito (idFavorito, idProyecto) VALUES (?, ?)';
          
          db.query(queryInsertProyecto, [idFavorito, idProyecto], (error) => {
            if (error) {
              return db.rollback(() => {
                console.error('Error al insertar proyecto en favoritos:', error);
                res.status(500).json({ message: "Error al guardar en favoritos" });
              });
            }
            
            // Confirmar transacción
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error('Error al confirmar transacción:', err);
                  res.status(500).json({ message: "Error al guardar favorito" });
                });
              }
              
              res.json({ message: "Proyecto guardado en favoritos" });
            });
          });
        }
      });
    } catch (error) {
      db.rollback(() => {
        console.error('Error en la transacción:', error);
        res.status(500).json({ message: "Error al guardar favorito" });
      });
    }
  });
});

// Eliminar un proyecto de favoritos
app.delete('/favoritos/remove/:idProyecto', verificarToken, (req, res) => {
  const idProyecto = req.params.idProyecto;
  const idUsuario = req.usuario.idUsuario;
  
  // Buscar el idFavorito del usuario
  const queryBuscarFavorito = 'SELECT idFavorito FROM favoritos WHERE idUsuario = ? LIMIT 1';
  
  db.query(queryBuscarFavorito, [idUsuario], (error, favoritos) => {
    if (error) {
      console.error('Error al buscar favoritos:', error);
      return res.status(500).json({ message: "Error al eliminar de favoritos" });
    }
    
    if (favoritos.length === 0) {
      return res.status(404).json({ message: "No tienes lista de favoritos" });
    }
    
    const idFavorito = favoritos[0].idFavorito;
    
    // Eliminar la relación en proyectoenfavorito
    const queryEliminar = 'DELETE FROM proyectoenfavorito WHERE idFavorito = ? AND idProyecto = ?';
    
    db.query(queryEliminar, [idFavorito, idProyecto], (error, result) => {
      if (error) {
        console.error('Error al eliminar de favoritos:', error);
        return res.status(500).json({ message: "Error al eliminar de favoritos" });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Proyecto no encontrado en favoritos" });
      }
      
      res.json({ message: "Proyecto eliminado de favoritos" });
    });
  });
});


// Obtener proyectos favoritos del usuario
app.get('/favoritos/proyectos', verificarToken, (req, res) => {
  const idUsuario = req.usuario.idUsuario;
  
  const query = `
    SELECT p.idProyecto, p.Titulo 
    FROM proyectos p
    JOIN proyectoenfavorito pf ON p.idProyecto = pf.idProyecto
    JOIN favoritos f ON pf.idFavorito = f.idFavorito
    JOIN usuarios u ON p.idUsuario = u.idUsuario
    WHERE f.idUsuario = ? AND u.activo = 1
  `;
  
  db.query(query, [idUsuario], (error, results) => {
    if (error) {
      console.error('Error al obtener proyectos favoritos:', error);
      return res.status(500).json({ message: "Error al obtener proyectos favoritos" });
    }
    
    res.json(results);
  });
});


// Obtener proyectos creados por el usuario actual
app.get('/proyectos/usuario', verificarToken, (req, res) => {
  const idUsuario = req.usuario.idUsuario;
  
  const query = `
    SELECT p.idProyecto, p.Titulo 
    FROM proyectos p
    WHERE p.idUsuario = ?
  `;
  
  db.query(query, [idUsuario], (error, results) => {
    if (error) {
      console.error('Error al obtener proyectos del usuario:', error);
      return res.status(500).json({ message: "Error al obtener proyectos del usuario" });
    }
    
    res.json(results);
  });
});

// Endpoint para buscar proyectos por título, tags o usuario
app.get('/proyectos/buscar', verificarToken, (req, res) => {
  const searchTerm = req.query.q;
  
  if (!searchTerm || searchTerm.trim() === '') {
    return res.json([]);
  }
  
  // Dividir la búsqueda en palabras individuales para búsqueda más flexible
  const searchTerms = searchTerm.split(' ').filter(term => term.trim() !== '');
  
  // Construir condiciones de búsqueda dinámicamente para cada término
  const conditions = searchTerms.map(() => 
    `(p.Titulo LIKE ? OR t.NombreTag LIKE ? OR u.nickname LIKE ?)`
  ).join(' AND ');
  
  // Preparar parámetros para la consulta (cada término se usa 3 veces: título, tag, nickname)
  const params = [];
  searchTerms.forEach(term => {
    params.push(`%${term}%`, `%${term}%`, `%${term}%`);
  });
  
  const query = `
    SELECT DISTINCT p.idProyecto, p.Titulo 
    FROM proyectos p
    LEFT JOIN tagenproyecto tp ON p.idProyecto = tp.idProyecto
    LEFT JOIN tags t ON tp.idTag = t.idTag
    JOIN usuarios u ON p.idUsuario = u.idUsuario
    WHERE ${conditions} AND u.activo = 1
  `;
  
  db.query(query, params, (error, results) => {
    if (error) {
      console.error('Error al buscar proyectos:', error);
      return res.status(500).json({ message: "Error al buscar proyectos" });
    }
    
    res.json(results);
  });
});

//////// ELIMINAR PROYECTO////////////
app.delete('/proyectos/:idProyecto', verificarToken, (req, res) => {
  const idProyecto = req.params.idProyecto;
  const idUsuario = req.usuario.idUsuario;
  
  
  const queryVerificarPropietario = 'SELECT idProyecto FROM proyectos WHERE idProyecto = ? AND idUsuario = ?';
  
  db.query(queryVerificarPropietario, [idProyecto, idUsuario], (error, results) => {
    if (error) {
      console.error('Error al verificar propiedad del proyecto:', error);
      return res.status(500).json({ message: "Error al eliminar proyecto" });
    }
    
    if (results.length === 0) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este proyecto" });
    }
    
    db.beginTransaction((err) => {
      if (err) {
        console.error('Error al iniciar transacción:', err);
        return res.status(500).json({ message: "Error al eliminar proyecto" });
      }
      
      // 1. Eliminar registros en proyectoenfavorito
      const queryEliminarFavoritos = 'DELETE FROM proyectoenfavorito WHERE idProyecto = ?';
      
      db.query(queryEliminarFavoritos, [idProyecto], (error) => {
        if (error) {
          return db.rollback(() => {
            console.error('Error al eliminar favoritos:', error);
            res.status(500).json({ message: "Error al eliminar proyecto" });
          });
        }
        
        // 2. Eliminar registros en tagenproyecto
        const queryEliminarTags = 'DELETE FROM tagenproyecto WHERE idProyecto = ?';
        
        db.query(queryEliminarTags, [idProyecto], (error) => {
          if (error) {
            return db.rollback(() => {
              console.error('Error al eliminar tags del proyecto:', error);
              res.status(500).json({ message: "Error al eliminar proyecto" });
            });
          }
          
          // 3. Eliminar registros en contenidos
          const queryEliminarContenidos = 'DELETE FROM contenidos WHERE idProyecto = ?';
          
          db.query(queryEliminarContenidos, [idProyecto], (error) => {
            if (error) {
              return db.rollback(() => {
                console.error('Error al eliminar contenidos:', error);
                res.status(500).json({ message: "Error al eliminar proyecto" });
              });
            }
            
            // 4. Finalmente, eliminar el proyecto
            const queryEliminarProyecto = 'DELETE FROM proyectos WHERE idProyecto = ?';
            
            db.query(queryEliminarProyecto, [idProyecto], (error) => {
              if (error) {
                return db.rollback(() => {
                  console.error('Error al eliminar proyecto:', error);
                  res.status(500).json({ message: "Error al eliminar proyecto" });
                });
              }
              
              // Confirmar la transacción
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Error al confirmar transacción:', err);
                    res.status(500).json({ message: "Error al eliminar proyecto" });
                  });
                }
                
                res.json({ message: "Proyecto eliminado correctamente" });
              });
            });
          });
        });
      });
    });
  });
});

////Editar Proyecto
app.put('/proyectos/:idProyecto', verificarToken, upload.single('imagen'), (req, res) => {
  const idProyecto = req.params.idProyecto;
  const { titulo } = req.body;
  let tags = req.body.tags;
  const idUsuario = req.usuario.idUsuario;
  const nuevaImagen = req.file ? req.file.buffer : null;
  
  const queryVerificarPropietario = 'SELECT idProyecto FROM proyectos WHERE idProyecto = ? AND idUsuario = ?';
  
  db.query(queryVerificarPropietario, [idProyecto, idUsuario], (error, results) => {
    if (error) {
      console.error('Error al verificar propiedad del proyecto:', error);
      return res.status(500).json({ message: "Error al actualizar proyecto" });
    }
    
    if (results.length === 0) {
      return res.status(403).json({ message: "No tienes permiso para actualizar este proyecto" });
    }
    
    
    if (!tags) {
      tags = [];
    } else if (!Array.isArray(tags)) {
      tags = [tags]; 
    }
    
    // Iniciar transacción
    db.beginTransaction((err) => {
      if (err) {
        console.error('Error al iniciar transacción:', err);
        return res.status(500).json({ message: "Error al actualizar proyecto" });
      }
      
      // 1. Actualizar el título del proyecto
      const queryActualizarProyecto = 'UPDATE proyectos SET Titulo = ? WHERE idProyecto = ?';
      
      db.query(queryActualizarProyecto, [titulo, idProyecto], (error) => {
        if (error) {
          return db.rollback(() => {
            console.error('Error al actualizar proyecto:', error);
            res.status(500).json({ message: "Error al actualizar proyecto" });
          });
        }
        
        // 2. Si hay una nueva imagen, insertarla
        let siguientePaso = actualizarTags;
        
        if (nuevaImagen) {
          // Verificar si ya existe una imagen para este proyecto
          const queryVerificarImagen = 'SELECT idContenido FROM contenidos WHERE idProyecto = ? AND tipo = "imagen" LIMIT 1';
          
          db.query(queryVerificarImagen, [idProyecto], (error, imagenResults) => {
            if (error) {
              return db.rollback(() => {
                console.error('Error al verificar imagen existente:', error);
                res.status(500).json({ message: "Error al actualizar imagen" });
              });
            }
            
            if (imagenResults.length > 0) {
              // Actualizar la imagen existente
              const idContenido = imagenResults[0].idContenido;
              const queryActualizarImagen = 'UPDATE contenidos SET contenido = ? WHERE idContenido = ?';
              
              db.query(queryActualizarImagen, [nuevaImagen, idContenido], (error) => {
                if (error) {
                  return db.rollback(() => {
                    console.error('Error al actualizar imagen:', error);
                    res.status(500).json({ message: "Error al actualizar imagen" });
                  });
                }
                siguientePaso();
              });
            } else {
              // Insertar nueva imagen
              const queryInsertarImagen = 'INSERT INTO contenidos (tipo, contenido, idProyecto) VALUES (?, ?, ?)';
              
              db.query(queryInsertarImagen, ['imagen', nuevaImagen, idProyecto], (error) => {
                if (error) {
                  return db.rollback(() => {
                    console.error('Error al insertar imagen:', error);
                    res.status(500).json({ message: "Error al guardar imagen" });
                  });
                }
                siguientePaso();
              });
            }
          });
        } else {
          siguientePaso();
        }
        
        // 3. Actualizar tags
        function actualizarTags() {
          // Primero eliminar todas las relaciones de tags existentes
          const queryEliminarTags = 'DELETE FROM tagenproyecto WHERE idProyecto = ?';
          
          db.query(queryEliminarTags, [idProyecto], (error) => {
            if (error) {
              return db.rollback(() => {
                console.error('Error al eliminar tags existentes:', error);
                res.status(500).json({ message: "Error al actualizar tags" });
              });
            }
            
            // Si no hay nuevos tags, terminar
            if (tags.length === 0) {
              return finalizarTransaccion();
            }
            
            // Procesar los nuevos tags
            const processedTags = [];
            let tagsProcessed = 0;
            
            tags.forEach((tag) => {
              // Verificar si el tag ya existe
              const checkTagQuery = 'SELECT idTag FROM tags WHERE NombreTag = ?';
              
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
                  const insertTagQuery = 'INSERT INTO tags (NombreTag, idUsuario) VALUES (?, ?)';
                  
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
            
            // Verificar si todos los tags han sido procesados
            function checkAllTagsProcessed() {
              tagsProcessed++;
              
              if (tagsProcessed === tags.length) {
                // Relacionar los tags con el proyecto
                let tagRelationsProcessed = 0;
                
                processedTags.forEach((tagId) => {
                  const tagRelationQuery = 'INSERT INTO tagenproyecto (idProyecto, idTag) VALUES (?, ?)';
                  
                  db.query(tagRelationQuery, [idProyecto, tagId], (error) => {
                    if (error) {
                      return db.rollback(() => {
                        console.error('Error al relacionar tag con proyecto:', error);
                        res.status(500).json({ message: "Error al relacionar tag con proyecto" });
                      });
                    }
                    
                    tagRelationsProcessed++;
                    
                    if (tagRelationsProcessed === processedTags.length) {
                      finalizarTransaccion();
                    }
                  });
                });
              }
            }
          });
        }
        
        // Finalizar la transacción
        function finalizarTransaccion() {
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error al confirmar transacción:', err);
                res.status(500).json({ message: "Error al actualizar proyecto" });
              });
            }
            
            res.json({ 
              message: "Proyecto actualizado correctamente", 
              idProyecto: idProyecto 
            });
          });
        }
      });
    });
  });
});

// Asegúrate de que esta parte esté al final del archivo, después de todas las rutas
// app.listen(port, () => {
//     console.log(`Servidor escuchando en el puerto ${port}`);
// });


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