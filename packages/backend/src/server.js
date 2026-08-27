import cors from "cors";
import express from "express";

import { attributesRouter } from "./routes/attributes.routes.js";
import { charactersRouter } from "./routes/characters.routes.js";
import { racesRouter } from "./routes/races.routes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/races", racesRouter);
app.use("/api/attributes", attributesRouter);
app.use("/api/characters", charactersRouter);

app.listen(PORT, () => {
  console.log(`[backend] Tales of Elyndor API escuchando en http://localhost:${PORT}`);
});
