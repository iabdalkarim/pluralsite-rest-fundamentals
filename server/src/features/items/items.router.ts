import express from "express";
import { getItems, getItemDetail } from "./items.service";
import { validate } from "../../middleware/validation.middleware";
import { idUUIDRequestSchema } from "../types";

export const itemsRouter = express.Router();

itemsRouter.get("/", async (req, res) => {
  const items = await getItems();
  items.forEach((item) => {
    item.imageUrl = buildImageUrl(req, item.id);
  });
  res.json(items);
});

itemsRouter.get("/:id", validate(idUUIDRequestSchema), async (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const item = await getItemDetail(itemId);
  if (item) {
    item.imageUrl = buildImageUrl(req, itemId);
    res.json(item);
  } else {
    res.status(404).send({ message: "Item not found" });
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
function buildImageUrl(req: any, id: number): string {
  return `${req.protocol}://${req.get("host")}/images/${id}.jpg`;
}
