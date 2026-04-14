/**
 * Generate WhatsApp order message and open WhatsApp
 */
export function sendWhatsAppOrder(items, subtotal) {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210";

  let message = "🐟 *New Order from DR GUPPY FARM*\n\n";
  message += "Hello! I would like to order the following guppies:\n\n";

  items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}* × ${item.quantity} — ₹${(item.price * item.quantity).toLocaleString("en-IN")}\n`;
  });

  message += `\n💰 *Total: ₹${subtotal.toLocaleString("en-IN")}*\n`;
  message += "\nPlease confirm availability and delivery details. Thank you! 🙏";

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, "_blank");
}

/**
 * Generate WhatsApp enquiry for a single product
 */
export function sendWhatsAppEnquiry(product) {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210";

  let message = `🐟 *Enquiry about: ${product.name}*\n\n`;
  message += `Price: ₹${product.price.toLocaleString("en-IN")}\n`;
  message += `Category: ${product.category}\n\n`;
  message += "Hi! I'm interested in this guppy. Is it available? Please share more details. 🙏";

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, "_blank");
}

/**
 * Format price in INR
 */
export function formatPrice(price) {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

/**
 * Truncate text
 */
export function truncateText(text, maxLength = 60) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Get stock status label and color
 */
export function getStockStatus(stock) {
  if (stock <= 0) return { label: "Out of Stock", color: "text-coral", available: false };
  if (stock <= 5) return { label: `Only ${stock} left!`, color: "text-gold", available: true };
  return { label: "In Stock", color: "text-neon-green", available: true };
}

/**
 * Manage recently viewed products in localStorage
 */
const RECENTLY_VIEWED_KEY = "dr_guppy_recently_viewed";
const MAX_RECENTLY_VIEWED = 8;

export function addToRecentlyViewed(product) {
  try {
    const items = getRecentlyViewed();
    const filtered = items.filter((item) => item.id !== product.id);
    filtered.unshift({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      category: product.category,
    });
    localStorage.setItem(
      RECENTLY_VIEWED_KEY,
      JSON.stringify(filtered.slice(0, MAX_RECENTLY_VIEWED))
    );
  } catch {
    // Ignore localStorage errors
  }
}

export function getRecentlyViewed() {
  try {
    const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}
