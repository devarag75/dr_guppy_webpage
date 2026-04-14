import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice, truncateText, getStockStatus } from "../../utils/helpers";

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const toast = useToast();
  
  const inCart = isInCart(product.id);
  const wishlisted = isInWishlist(product.id);
  const stockStatus = getStockStatus(product.stock);
  const thumbnail = product.images?.[0] || "https://images.unsplash.com/photo-1520302519878-3769235b25e5?w=400&h=300&fit=crop";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!stockStatus.available) return;
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="glass-card overflow-hidden group block"
      id={`product-card-${product.id}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={thumbnail}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-dark-900/50 backdrop-blur-sm border border-white/10 hover:border-coral/50 transition-all z-10"
          aria-label="Toggle wishlist"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#ff6b6b" : "none"}
            stroke={wishlisted ? "#ff6b6b" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-secondary"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Category Badge */}
        {product.featured && (
          <div className="absolute top-3 left-3 badge badge-aqua text-xs px-2 py-1">
            ⭐ Featured
          </div>
        )}

        {/* Stock Badge */}
        {!stockStatus.available && (
          <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center">
            <span className="badge badge-red text-sm px-3 py-1.5">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-heading font-semibold text-text-primary text-sm md:text-base mb-1 group-hover:text-neon-green transition-colors">
          {truncateText(product.name, 30)}
        </h3>
        <p className="text-text-muted text-xs mb-3 capitalize">
          {product.category?.replace("-", " ")} • {product.type}
        </p>
        
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading font-bold text-neon-green text-lg">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!stockStatus.available}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inCart
                ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
                : stockStatus.available
                ? "bg-neon-green text-dark-900 hover:shadow-lg hover:shadow-neon-green-glow/30"
                : "bg-dark-600 text-text-muted cursor-not-allowed"
            }`}
          >
            {inCart ? "✓ In Cart" : stockStatus.available ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>
    </Link>
  );
}
