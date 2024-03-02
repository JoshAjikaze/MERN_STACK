import mongoose from "mongoose";
const connectDB = async () => {
    try {
            console.log("... Initializing Database Connection ...");
            const connect = await mongoose.connect(process.env.MONGO_URI)
            console.log(
                "Database Connected 👍",
                connect.connection.host
            )
        } catch (err) {
            console.error(`ERROR:   ${err.message}`)
            process.exit(1)
        }
}

export default connectDB;