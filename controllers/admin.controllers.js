import { Product } from "../models/product.models.js";
import fs from "fs/promises";

const getProduct = async (req, res) => {
  // res.send("Hello");
  try {
    const products = await Product.find();
    const productList = products.map((product) => {
      if (product.productImage) {
        return {
          ...product._doc,
          productImage: `${process.env.API_BASE_URL}/uploads/${product.productImage}`,
        };
      } else {
        return {
          ...product._doc,
          productImage: null,
        };
      }
    });
    return res.send(productList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const addProduct = async (req, res) => {
  try {
    console.log("Body: ", req.body);
    console.log("File:", req.file);

    let imagePath = null;
    if (req.file) {
      imagePath = req.file.filename;
    }

    const productData = {
      ...req.body,
      productImage: imagePath,
    };

    const product = await Product.create(productData);
    return res.send(product);
  } catch (error) {
    console.log("error in saving the data");

    res
      .status(500)
      .json({ error: `error in saving the data ${error.message}` });
  }
};
const getSingleProduct = async (req, res) => {
  try {
    const data = await Product.findById(req.params.id);
    const product = {
      ...data._doc,
      productImage: `${process.env.API_BASE_URL}/uploads/${data.productImage}`,
    };
    res.status(200).json(product);
  } catch (error) {
    console.log("Something wents wrong in fetch the product, ", error);
    // res.exit(() => console.log("Can't able to find the Product"));
    res.status(500).json({ error: error.message });
  }
  // console.log(req.params.id);
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log(product);
    if (product.productImage) {
      await fs.unlink(`public/uploads/${product.productImage}`);
    }

    const deletedProduct = await Product.deleteOne({ _id: req.params.id });
    if (deletedProduct.deletedCount === 0) {
      console.log("No product founded with that id");
      return;
    }
    // console.log("Deleted: ", deletedProduct);
    res.status(200).json("Product Deleted");
  } catch (error) {
    console.log("Error deleting item: ", error);
    res.status(500).json({ error: `Error deleting item, ${error}` });
  }
};

const updateProduct = async (req, res) => {
  try {
    // console.log(`Body: ${req.body}`);

    const productData = { ...req.body };
    if (req.file) {
      const deleteFilePath = await Product.findById(req.params.id);
      if (deleteFilePath) {
        await fs.unlink(`public/uploads/${deleteFilePath.productImage}`);
      }
      productData.productImage = req.file.filename;
    }
    const findProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: productData,
      },
      { new: true }
    );
    if (!findProduct) {
      return res.status(400).json({ message: `No Product founded` });
    }
    res.status(200).json({ message: `Product Updated, ${findProduct}` });
  } catch (error) {
    res.status(500).json({ error: `error updating product, ${error}` });
  }
};

// const updateProduct = async (req, res) => {
//   try {
//     const updateData = { ...req.body }; // Create a copy of req.body

//     if (req.file) {
//       updateData.productImage = req.file.filename;
//     }

//     const findProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       { $set: updateData },
//       { new: true } // Options object for findByIdAndUpdate
//     );

//     if (!findProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json({ message: "Product Updated", product: findProduct });
//   } catch (error) {
//     res.status(500).json({ error: `Error updating product: ${error.message}` });
//   }
// };

export {
  getProduct,
  addProduct,
  getSingleProduct,
  deleteProduct,
  updateProduct,
};
