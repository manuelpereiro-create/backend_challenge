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
app.use('/api/health', require('./routes/healthRoutes'));


app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  
  // Verify database connection
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
