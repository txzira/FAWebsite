import commerce from "../lib/commerce";
//get all commercejs product categories for iteration
export default async function handler(req, res) {
  const { data: categories } = await commerce.categories.list();
  const allCategories = [];

  async function getNthSubcategories(SubcategoryId) {
    //function to retrieve subcategory list of a category. e.g category: "Tops" subcategories: ["T-Shirts", "Long-Sleeves","Sweatshirts","Etc"]
    const nthSubcategory = await commerce.categories.retrieve(SubcategoryId);

    if (nthSubcategory.children.length) {
      return await nthSubcategory.children;
    }
    return 0;
  }

  async function getSubcategories(parent) {
    if (parent.length !== 0) {
      const data = parent.map(async (child) => {
        //push category slug to list of category slugs
        allCategories.push(child.slug);
        const result = await getNthSubcategories(child.id);
        if (result && result.length !== 0) {
          return getSubcategories(result);
        }
        return 0;
      });
      await Promise.all(data);
    } else {
      //base case
      return 0;
    }
  }
  await getSubcategories(categories);
  res.status(201).json({ categories: allCategories });
}
