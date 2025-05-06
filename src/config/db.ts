import mongoose from "mongoose";

const connectDB = async (): Promise<boolean> => {
  if (mongoose.connections[0].readyState) {
    return true;
  }

  const dbUrl = process.env.DB_URL;
  if (!dbUrl) {
    throw new Error("DB_URL is not defined in environment variables");
  }

  try {
    await mongoose.connect(dbUrl);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB Database Connected!");
    });

    connection.on("error", (error) => {
      console.error("MongoDB Connection Error:", error);
      process.exit(1);
    });

    return true;
  } catch (error) {
    console.error("DB Connection Error:", error);
    throw error;
  }
};

export default connectDB;
