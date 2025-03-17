import mongoose from "mongoose";

const mongodbURI = `mongodb+srv://thdeepalisingh:vIZmKujasMOIdo9j@ecomm.avaq2.mongodb.net/ecomm?retryWrites=true&w=majority&appName=ecomm`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongodbURI);
    console.log("DB is Connected");
  } catch (error) {
    console.log("DB couldn't Connected...", error);
    process.exit();
  }
};

export default connectDB;
