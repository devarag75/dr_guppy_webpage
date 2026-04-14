import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice, sendWhatsAppOrder } from "../utils/helpers";
import { saveOrder } from "../services/productService";
import { isFirebaseConfigured } from "../data/sampleData";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, getSubtotal } = useCart();
  const toast = useToast();

  const subtotal = getSubtotal();

  const handleOrderViaWhatsApp = async () => {
    if (items.length === 0) return;

    // Save order log to Firebase if configured
    try {
      if (isFirebaseConfigured()) {
        await saveOrder({
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          total: subtotal,
          status: "pending",
        });
      }
    } catch {
      // Continue even if log fails
    }

    sendWhatsAppOrder(items, subtotal);
    toast.success("Order sent to WhatsApp! We'll respond shortly 🐟");
  };

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center" id="cart-empty">
        <div className="max-w-md mx-auto">
          <div className="text-7xl mb-6 animate-float">🛒</div>
          <h2 className="font-heading font-bold text-2xl text-text-primary mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-text-muted mb-8">
            Looks like you haven't added any guppies yet. Browse our collection and find your perfect fish!
          </p>
          <Link to="/products" className="btn-primary px-8 py-3.5">
            🐟 Browse Guppies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-10" id="cart-page">
      <div className="container-app">
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary mb-2">
          Shopping Cart
        </h1>
        <p className="text-text-muted text-sm mb-8">
          {items.length} item{items.length !== 1 ? "s" : ""} in your cart
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===== CART ITEMS ===== */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="glass-card p-4 flex gap-4 animate-fade-in"
                id={`cart-item-${item.id}`}
              >
                {/* Image */}
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img
                    src={item.images?.[0] || "https://images.unsplash.com/photo-1520302519878-3769235b25e5?w=200&h=200&fit=crop"}
                    alt={item.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.id}`}
                    className="font-heading font-semibold text-text-primary text-sm md:text-base hover:text-neon-green transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-text-muted text-xs capitalize mt-0.5">
                    {item.category?.replace("-", " ")}
                  </p>
                  <p className="text-neon-green font-bold mt-2">
                    {formatPrice(item.price)}
                  </p>

                  {/* Quantity + Remove */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center glass-light rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-text-secondary hover:text-neon-green transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-text-primary font-medium text-sm min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-text-secondary hover:text-neon-green transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-text-primary font-bold text-sm md:text-base">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => {
                          removeFromCart(item.id);
                          toast.info(`${item.name} removed from cart`);
                        }}
                        className="p-1.5 rounded-lg text-text-muted hover:text-coral hover:bg-coral/10 transition-all"
                        aria-label="Remove item"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={() => {
                clearCart();
                toast.info("Cart cleared");
              }}
              className="text-text-muted text-sm hover:text-coral transition-colors"
            >
              Clear all items
            </button>
          </div>

          {/* ===== ORDER SUMMARY ===== */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24" id="order-summary">
              <h3 className="font-heading font-bold text-lg text-text-primary mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Subtotal ({items.length} items)</span>
                  <span className="text-text-primary font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Shipping</span>
                  <span className="text-neon-green font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t border-dark-600 pt-3">
                  <div className="flex justify-between">
                    <span className="text-text-primary font-semibold">Total</span>
                    <span className="font-heading font-bold text-xl text-neon-green text-glow-green">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order via WhatsApp */}
              <button
                onClick={handleOrderViaWhatsApp}
                className="btn-whatsapp w-full py-4 text-base"
                id="order-whatsapp-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order via WhatsApp
              </button>

              <p className="text-text-muted text-xs text-center mt-3">
                Your order will be sent to our WhatsApp. We'll confirm availability and share payment details.
              </p>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="block text-center text-neon-green text-sm font-medium mt-4 hover:underline"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
