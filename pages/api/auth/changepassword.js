import { connectToDatabase } from "../../../lib/mongodb";
import { hashPassword, verifyPassword } from "../../../lib/hash";

async function handler(req, res) {
  if (req.method === "POST") {
    //Connect to DB
    const client = await connectToDatabase();
    //Get all the users
    const users = await client.db().collection("users");
    //Find user with the email
    const user = await users.findOne({
      email: req.body.email,
    });
    //Not found - send error res
    if (!user) {
      client.close();
      throw new Error("No user found with the email");
    }
    //check sent old password matches password in database
    const checkPassword = await verifyPassword(req.body.oldPassword, user.password);
    //Incorrect password - send response
    if (!checkPassword) {
      client.close();
      throw new Error("Password doesnt match");
    } else {
      const hashedPassword = await hashPassword(req.body.newPassword);
      await client
        .db()
        .collection("users")
        .updateOne({ email: req.body.email }, { $set: { password: hashedPassword } });
    }
  }
}
export default handler;
