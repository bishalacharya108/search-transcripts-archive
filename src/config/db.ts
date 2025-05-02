import mongoose from "mongoose";    

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
      return true;
    }
  
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      throw new Error("DB_URL is not defined in environment variables");
    }
  
    try {
      await mongoose.connect(dbUrl);
      console.log("MongoDB Database Connected!");
      return true;
    } catch (error) {
      console.log("DB Connection Error:", error);
    }
  };
  

export default connectDB;