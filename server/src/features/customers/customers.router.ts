import express from "express";
import {
  getCustomers,
  getCustomerDetail,
  searchCustomers,
} from "./customers.service";
import { getOrdersForCustomer } from "../orders/orders.service";
import { idNumberRequestSchema } from "../types";
import { validate } from "../../middleware/validation.middleware";

export const customersRouter = express.Router();

customersRouter.get("/", async (req, res) => {
  const customers = await getCustomers();
  res.json(customers);
});

customersRouter.get(
  "/:id",
  validate(idNumberRequestSchema),
  async (req, res) => {
    const customerId = req.params.id;
    const customer = await getCustomerDetail(customerId);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).send({ message: "Customer not found" });
    }
  }
);

customersRouter.get(
  "/:id/orders",
  validate(idNumberRequestSchema),
  async (req, res) => {
    const customerId = req.params.id;
    const orders = await getOrdersForCustomer(customerId);
    res.json(orders);
  }
);

customersRouter.get("/search/:query", async (req, res) => {
  const query = req.params.query;
  const customers = await searchCustomers(query);
  res.json(customers);
});
