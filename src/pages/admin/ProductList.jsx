import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/ui/Modal";
import { getProducts, deleteProduct } from "../../services/productService";
import { isFirebaseConfigured, sampleProducts } from "../../data/sampleData";
import { formatPrice } from "../../utils/helpers";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      if (isFirebaseConfigured()) {
        const data = await getProducts();
        setProducts(data);
      } else {
        await new Promise((r) => setTimeout(r, 400));
        setProducts(sampleProducts);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      if (isFirebaseConfigured()) {
        await deleteProduct(deleteId);
      }
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div className="py-6 md:py-10" id="admin-product-list">
      <div className="container-app">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-dark-600">
          <div>
            <h1 className="font-heading font-black text-2xl md:text-3xl text-text-primary tracking-tight">
              Manage <span className="text-neon-green">Inventory</span>
            </h1>
            <p className="text-text-muted text-sm mt-1 font-medium">{products.length} Products in collection</p>
          </div>
          <Link to="/admin/products/new" className="btn-primary py-3 px-6 text-xs uppercase tracking-widest font-black">
            + New Guppy
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or category..."
              className="form-input !rounded-xl border-dark-600 pl-12 shadow-sm"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
          </div>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 skeleton rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-16 text-center shadow-xl border-dark-600/50 uppercase">
            <div className="text-6xl mb-6">🏝️</div>
            <h3 className="font-heading font-black text-xl text-text-primary mb-2">No guppies found</h3>
            <p className="text-text-muted text-sm mb-8 font-medium capitalize">
              {searchQuery ? "Try a different search term" : "Your inventory is currently empty"}
            </p>
            <Link to="/admin/products/new" className="btn-primary py-3 px-8 text-xs uppercase tracking-widest font-black">
              + Add First Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="glass-card p-4 md:p-5 flex items-center gap-5 hover:border-neon-green/30 hover:shadow-lg transition-all group"
                id={`admin-product-${product.id}`}
              >
                {/* Image */}
                <div className="relative group/img flex-shrink-0">
                  <img
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1520302519878-3769235b25e5?w=100&h=100&fit=crop"}
                    alt={product.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border border-dark-600 shadow-sm transition-all duration-500"
                  />
                  {product.featured && (
                    <div className="absolute -top-2 -right-2 bg-aqua text-dark-900 font-black text-[8px] px-2 py-1 rounded shadow-sm z-10 uppercase">
                      Featured
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-neon-green text-[9px] font-black uppercase tracking-[0.1em] mb-1">
                    {product.category?.replace("-", " ")}
                  </p>
                  <h3 className="text-text-primary font-bold text-sm md:text-lg truncate group-hover:text-neon-green transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                    <span className="text-text-primary font-black text-sm">{formatPrice(product.price)}</span>
                    <span className="flex items-center gap-1 text-text-muted text-[11px] font-bold uppercase tracking-wider">
                      <span className={product.stock > 0 ? "text-green-500" : "text-coral"}>●</span>
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 ml-2">
                  <Link
                    to={`/admin/products/edit/${product.id}`}
                    className="p-3 rounded-xl text-text-muted hover:text-white hover:bg-text-primary transition-all border border-dark-600 hover:border-text-primary shadow-sm"
                    title="Edit Product"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="p-3 rounded-xl text-text-muted hover:text-white hover:bg-coral transition-all border border-dark-600 hover:border-coral shadow-sm"
                    title="Delete Product"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        confirmText={deleting ? "Deleting..." : "Delete Permanently"}
        confirmDanger
      >
        <div className="text-center py-4">
          <div className="text-5xl mb-4 text-coral">⚠️</div>
          <p className="text-text-primary font-bold mb-2">Are you absolutely sure?</p>
          <p className="text-text-muted text-sm">This will permanently remove the product from the catalog. This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}
