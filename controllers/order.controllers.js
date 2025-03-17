import cartModel from "../models/cart.models.js";
import orderHistoryModel from "../models/orderHistory.models.js";
// import { Product } from "../models/product.models.js";

const addItemToCart = async (req, res) => {
  console.log("-------------------------------------");

  try {
    const { user, body } = req;
    // console.log("body ", req.body);
    // console.log("User ", user);

    // if (user._id)
    let cart = await cartModel.findOne({ userId: user._id });
    if (cart) {
      cart.cartItems = body;
      console.log("Cart founded, ", cart.cartItems);
    } else {
      cart = new cartModel();
      cart.userId = user._id;
      cart.cartItems = body;
      console.log("else, ", cart);
    }
    await cart.save();
    res.status(200).json({ message: "Product added sucessfully", cart });
  } catch (error) {
    res.status(500).json({ error: `Error adding Product, ${error.message}` });
  }
};
const getCartItem = async (req, res) => {
  const user = req.user;

  const cartItem = await cartModel.findOne({ userId: user._id });
  if (cartItem) {
    // console.log("cartItem: ", cartItem);
    const { cartItems } = cartItem;
    // console.log("cartItems: ", cartItems);

    res.status(200).json({ message: "Take cart item", cartItems });
  }
};

// const deleteCartItem = async (req, res) => {
//   try {
//     const product = await req.params.id;
//     if (!product)
//       return res.status(401).json({ message: "Request Not valid..." });

//     console.log(cartModel.cartItems);

//     res.status(200).json({ message: "Item deleted Sucessfully" });
//   } catch (error) {
//     console.log("Error deleting item: ", error);
//     res.status(500).json({ error: `Error deleting item, ${error}` });
//   }
// };
const dispatchToOrderHistory = async (req, res) => {
  const user = req.user;
};

export { addItemToCart, dispatchToOrderHistory, getCartItem };
