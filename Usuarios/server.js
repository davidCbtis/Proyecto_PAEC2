const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/ProyectoPAEC', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión', err));

// Esquema de usuario
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  IdUsuario: Number,
  Nombre: String,
  Gmail: String,
  Edad: Number,
  Telefono: Number,
  Direccion: String
}));

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Sirve index.html desde raíz

// GET - obtener todos los usuarios
app.get('/api/Usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: '❌ Error al obtener usuarios' });
  }
});

// POST - agregar nuevo usuario
app.post('/api/Usuarios', async (req, res) => {
  try {
    const nuevo = new Usuario(req.body);
    await nuevo.save();
    res.json({ message: '✅ Usuario agregado correctamente' });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al agregar usuario', error: error.message });
  }
});

// PUT - actualizar usuario por IdUsuario
app.put('/api/Usuarios', async (req, res) => {
  try {
    const actualizado = await Usuario.findOneAndUpdate(
      { IdUsuario: req.body.IdUsuario },
      req.body,
      { upsert: true, new: true }
    );
    res.json({ message: '✅ Usuario actualizado o creado', data: actualizado });
  } catch (err) {
    res.status(500).json({ message: '❌ Error al actualizar usuario', error: err.message });
  }
});

// DELETE - eliminar usuario por IdUsuario
app.delete('/api/Usuarios/:id', async (req, res) => {
  try {
    const eliminado = await Usuario.findOneAndDelete({ IdUsuario: parseInt(req.params.id) });
    if (eliminado) {
      res.json({ message: '🗑️ Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ message: '⚠️ Usuario no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: '❌ Error al eliminar usuario', error: err.message });
  }
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
});
