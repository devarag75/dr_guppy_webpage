import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const PRODUCTS_COLLECTION = "products";
const ORDERS_COLLECTION = "orders";

/**
 * Get all products, optionally with filters
 */
export async function getProducts(filters = {}) {
  try {
    let q = collection(db, PRODUCTS_COLLECTION);
    const constraints = [];

    if (filters.category) {
      constraints.push(where("category", "==", filters.category));
    }
    if (filters.type) {
      constraints.push(where("type", "==", filters.type));
    }
    if (filters.color) {
      constraints.push(where("color", "==", filters.color));
    }
    if (filters.featured) {
      constraints.push(where("featured", "==", true));
    }

    constraints.push(orderBy("createdAt", "desc"));

    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    q = query(q, ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(id) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

/**
 * Get featured products for homepage
 */
export async function getFeaturedProducts(count = 8) {
  return getProducts({ featured: true, limit: count });
}

/**
 * Add a new product (admin)
 */
export async function addProduct(data) {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

/**
 * Update an existing product (admin)
 */
export async function updateProduct(id, data) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

/**
 * Delete a product (admin)
 */
export async function deleteProduct(id) {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

/**
 * Save an order log
 */
export async function saveOrder(orderData) {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id };
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
}

/**
 * Get recent orders (admin)
 */
export async function getRecentOrders(count = 20) {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}
