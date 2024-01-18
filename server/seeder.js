import connectDB from "./config/dbConnect.js";
import users from "./data/users.js";
import User from "./models/userModel.js";

await connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    const createdUsers = await User.insertMany(users);

    console.log("Data cleared");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-id") {
  destroyData();
} else {
  importData();
}