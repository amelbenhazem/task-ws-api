const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
const { initializeSocketEvents } = require("./sockets/taskEvents");
const User = require("./models/User"); // modèle utilisateur

// Configuration
dotenv.config();
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskws";

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Initialisation des sockets
initializeSocketEvents(io);

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Connexion MongoDB + test user
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connecté à MongoDB");
  })
  .catch((err) => console.error("❌ Erreur de connexion à MongoDB:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

// Sockets
io.on("connection", (socket) => {
  console.log("🔌 Nouveau client connecté");

  socket.on("disconnect", () => {
    console.log("🔌 Client déconnecté");
  });
});

// Gestion erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Une erreur est survenue" });
});

// Serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📚 Swagger : http://localhost:${PORT}/api-docs`);
});
