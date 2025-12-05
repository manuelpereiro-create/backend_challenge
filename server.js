const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/metrics', require('./routes/metricsRoutes'));

/*

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

*/

// Probar conexión a MySQL
app.get('/api/test-db', async (req, res) => {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();
    res.json({ 
      success: true, 
      message: 'Conexión a MySQL exitosa',
      database: process.env.DB_NAME 
    });
  } catch (error) {
    console.error('Error de conexión a MySQL:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al conectar a MySQL', 
      error: error.message 
    });
  }
});

// Endpoint de bienvenida
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Backend Challenge',
    endpoints: {
      testDB: '/api/test-db'
    }
  });
});

// Iniciar el servidor
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  
  // Verificar conexión a la base de datos al iniciar
  try {
    const connection = await db.getConnection();
    await connection.ping();
    console.log('✓ Conexión a MySQL establecida correctamente');
    console.log(`✓ Base de datos: ${process.env.DB_NAME}`);
    connection.release();
  } catch (error) {
    console.error('✗ Error al conectar a MySQL:', error.message);
    console.error('Verifica que MySQL esté corriendo y las credenciales en .env sean correctas');
  }
});
