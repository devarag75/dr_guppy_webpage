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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">
              All Products
            </h1>
            <p className="text-text-muted text-sm mt-1">{products.length} products total</p>
          </div>
          <Link to="/admin/products/new" className="btn-primary py-2.5 px-5 text-sm">
            + Add Product
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="form-input max-w-md"
          />
        </div>

        {/* Products List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 skeleton rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="font-heading font-semibold text-text-primary mb-2">No products found</h3>
            <p className="text-text-muted text-sm mb-6">
              {searchQuery ? "Try a different search term" : "Start by adding your first product"}
            </p>
            <Link to="/admin/products/new" className="btn-primary">
              + Add Product
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="glass-card p-4 flex items-center gap-4 hover:border-dark-400 transition-all"
                id={`admin-product-${product.id}`}
              >
                {/* Image */}
                <img
                  src={product.images?.[0] || "https://images.unsplash.com/photo-1520302519878-3769235b25e5?w=100&h=100&fit=crop"}
                  alt={product.name}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-text-primary font-semibold text-sm md:text-base truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-neon-green font-bold text-sm">{formatPrice(product.price)}</span>
                    <span className="text-text-muted text-xs capitalize">{product.category?.replace("-", " ")}</span>
                    <span className="text-text-muted text-xs">Stock: {product.stock}</span>
                    {product.featured && <span className="badge badge-aqua text-[10px]">Featured</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/admin/products/edit/${product.id}`}
                    className="p-2.5 rounded-lg text-text-muted hover:text-aqua hover:bg-aqua/10 transition-all"
                    title="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="p-2.5 rounded-lg text-text-muted hover:text-coral hover:bg-coral/10 transition-all"
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        confirmText={deleting ? "Deleting..." : "Delete"}
        confirmDanger
      >
        Are you sure you want to delete this product? This action cannot be undone.
      </Modal>
    </div>
  );
}
