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

// Esquema de eventos
const Evento = mongoose.model('Eventos', new mongoose.Schema({
  Id: Number,
  Ubicacion: String,
  Organizador: String,
  usuarios: Number,
  hora: String
}));

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Sirve index.html desde la raíz

// GET - obtener todos los eventos
app.get('/api/eventos', async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ message: '❌ Error al obtener eventos' });
  }
});

// POST - agregar nuevo evento
app.post('/api/eventos', async (req, res) => {
  try {
    const nuevoEvento = new Evento(req.body);
    await nuevoEvento.save();
    res.json({ message: '✅ Evento agregado correctamente' });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al agregar evento', error: error.message });
  }
});

// PUT - Actualizar parcialmente un evento por ID
app.put('/api/eventos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: '❌ ID inválido' });
    }

    const datosActualizados = req.body;

    const eventoActualizado = await Evento.findOneAndUpdate(
      { Id: id },
      { $set: datosActualizados }, // Solo actualiza los campos presentes en el body
      { new: true } // Devuelve el documento actualizado
    );

    if (!eventoActualizado) {
      return res.status(404).json({ message: '❌ Evento no encontrado' });
    }

    res.json({
      message: '✅ Evento actualizado correctamente',
      data: eventoActualizado
    });
  } catch (err) {
    console.error('❌ Error al actualizar evento:', err);
    res.status(500).json({
      message: '❌ Error del servidor al actualizar el evento',
      error: err.message
    });
  }
});

// DELETE - eliminar evento
app.delete('/api/eventos/:id', async (req, res) => {
  try {
    const eliminado = await Evento.findOneAndDelete({ Id: parseInt(req.params.id) });
    if (eliminado) {
      res.json({ message: '🗑️ Evento eliminado correctamente' });
    } else {
      res.status(404).json({ message: '⚠️ Evento no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: '❌ Error al eliminar evento', error: err.message });
  }
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de eventos iniciado en http://localhost:${PORT}`);
});
