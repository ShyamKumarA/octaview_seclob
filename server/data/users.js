import bcrypt from "bcryptjs";
const users = [
  {
    sponser: null,
    userStatus:"pending",
    username: "Super Admin",
    email: "seclobclt@gmail.com",
          address:"seclob-cyber",
    password: bcrypt.hashSync("123456", 10),
    isSuperAdmin: true,
         transactionPassword:bcrypt.hashSync("123456",10),
          previousPackage:"Bronza",
          addFundStatus:"",
phone:9852416378,
    ownSponserId: "OCV461054"
  },
  {
    sponser: null,
    userStatus:"readyToApprove",
    username: "User1",
    email: "user1@gmail.com",
          address:"seclob-cyber",
    password: bcrypt.hashSync("123456", 10),
    isSuperAdmin: false,
         transactionPassword:bcrypt.hashSync("123456",10),
          previousPackage:"Bronza",
phone:9852416388,
    ownSponserId: "OCV461055"
  },
  {
    sponser: null,
    userStatus:"approved",
    username: "User2",
    email: "user2@gmail.com",
          address:"seclob-cyber",
    password: bcrypt.hashSync("123456", 10),
    isSuperAdmin: false,
         transactionPassword:bcrypt.hashSync("123456",10),
          previousPackage:"Bronza",
phone:9852416380,
    ownSponserId: "OCV461056"
  },
];
export default users;