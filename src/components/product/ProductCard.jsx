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
  const thumbnail = product.images?.[0] || "https://images.unsplash.com/photo-1520302519878-3769235b25e5?w=600&h=400&fit=crop";
  const fallbackImage = "https://images.unsplash.com/photo-1520302519878-3769235b25e5?w=600&h=400&fit=crop";

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
      className="flex flex-col h-full bg-white border border-dark-600 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
      id={`product-card-${product.id}`}
    >
      {/* Image Container */}
      <div className="relative h-48 shrink-0 overflow-hidden bg-gray-100">
        <img
          src={thumbnail}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:text-coral transition-all z-10 text-dark-400 border border-gray-100"
          aria-label="Toggle wishlist"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#ef4444" : "none"}
            stroke={wishlisted ? "#ef4444" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Stock Badge */}
        {!stockStatus.available && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-coral text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">Sold Out</span>
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">
          {product.category?.replace("-", " ")}
        </p>
        <h3 className="font-heading font-semibold text-text-primary text-sm md:text-base leading-snug mb-2 line-clamp-2 transition-colors">
          {product.name}
        </h3>
        
        {/* Price and Action align to bottom */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-text-primary text-lg">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!stockStatus.available}
            className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              inCart
                ? "bg-green-50 text-green-600 border border-green-100"
                : stockStatus.available
                ? "bg-[#ff9f00] hover:bg-[#fb641b] text-white shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {inCart ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Added
              </>
            ) : stockStatus.available ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Add to Cart
              </>
            ) : (
              "Out of Stock"
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
