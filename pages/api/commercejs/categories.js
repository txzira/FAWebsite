import commerce from "../../../lib/commerce";

export default async function handler(req, res) {
  try {
    const categories = await commerce.categories.list();

    res.status(201).json({ categories: categories });
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
}
