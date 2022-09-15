import commerce from "../../../lib/commerce";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const categories = await commerce.categories.list();

    res.status(201).json({ categories: categories });
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
};
