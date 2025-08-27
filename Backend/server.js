// server.js
const dotenv = require('dotenv');
dotenv.config(); // ✅ Cargar variables del .env antes de cualquier otra cosa

const app = require('./src/index'); // ✅ Recién ahora importa la app que usa process.env

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
