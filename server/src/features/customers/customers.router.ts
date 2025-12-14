import express from "express";
import {
  getCustomers,
  getCustomerDetail,
  searchCustomers,
  upsertCustomer,
  deleteCustomer,
} from "./customers.service";
import { getOrdersForCustomer } from "../orders/orders.service";
import {
  customerPOSTRequestSchema,
  customerPUTRequestSchema,
  idUUIDRequestSchema,
} from "../types";
import { validate } from "../../middleware/validation.middleware";

export const customersRouter = express.Router();

customersRouter.get("/", async (req, res) => {
  const customers = await getCustomers();
  res.json(customers);
});

customersRouter.get("/:id", validate(idUUIDRequestSchema), async (req, res) => {
  const customerId = idUUIDRequestSchema.parse(req).params.id;
  const customer = await getCustomerDetail(customerId);
  if (customer) {
    res.json(customer);
  } else {
    res.status(404).send({ message: "Customer not found" });
  }
});

customersRouter.get(
  "/:id/orders",
  validate(idUUIDRequestSchema),
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

customersRouter.post(
  "/",
  validate(customerPOSTRequestSchema),
  async (req, res) => {
    const customerDto = customerPOSTRequestSchema.parse(req).body;
    const customer = await upsertCustomer(customerDto, null);
    if (customer) {
      res.status(201).json(customer);
    } else {
      res.status(400).send({ message: "Failed to create customer" });
    }
  }
);

customersRouter.delete(
  "/:id",
  validate(idUUIDRequestSchema),
  async (req, res) => {
    const customerId = idUUIDRequestSchema.parse(req).params.id;
    const customer = await deleteCustomer(customerId);
    if (customer) {
      res.status(204).send(customer);
    } else {
      res.status(404).send({ message: "Customer not found" });
    }
  }
);

customersRouter.put(
  "/:id",
  validate(customerPUTRequestSchema),
  async (req, res) => {
    const parsed = customerPUTRequestSchema.parse(req);
    const customerId = parsed.params.id;
    const customerDto = parsed.body;
    const customer = await upsertCustomer(customerDto, customerId);
    if (customer) {
      res.json(customer);
    } else {
      res.status(400).send({ message: "Failed to update customer" });
    }
  }
);
