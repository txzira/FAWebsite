import { connectToDatabase } from '../../../lib/mongodb';
import { hashPassword } from '../../../lib/hash';

async function handler(req, res) {
  if (req.method === 'POST') {
    //Get email and password from body
    const { email, password } = req.body;
    if(!email || !email.includes('@') || !password) {
      res.status(422).json({ message: 'Invalid Data' });
      return;
    }
    //Connect with database
    const client = await connectToDatabase();
    const db = client.db();
    //Check existing
    const checkExisting = await db.collection('users').findOne({email:email});
    //Send error response if duplicate user is found
    if(checkExisting) {
      res.status(422).json({ message: 'User already exists'});
      client.close();
      return;
    }
    //Hash password
    const hashedPassword = await hashPassword(password);
    //Insert User into database
    const status = await db.collection('users').insertOne({
      email: email, 
      password: hashedPassword,
    });
    //Send success response
    res.status(201).json({ message: 'User created' });
    //Close DB connection
    client.close();
  } else {
    //Response for other than POST method
    res.status(500).json({ message: 'Route not valid' });
  }
}

export default handler;