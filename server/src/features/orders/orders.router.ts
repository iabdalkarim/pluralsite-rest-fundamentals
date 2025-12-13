import express from "express";
import { getOrderDetail, getOrders } from "./orders.service";

export const ordersRouter = express.Router();

ordersRouter.get("/", async (req, res) => {
    const take = req.query.take ? parseInt(req.query.take as string, 10) : undefined;
    const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : undefined;
    console.log(`Received pagination parameters - take: ${take}, skip: ${skip}`);
    if (take === undefined || skip === undefined || isNaN(take) || isNaN(skip) || take <= 0 || skip < 0) {
        res.status(400).send({ message: "Invalid pagination parameters. 'take' query parameter must be > 0 and 'skip' query parameter must be >= 0" });
        return;
    }
    const orders = await getOrders(skip, take);
    res.json(orders);
});

ordersRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const order = await getOrderDetail(id);
    if (order) {
        res.json(order);
    } else {
        res.status(404).send({ message: "Order not found" });
    }
})