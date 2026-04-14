import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { ProductDetailSkeleton } from "../components/ui/Skeleton";
import ProductCard from "../components/product/ProductCard";
import { sampleProducts, isFirebaseConfigured } from "../data/sampleData";
import { getProductById, getProducts } from "../services/productService";
import {
  formatPrice,
  getStockStatus,
  sendWhatsAppEnquiry,
  addToRecentlyViewed,
  getRecentlyViewed,
} from "../utils/helpers";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToCart, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const toast = useToast();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setSelectedImage(0);
      setQuantity(1);
      try {
        let prod;
        if (isFirebaseConfigured()) {
          prod = await getProductById(id);
        } else {
          await new Promise((r) => setTimeout(r, 500));
          prod = sampleProducts.find((p) => p.id === id);
        }
        setProduct(prod);
        if (prod) {
          addToRecentlyViewed(prod);
          // Fetch related
          const allProducts = isFirebaseConfigured()
            ? await getProducts({ category: prod.category, limit: 5 })
            : sampleProducts.filter((p) => p.category === prod.category && p.id !== prod.id);
          setRelatedProducts(allProducts.filter((p) => p.id !== prod.id).slice(0, 4));
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
    setRecentlyViewed(getRecentlyViewed().filter((p) => p.id !== id));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="container-app py-20 text-center">
        <div className="text-6xl mb-4">🐟</div>
        <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">Product Not Found</h2>
        <p className="text-text-muted mb-6">This guppy might have swum away!</p>
        <Link to="/products" className="btn-primary">Browse All Guppies</Link>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const inCart = isInCart(product.id);
  const wishlisted = isInWishlist(product.id);
  const images = product.images?.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1520302519878-3769235b25e5?w=800&h=600&fit=crop"];

  const handleAddToCart = () => {
    if (!stockStatus.available) return;
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const details = [
    { label: "Age", value: product.age },
    { label: "Size", value: product.size },
    { label: "Type", value: product.type },
    { label: "Color", value: product.color },
    { label: "Category", value: product.category?.replace("-", " ") },
    { label: "Breeding Info", value: product.breedingInfo },
  ].filter((d) => d.value);

  return (
    <div className="py-6 md:py-10" id="product-detail-page">
      <div className="container-app">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link to="/" className="hover:text-neon-green transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-neon-green transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-text-secondary truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ===== IMAGE GALLERY ===== */}
          <div className="space-y-4 animate-fade-in">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden glass-card">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.featured && (
                <div className="absolute top-4 left-4 badge badge-aqua px-3 py-1">⭐ Featured</div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i
                        ? "border-neon-green shadow-lg shadow-neon-green-glow/20"
                        : "border-dark-600 hover:border-dark-400"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Video */}
            {product.videoUrl && (
              <div className="glass-card rounded-2xl overflow-hidden">
                <video
                  src={product.videoUrl}
                  controls
                  className="w-full aspect-video"
                  preload="metadata"
                >
                  Your browser does not support video.
                </video>
              </div>
            )}
          </div>

          {/* ===== PRODUCT INFO ===== */}
          <div className="animate-fade-in-up">
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary mb-2">
              {product.name}
            </h1>
            <p className="text-text-muted text-sm capitalize mb-4">
              {product.category?.replace("-", " ")} • {product.type}
            </p>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-heading font-black text-3xl md:text-4xl text-neon-green text-glow-green">
                {formatPrice(product.price)}
              </span>
              <span className={`text-sm font-medium ${stockStatus.color}`}>
                {stockStatus.label}
              </span>
            </div>

            {/* Description */}
            <p className="text-text-secondary leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Details Table */}
            <div className="glass-card p-4 mb-8">
              <h3 className="font-heading font-semibold text-text-primary text-sm mb-3">Fish Details</h3>
              <div className="grid grid-cols-2 gap-3">
                {details.map((d) => (
                  <div key={d.label}>
                    <span className="text-text-muted text-xs">{d.label}</span>
                    <p className="text-text-primary text-sm font-medium capitalize">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity + Actions */}
            <div className="space-y-4">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-text-secondary text-sm font-medium">Quantity:</span>
                <div className="flex items-center glass-card rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-text-secondary hover:text-neon-green hover:bg-dark-600/50 transition-all"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-semibold text-text-primary min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                    className="px-4 py-2 text-text-secondary hover:text-neon-green hover:bg-dark-600/50 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!stockStatus.available}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-base transition-all ${
                    !stockStatus.available
                      ? "bg-dark-600 text-text-muted cursor-not-allowed"
                      : inCart
                      ? "bg-neon-green/20 text-neon-green border-2 border-neon-green/30"
                      : "btn-primary"
                  }`}
                  id="add-to-cart-btn"
                >
                  {!stockStatus.available ? "Out of Stock" : inCart ? "✓ Added to Cart" : "🛒 Add to Cart"}
                </button>

                <button
                  onClick={() => sendWhatsAppEnquiry(product)}
                  className="btn-whatsapp flex-1 py-3.5"
                  id="whatsapp-enquiry-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Ask on WhatsApp
                </button>
              </div>

              {/* Wishlist */}
              <button
                onClick={() => {
                  toggleWishlist(product);
                  toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!");
                }}
                className="w-full py-3 glass-card text-sm font-medium text-text-secondary hover:text-coral hover:border-coral/30 transition-all flex items-center justify-center gap-2"
                id="wishlist-toggle-btn"
              >
                <svg
                  width="16" height="16"
                  viewBox="0 0 24 24"
                  fill={wishlisted ? "#ff6b6b" : "none"}
                  stroke={wishlisted ? "#ff6b6b" : "currentColor"}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>

        {/* ===== RELATED PRODUCTS ===== */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading font-bold text-xl md:text-2xl text-text-primary mb-6">
              Similar Guppies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* ===== RECENTLY VIEWED ===== */}
        {recentlyViewed.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading font-bold text-xl md:text-2xl text-text-primary mb-6">
              Recently Viewed
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
              {recentlyViewed.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="glass-card overflow-hidden flex-shrink-0 w-40 group"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={p.images?.[0] || "https://images.unsplash.com/photo-1520302519878-3769235b25e5?w=200&h=200&fit=crop"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-text-primary text-xs font-medium truncate">{p.name}</p>
                    <p className="text-neon-green text-sm font-bold mt-1">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
