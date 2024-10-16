const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Almacenamiento temporal de URLs con 2 demos
let dataTemp = [
  {
    longUrl: "https://www.google.com/",
    shortUrl: "google",
  },
  {
    longUrl: "https://www.example.com/demo2",
    shortUrl: "example",
  },
];

// Función para crear la URL corta
const createShortUrl = (shortUrl) => {
  return `${process.env.BASE_URL || `http://localhost:${PORT}`}/${shortUrl}`;
};

// Inicializar las URLs cortas en dataTemp
dataTemp = dataTemp.map((entry) => ({
  ...entry,
  shortUrl: createShortUrl(entry.shortUrl),
}));

// Ruta para acortar una URL
app.post("/shorten", (req, res) => {
  let { longUrl, shortUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "URL es requerida" });
  }

  // Validar si el shortUrl ya está en uso
  if (shortUrl) {
    const existing = dataTemp.find((entry) => entry.shortUrl.endsWith(shortUrl));
    if (existing) {
      return res.status(400).json({ error: "Esta URL corta ya está en uso" });
    }
  } else {
    // Si no se proporciona un shortUrl, usar un ID basado en el tamaño del array
    shortUrl = `short${dataTemp.length}`;
  }

  // Crear la nueva entrada
  const newEntry = { longUrl, shortUrl: createShortUrl(shortUrl) };
  dataTemp.push(newEntry);

  res.json({ shortUrl: newEntry.shortUrl });
});

// Ruta para redirigir a la URL original
app.get("/:shortUrl", (req, res) => {
  const { shortUrl } = req.params;

  // Buscar la URL original
  //   const entry = dataTemp.find((e) => e.shortUrl.endsWith(shortUrl));
  const entry = dataTemp.find((e) => e.shortUrl === shortUrl);

  if (entry) {
    res.redirect(entry.longUrl);
  } else {
    res.status(404).json({ error: "URL no encontrada" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
