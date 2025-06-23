const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
require('dotenv').config(); // Esto sí se ejecuta con Node


// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// MODELOS ------------------------------

// Modelo de Eventos
const Eventos = mongoose.model('Eventos', new mongoose.Schema({
  id: Number,
  Ubicacion: String,
  Organizador: String,
  CantidadUsuarios: Number,
  Hora: String
}));

// Modelo de Usuarios
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  IdUsuario: Number,
  Nombre: String,
  Gmail: String,
  Edad: Number,
  Telefono: Number,
  Direccion: String
}));

// MIDDLEWARES ------------------------------
app.use(express.json());
app.use('/Eventos', express.static(path.join(__dirname, 'Eventos')));
app.use('/Usuarios', express.static(path.join(__dirname, 'Usuarios')));
app.use(express.static(__dirname)); // Sirve menu.html

// RUTA MENU PRINCIPAL ------------------------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'menu.html'));
});

// RUTAS API - EVENTOS ------------------------------
app.get('/api/Eventos', async (req, res) => {
  try {
    const eventos = await Eventos.find();
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener eventos' });
  }
});

app.post('/api/Eventos', async (req, res) => {
  try {
    const nuevo = new Eventos(req.body);
    await nuevo.save();
    res.json({ message: '✅ Evento agregado correctamente' });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al agregar evento', error: error.message });
  }
});

app.put('/api/Eventos', async (req, res) => {
  try {
    const actualizado = await Eventos.findOneAndUpdate(
      { id: req.body.id },
      req.body,
      { upsert: true, new: true }
    );
    res.json({ message: '✅ Evento actualizado o creado', data: actualizado });
  } catch (err) {
    res.status(500).json({ message: '❌ Error al actualizar evento', error: err.message });
  }
});

app.delete('/api/Eventos/:id', async (req, res) => {
  try {
    const eliminado = await Eventos.findOneAndDelete({ id: parseInt(req.params.id) });
    if (eliminado) {
      res.json({ message: '🗑️ Evento eliminado correctamente' });
    } else {
      res.status(404).json({ message: '⚠️ Evento no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: '❌ Error al eliminar evento', error: err.message });
  }
});

// RUTAS API - USUARIOS ------------------------------
app.get('/api/Usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: '❌ Error al obtener usuarios' });
  }
});

app.post('/api/Usuarios', async (req, res) => {
  try {
    const nuevo = new Usuario(req.body);
    await nuevo.save();
    res.json({ message: '✅ Usuario agregado correctamente' });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al agregar usuario', error: error.message });
  }
});

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

// INICIAR SERVIDOR ------------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
});
