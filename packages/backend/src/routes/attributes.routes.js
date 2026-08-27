import { Router } from "express";
import { ATTRIBUTES } from "@toe/shared";

export const attributesRouter = Router();

// GET /api/attributes
attributesRouter.get("/", (req, res) => {
  res.json(ATTRIBUTES);
});
