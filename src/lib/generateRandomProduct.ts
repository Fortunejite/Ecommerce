import Product from "@/models/Product.model";
import Tag from "@/models/Tag.model";

const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const createRandomProducts = async () => {
  // Fetch some existing Tag IDs for category and tags
  const tags = await Tag.find().limit(10); // Get 10 existing tags
  const tagIds = tags.map((tag) => tag._id); // Extract ObjectIds

  const randomProducts = [];

  for (let i = 0; i < 10; i++) {
    const product = {
      name: `Product ${i + 1}`,
      description: `This is a random description for product ${i + 1}.`,
      tags: [getRandomElement(tagIds), getRandomElement(tagIds)], // 2 random tags
      category: getRandomElement(tagIds), // 1 random category
      sizes: ["S", "M", "L", "XL"].filter(() => Math.random() > 0.5), // Random sizes
      stock: Math.floor(Math.random() * 100) + 1, // Random stock (1-100)
      price: Math.floor(Math.random() * 5000) + 500, // Random price (500-5000)
      colors: ["Red", "Blue", "Green", "Black", "White"].filter(() => Math.random() > 0.5), // Random colors
      discount: Math.random() > 0.5 ? Math.floor(Math.random() * 30) : 0, // Random discount (0-30%)
      mainPic: `https://source.unsplash.com/random/300x300?sig=${i}`, // Random image
      otherImages: [
        `https://source.unsplash.com/random/300x300?sig=${i + 10}`,
        `https://source.unsplash.com/random/300x300?sig=${i + 20}`,
      ], // 2 extra images
      isFeatured: Math.random() > 0.7, // 30% chance of being featured
      sales: Math.floor(Math.random() * 500), // Random sales count
      rating: (Math.random() * 5).toFixed(1), // Random rating (0-5)
      reviews: [],
    };

    randomProducts.push(product);
  }

  await Product.insertMany(randomProducts);
  console.log("10 Random Products Created!");
};
