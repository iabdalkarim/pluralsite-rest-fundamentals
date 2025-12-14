import express from "express";
import {
  getItems,
  getItemDetail,
  upsertItem,
  deleteItem,
} from "./items.service";
import { validate } from "../../middleware/validation.middleware";
import {
  idNumberRequestSchema,
  itemPOSTRequestSchema,
  itemPUTRequestSchema,
} from "../types";

export const itemsRouter = express.Router();

itemsRouter.get("/", async (req, res) => {
  const items = await getItems();
  items.forEach((item) => {
    item.imageUrl = buildImageUrl(req, item.id);
  });
  res.json(items);
});

itemsRouter.get("/:id", validate(idNumberRequestSchema), async (req, res) => {
  const itemId = idNumberRequestSchema.parse(req).params.id;
  const item = await getItemDetail(itemId);
  if (item) {
    item.imageUrl = buildImageUrl(req, itemId);
    res.json(item);
  } else {
    res.status(404).send({ message: "Item not found" });
  }
});

itemsRouter.post("/", validate(itemPOSTRequestSchema), async (req, res) => {
  const itemDto = itemPOSTRequestSchema.parse(req).body;
  const item = await upsertItem(itemDto, null);
  if (item) {
    res.status(201).json(item);
  } else {
    res.status(400).send({ message: "Failed to create item" });
  }
});

itemsRouter.delete(
  "/:id",
  validate(idNumberRequestSchema),
  async (req, res) => {
    const itemId = idNumberRequestSchema.parse(req).params.id;
    const item = await deleteItem(itemId);
    if (item) {
      res.status(204).json(item);
    } else {
      res.status(404).send({ message: "Item not found" });
    }
  }
);

itemsRouter.put("/:id", validate(itemPUTRequestSchema), async (req, res) => {
  const parsed = itemPUTRequestSchema.parse(req);
  const itemId = parsed.params.id;
  const itemDto = parsed.body;
  const item = await upsertItem(itemDto, itemId);
  if (item) {
    res.json(item);
  } else {
    res.status(400).send({ message: "Failed to update item" });
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
function buildImageUrl(req: any, id: number): string {
  return `${req.protocol}://${req.get("host")}/images/${id}.jpg`;
}
