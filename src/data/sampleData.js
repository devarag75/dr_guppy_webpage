// Sample product data for demo/development (used when Firebase is not configured)

export const CATEGORIES = [
  { id: "fancy", name: "Fancy Guppy", icon: "✨", description: "Beautiful color variants with flowing tails" },
  { id: "rare", name: "Rare Guppy", icon: "💎", description: "Exotic and hard-to-find breeds" },
  { id: "breeding-pair", name: "Breeding Pairs", icon: "💑", description: "Healthy male-female pairs for breeding" },
  { id: "standard", name: "Standard Guppy", icon: "🐟", description: "Classic guppies for beginners" },
];

export const COLORS = [
  { id: "red", name: "Red", hex: "#ef4444" },
  { id: "blue", name: "Blue", hex: "#3b82f6" },
  { id: "yellow", name: "Yellow", hex: "#eab308" },
  { id: "green", name: "Green", hex: "#22c55e" },
  { id: "purple", name: "Purple", hex: "#a855f7" },
  { id: "mixed", name: "Mixed / Multicolor", hex: "linear-gradient(135deg, #ef4444, #3b82f6, #22c55e)" },
];

export const TYPES = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
  { id: "pair", name: "Pair (M+F)" },
];

export const sampleProducts = [
  {
    id: "demo-1",
    name: "Red Dragon Guppy Pair",
    price: 150,
    description: "Stunning red dragon guppy pair with vibrant crimson fins and a strong lineage. Perfect for collectors who appreciate deep, rich coloring. These fish are bred from championship lines and display exceptional finnage.",
    images: [
      "https://images.unsplash.com/photo-1520302519878-3769235b25e5?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&h=400&fit=crop",
    ],
    videoUrl: "",
    category: "fancy",
    type: "pair",
    color: "red",
    stock: 12,
    age: "3-4 months",
    size: "3-4 cm",
    breedingInfo: "Pure line bred, F5 generation",
    featured: true,
  },
  {
    id: "demo-2",
    name: "Blue Moscow Guppy Pair",
    price: 130,
    description: "Premium Blue Moscow guppy pair with deep metallic blue coloring throughout the body and fins. These are top-quality specimens with excellent genetics for breeding or display.",
    images: [
      "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1520302519878-3769235b25e5?w=600&h=400&fit=crop",
    ],
    videoUrl: "",
    category: "rare",
    type: "pair",
    color: "blue",
    stock: 8,
    age: "4-5 months",
    size: "3.5-4.5 cm",
    breedingInfo: "Imported strain, F3 generation",
    featured: true,
  },
  {
    id: "demo-3",
    name: "Albino Full Red Pair",
    price: 120,
    description: "Beautiful albino full red breeding pair. The male displays intense red coloring with albino characteristics, paired with a compatible female for successful breeding.",
    images: [
      "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1520302519878-3769235b25e5?w=600&h=400&fit=crop",
    ],
    videoUrl: "",
    category: "breeding-pair",
    type: "pair",
    color: "red",
    stock: 5,
    age: "5-6 months",
    size: "3-5 cm",
    breedingInfo: "Proven pair, high fry survival rate",
    featured: true,
  },
  {
    id: "demo-4",
    name: "Purple Mosaic Guppy Pair",
    price: 140,
    description: "Rare purple mosaic pattern guppy pair with intricate patterns on the tail and dorsal fin. A show-quality fish that's sure to be the centerpiece of any aquarium.",
    images: [
      "https://images.unsplash.com/photo-1520302519878-3769235b25e5?w=600&h=400&fit=crop",
    ],
    videoUrl: "",
    category: "rare",
    type: "pair",
    color: "purple",
    stock: 6,
    age: "3-4 months",
    size: "3-4 cm",
    breedingInfo: "Selective bred for pattern consistency",
    featured: true,
  },
  {
    id: "demo-5",
    name: "Dumbo Ear Yellow Guppy Pair",
    price: 150,
    description: "Exquisite dumbo ear guppy pair with bright yellow coloring and oversized pectoral fins that resemble elephant ears. A unique and eye-catching variety.",
    images: [
      "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&h=400&fit=crop",
    ],
    videoUrl: "",
    category: "fancy",
    type: "pair",
    color: "yellow",
    stock: 10,
    age: "3-4 months",
    size: "3.5-4 cm",
    breedingInfo: "Dumbo gene carrier, consistent offspring",
    featured: true,
  },
  {
    id: "demo-6",
    name: "Multicolor Delta Guppy Pair",
    price: 100,
    description: "Vibrant multicolor delta tail guppy pair with a mix of red, blue, and green hues. Great for beginners and experienced hobbyists alike.",
    images: [
      "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600&h=400&fit=crop",
    ],
    videoUrl: "",
    category: "standard",
    type: "pair",
    color: "mixed",
    stock: 20,
    age: "2-3 months",
    size: "2.5-3.5 cm",
    breedingInfo: "Mixed genetics, varied offspring",
    featured: false,
  },
  {
    id: "demo-7",
    name: "Green Cobra Guppy Pair",
    price: 110,
    description: "Healthy green cobra guppy pair, perfect for breeding. Shows good body shape and the distinctive cobra pattern across the body.",
    images: [
      "https://images.unsplash.com/photo-1520302519878-3769235b25e5?w=600&h=400&fit=crop",
    ],
    videoUrl: "",
    category: "standard",
    type: "pair",
    color: "green",
    stock: 15,
    age: "3-4 months",
    size: "4-5 cm",
    breedingInfo: "Cobra gene carrier",
    featured: false,
  },
  {
    id: "demo-8",
    name: "Platinum White Guppy Pair",
    price: 150,
    description: "Stunning platinum white guppy pair with a pristine, snow-white body and fins. Extremely rare and highly sought after by serious collectors.",
    images: [
      "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&h=400&fit=crop",
    ],
    videoUrl: "",
    category: "rare",
    type: "pair",
    color: "mixed",
    stock: 3,
    age: "4-5 months",
    size: "3.5-4 cm",
    breedingInfo: "Platinum gene, limited availability",
    featured: true,
  },
];

/**
 * Check if Firebase is configured
 */
export function isFirebaseConfigured() {
  return !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_API_KEY !== "your_api_key_here"
  );
}
