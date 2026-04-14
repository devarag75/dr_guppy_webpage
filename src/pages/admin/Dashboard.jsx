import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { logoutAdmin } from "../../services/authService";
import { getProducts, getRecentOrders } from "../../services/productService";
import { isFirebaseConfigured, sampleProducts } from "../../data/sampleData";
import { DashboardSkeleton } from "../../components/ui/Skeleton";
import { formatPrice } from "../../utils/helpers";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        if (isFirebaseConfigured()) {
          const products = await getProducts();
          const orders = await getRecentOrders(10);
          setStats({ products: products.length, orders: orders.length });
          setRecentOrders(orders);
        } else {
          await new Promise((r) => setTimeout(r, 500));
          setStats({ products: sampleProducts.length, orders: 3 });
          setRecentOrders([
            { id: "o1", total: 450, status: "pending", createdAt: { toDate: () => new Date() }, items: [{ name: "Red Dragon Guppy", quantity: 2 }] },
            { id: "o2", total: 300, status: "confirmed", createdAt: { toDate: () => new Date(Date.now() - 86400000) }, items: [{ name: "Blue Moscow Guppy", quantity: 1 }] },
            { id: "o3", total: 500, status: "delivered", createdAt: { toDate: () => new Date(Date.now() - 172800000) }, items: [{ name: "Albino Full Red Pair", quantity: 1 }] },
          ]);
        }
      } catch {
        setStats({ products: 0, orders: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "text-gold bg-gold/10 border-gold/30";
      case "confirmed": return "text-aqua bg-aqua/10 border-aqua/30";
      case "delivered": return "text-neon-green bg-neon-green/10 border-neon-green/30";
      case "cancelled": return "text-coral bg-coral/10 border-coral/30";
      default: return "text-text-muted bg-dark-600 border-dark-500";
    }
  };

  if (loading) return <div className="container-app py-8"><DashboardSkeleton /></div>;

  return (
    <div className="py-6 md:py-10" id="admin-dashboard">
      <div className="container-app">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">
              Admin Dashboard
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Welcome, {currentUser?.email || "Admin"} 👋
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/products/new" className="btn-primary py-2.5 px-5 text-sm">
              + Add Product
            </Link>
            <button onClick={handleLogout} className="btn-ghost py-2.5 px-5 text-sm">
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-6 group hover:border-neon-green/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Products</p>
                <p className="font-heading font-bold text-3xl text-text-primary mt-1">{stats.products}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center text-2xl">
                🐟
              </div>
            </div>
          </div>

          <div className="glass-card p-6 group hover:border-aqua/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Orders</p>
                <p className="font-heading font-bold text-3xl text-text-primary mt-1">{stats.orders}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-aqua/10 flex items-center justify-center text-2xl">
                📦
              </div>
            </div>
          </div>

          <div className="glass-card p-6 group hover:border-gold/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Categories</p>
                <p className="font-heading font-bold text-3xl text-text-primary mt-1">4</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-2xl">
                📂
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <Link to="/admin/products/new" className="glass-card p-4 text-center hover:border-neon-green/30 transition-all group">
            <div className="text-2xl mb-2">➕</div>
            <p className="text-text-secondary text-sm font-medium group-hover:text-neon-green">Add Product</p>
          </Link>
          <Link to="/admin/products" className="glass-card p-4 text-center hover:border-aqua/30 transition-all group">
            <div className="text-2xl mb-2">📋</div>
            <p className="text-text-secondary text-sm font-medium group-hover:text-aqua">All Products</p>
          </Link>
          <Link to="/products" className="glass-card p-4 text-center hover:border-gold/30 transition-all group">
            <div className="text-2xl mb-2">🏪</div>
            <p className="text-text-secondary text-sm font-medium group-hover:text-gold">View Store</p>
          </Link>
          <Link to="/" className="glass-card p-4 text-center hover:border-purple/30 transition-all group">
            <div className="text-2xl mb-2">🏠</div>
            <p className="text-text-secondary text-sm font-medium group-hover:text-purple">Home Page</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="glass-card p-6">
          <h2 className="font-heading font-bold text-lg text-text-primary mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-text-muted text-sm">No orders yet. Orders placed via WhatsApp will appear here.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-dark-700/50 border border-dark-600"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-sm font-medium truncate">
                      {order.items?.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                    </p>
                    <p className="text-text-muted text-xs mt-0.5">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString("en-IN") : "Recently"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-neon-green font-bold text-sm">{formatPrice(order.total)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
