import express from "express";
import { getOrderDetail, getOrders } from "./orders.service";
import { validate } from "../../middleware/validation.middleware";
import { idUUIDRequestSchema, pagingRequestSchema } from "../types";

export const ordersRouter = express.Router();

ordersRouter.get("/", validate(pagingRequestSchema), async (req, res) => {
  const parsedRequest = pagingRequestSchema.parse(req);
  const skip = parsedRequest.query.skip;
  const take = parsedRequest.query.take;
  const orders = await getOrders(skip, take);
  res.json(orders);
});

ordersRouter.get("/:id", validate(idUUIDRequestSchema), async (req, res) => {
  const id = req.params.id;
  const order = await getOrderDetail(id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).send({ message: "Order not found" });
  }
});
