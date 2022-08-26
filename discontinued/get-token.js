import { getToken } from "next-auth/jwt";

async function handler(req, res) {
  // If you don't have NEXTAUTH_SECRET set, you will have to pass your secret as `secret` to `getToken`
  const token = await getToken({ req });
  console.log(token);
  if (token) {
    // Signed in
    res.status(201).json(token);
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}

export default handler;
