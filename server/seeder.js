import connectDB from "./config/dbConnect.js";
import packages from "./data/packages.js";
import users from "./data/users.js";
import Package from "./models/packageModel.js";
import User from "./models/userModel.js";

await connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Package.deleteMany();

    const createdUsers = await User.insertMany(users);
    const createdPackages=await Package.insertMany(packages);
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