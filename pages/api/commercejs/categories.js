import commerce from "../../../lib/commerce";

export default async function handler(req, res) {
  const { data: categories } = await commerce.categories.list();

  const allCategories = [];

  async function getNthSubcategories(SubcategoryId) {
    const nthSubcategory = await commerce.categories.retrieve(SubcategoryId);

    if (nthSubcategory.children.length) {
      return await nthSubcategory.children;
    }
    return 0;
  }

  async function getSubcategories(parent) {
    if (parent.length !== 0) {
      const data = parent.map(async (child) => {
        allCategories.push(child.slug);
        const result = await getNthSubcategories(child.id);
        if (result && result.length !== 0) {
          return getSubcategories(result);
        }
        return 0;
      });
      await Promise.all(data);
    } else {
      return 0;
    }
  }
  await getSubcategories(categories);
  res.status(201).json({ categories: allCategories });
}
