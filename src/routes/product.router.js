import { Router } from "express";
import FileManager from "../data/classes/DBManager.js";

const productRouter = Router();
const productFileManager = new FileManager.ProductFileManager();

productRouter.get("/", async (req, res) => {
  try {
    const products = await productFileManager.read();
    res.send(products);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

productRouter.post("/", async (req, res) => {
  const newProduct = {
    ...req.body,
  };

  try {
    const response = await productFileManager.create(newProduct);
    console.log(response);
    res.send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

productRouter.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const newProduct = req.body;

  try {
    const response = await productFileManager.update(pid, newProduct);
    res.send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

productRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const response = await productFileManager.delete(pid);
    res.send({
      message: "Producto eliminado",
      id: pid,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default productRouter;
