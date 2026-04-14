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
      className="glass-card flex flex-col h-full overflow-hidden group bg-white border border-dark-600 hover:border-dark-400 hover:-translate-y-0.5 transition-transform"
      id={`product-card-${product.id}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] shrink-0 bg-dark-900 flex items-center justify-center">
        <img
          src={thumbnail}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:text-coral transition-colors z-10 text-dark-400 border border-dark-600"
          aria-label="Toggle wishlist"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#ef4444" : "none"}
            stroke={wishlisted ? "#ef4444" : "currentColor"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Category Badge */}
        {product.featured && (
          <div className="absolute top-3 left-3 bg-[#fb641b] text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm uppercase tracking-wider">
            Featured
          </div>
        )}

        {/* Stock Badge */}
        {!stockStatus.available && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
            <span className="bg-[#ef4444] text-white font-bold text-sm px-4 py-2 rounded shadow-md uppercase tracking-wide">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-text-muted text-[11px] font-bold uppercase tracking-wide mb-1.5">
          {product.category?.replace("-", " ")}
        </p>
        <h3 className="font-heading font-medium text-text-primary text-sm md:text-[15px] leading-snug mb-3 line-clamp-2 md:min-h-[42px] group-hover:text-neon-green transition-colors">
          {product.name}
        </h3>
        
        {/* Footer actions pinned to bottom */}
        <div className="mt-auto pt-2 border-t border-dark-600 border-dashed pb-2">
          <div className="mb-3">
            <span className="font-heading font-bold text-text-primary text-xl">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!stockStatus.available}
            className={`w-full py-2.5 rounded text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              inCart
                ? "bg-neon-green/10 text-neon-green border border-neon-green/30"
                : stockStatus.available
                ? "bg-[#ff9f00] hover:bg-[#fb641b] text-white shadow-sm hover:shadow"
                : "bg-dark-600 text-text-muted cursor-not-allowed"
            }`}
          >
            {inCart ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Added to Cart
              </>
            ) : stockStatus.available ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Add to Cart
              </>
            ) : (
              "Sold Out"
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
