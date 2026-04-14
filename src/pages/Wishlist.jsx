import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/helpers";

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const toast = useToast();

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center" id="wishlist-empty">
        <div className="max-w-md mx-auto">
          <div className="text-7xl mb-6 animate-float">💖</div>
          <h2 className="font-heading font-bold text-2xl text-text-primary mb-3">
            Your Wishlist is Empty
          </h2>
          <p className="text-text-muted mb-8">
            Save your favorite guppies here and come back later!
          </p>
          <Link to="/products" className="btn-primary px-8 py-3.5">
            🐟 Browse Guppies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-10" id="wishlist-page">
      <div className="container-app">
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary mb-2">
          My Wishlist
        </h1>
        <p className="text-text-muted text-sm mb-8">
          {items.length} item{items.length !== 1 ? "s" : ""} saved
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => {
            const inCart = isInCart(item.id);
            return (
              <div
                key={item.id}
                className="glass-card overflow-hidden group"
                id={`wishlist-item-${item.id}`}
              >
                <Link to={`/product/${item.id}`}>
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={item.images?.[0] || "https://images.unsplash.com/photo-1520302519878-3769235b25e5?w=400&h=300&fit=crop"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-heading font-semibold text-text-primary text-sm mb-1 group-hover:text-neon-green transition-colors truncate">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-neon-green font-bold mb-3">{formatPrice(item.price)}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!inCart) {
                          addToCart(item);
                          toast.success(`${item.name} added to cart!`);
                        }
                      }}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                        inCart
                          ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
                          : "bg-neon-green text-dark-900 hover:shadow-lg hover:shadow-neon-green-glow/30"
                      }`}
                    >
                      {inCart ? "✓ In Cart" : "Add to Cart"}
                    </button>
                    <button
                      onClick={() => {
                        removeFromWishlist(item.id);
                        toast.info("Removed from wishlist");
                      }}
                      className="p-2 rounded-lg text-text-muted hover:text-coral hover:bg-coral/10 transition-all border border-dark-500"
                      aria-label="Remove"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
