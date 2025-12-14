import express from "express";
import {
  addOrderItems,
  deleteOrder,
  deleteOrderItem,
  getOrderDetail,
  getOrders,
  upsertOrder,
} from "./orders.service";
import { validate } from "../../middleware/validation.middleware";
import {
  idItemIdUUIDRequestSchema,
  idUUIDRequestSchema,
  orderItemsDTORequestSchema,
  orderPOSTRequestSchema,
  orderPUTRequestSchema,
  pagingRequestSchema,
} from "../types";

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

ordersRouter.post("/", validate(orderPOSTRequestSchema), async (req, res) => {
  const orderDto = orderPOSTRequestSchema.parse(req).body;
  const order = await upsertOrder(orderDto, null);
  if (order) {
    res.status(201).json(order);
  } else {
    res.status(400).send({ message: "Failed to create order" });
  }
});

ordersRouter.post(
  "/:id/items",
  validate(orderItemsDTORequestSchema),
  async (req, res) => {
    const parsedRequest = orderItemsDTORequestSchema.parse(req);
    const orderId = parsedRequest.params.id;
    const itemsDto = parsedRequest.body;
    const orderDetails = await addOrderItems(orderId, itemsDto);
    if (orderDetails) {
      res.status(200).json(orderDetails);
    } else {
      res.status(400).send({ message: "Failed to add items to order" });
    }
  }
);

ordersRouter.delete("/:id", validate(idUUIDRequestSchema), async (req, res) => {
  const orderId = idUUIDRequestSchema.parse(req).params.id;
  const order = await deleteOrder(orderId);
  if (order) {
    res.status(204).json(order);
  } else {
    res.status(404).send({ message: "Order not found" });
  }
});

ordersRouter.delete(
  "/:id/items/:itemId",
  validate(idItemIdUUIDRequestSchema),
  async (req, res) => {
    const parsedRequest = idItemIdUUIDRequestSchema.parse(req);
    const orderId = parsedRequest.params.id;
    const itemId = parsedRequest.params.itemId;
    const order = await deleteOrderItem(orderId, itemId);
    if (order) {
      res.status(204).json(order);
    } else {
      res.status(404).send({ message: "Order or Item not found" });
    }
  }
);

ordersRouter.put("/:id", validate(orderPUTRequestSchema), async (req, res) => {
  const parsed = orderPUTRequestSchema.parse(req);
  const orderId = parsed.params.id;
  const orderDto = { customerId: "", ...parsed.body };
  const order = await upsertOrder(orderDto, orderId);
  if (order) {
    res.json(order);
  } else {
    res.status(400).send({ message: "Failed to update order" });
  }
});
