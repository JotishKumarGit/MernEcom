import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connnected to mongodb ${con.connection.host}`);
    } catch (error) {
        console.log(`Error in mongodb ${error}`);
    }
}

export default connectDB;


