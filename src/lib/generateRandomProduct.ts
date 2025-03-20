import Brand from '@/models/Brand.model';
import Product from '@/models/Product.model';
import { Concentrations, Category } from './perfumeDetails';

const getRandomElement = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export const createRandomProducts = async () => {
  // Fetch some existing Tag IDs for category and tags
  const brands = await Brand.find(); // Get existing brands
  const brandIds = brands.map((brand) => brand._id); // Extract ObjectIds

  const randomProducts = [];

  for (let i = 0; i < 1000; i++) {
    const product = {
      name: `Perfume Product ${i}`,
      description: `This is the description for Perfume Product ${i}.`,
      brand: getRandomElement(brandIds),
      gender: getRandomElement(['Men', 'Women', 'Unisex']),
      concentration: getRandomElement(Concentrations),
      category: getRandomElement(Category),
      stock: Math.floor(Math.random() * 100) + 1, // Random stock (1-100)
      price: Math.floor(Math.random() * 5000) + 500, // Random price (500-5000)
      discount: Math.random() > 0.5 ? Math.floor(Math.random() * 30) : 0, // Random discount (0-30%)
      size: 50,
      mainPic: i % 2 ? '/pad.png' : '/keyboard.png', // Random image
      otherImages: ['/pad.png', '/keyboard.png', '/pad.png'], // 3 extra images
      isFeatured: Math.random() > 0.7, // 30% chance of being featured
      sales: Math.floor(Math.random() * 500), // Random sales count
      rating: (Math.random() * 5).toFixed(1), // Random rating (0-5)
      reviews: [],
    };

    randomProducts.push(product);
  }

  await Product.insertMany(randomProducts);
  console.log('1000 Random Perfumes Products Created!');
};

const perfumeBrands = [
  'Chanel',
  'Dior',
  'Gucci',
  'Versace',
  'Tom Ford',
  'Armani',
  'Yves Saint Laurent',
  'Burberry',
  'Calvin Klein',
  'Hugo Boss',
  'Prada',
  'Givenchy',
  'Dolce & Gabbana',
  'Hermès',
  'Lancôme',
  'Paco Rabanne',
  'Jean Paul Gaultier',
  'Creed',
  'Bvlgari',
  'Montblanc',
  'Ralph Lauren',
  'Carolina Herrera',
  'Jo Malone',
  'Azzaro',
  'Narciso Rodriguez',
  'Salvatore Ferragamo',
  'Kenzo',
  'Issey Miyake',
  'Balenciaga',
  'Elie Saab',
  'Viktor & Rolf',
  'Thierry Mugler',
  'Coach',
  'Giorgio Beverly Hills',
  'Zara',
  'Abercrombie & Fitch',
  'Diesel',
  'Ted Baker',
  'Lacoste',
  'Estee Lauder',
  'Bottega Veneta',
  'Roberto Cavalli',
  'Bentley',
  'Loewe',
  "Penhaligon's",
  'Maison Francis Kurkdjian',
  'Byredo',
  'Le Labo',
  'Tiziana Terenzi',
  'Initio',
];

export async function insertBrands() {
  try {
    const result = await Brand.insertMany(
      perfumeBrands.map((name) => ({ name })),
    );
    console.log('Inserted brands:', result);
  } catch (error) {
    console.error('Error inserting brands:', error);
  }
}
