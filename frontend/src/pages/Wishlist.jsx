// pages/Wishlist.jsx
import { useEffect, useState } from "react";
import { getWishlist, updateWishlistStatus, removeFromWishlist } from "../api/wishlistApi";
import WishlistCard from "../components/wishlist/wishlistCard";
import AddToWishlistForm from "../components/wishlist/AddToWishlistForm";
import ConvertToApplicationForm from "../components/wishlist/ConvertToApplicationForm";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [showForm, setShowForm]=useState(false);
  const [convertingItem, setConvertingItem]=useState(null);

  function handleAdded(newItem){
    setItems((prev)=>[newItem, ...prev]);
  }
  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await getWishlist();
      if (res.success) {
        setItems(res.wishlist ?? []);
      } else {
        setError(res.message || "Failed to load wishlist");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }

  function handleAdded(newItem) {
    setItems((prev) => [newItem, ...prev]);
  }

  async function handleMoveToApplications(item) {
    setConvertingItem(item);
  }

   function handleConverted(wishlistItemId) {
    setItems((prev) => prev.filter((item) => item._id !== wishlistItemId));
  }

  async function handleRemove(id) {
    if (!window.confirm("Remove this company from your wishlist?")) return;
    try {
      setActionId(id);
      const res = await removeFromWishlist(id);
      if (res.success) {
        setItems((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to remove item");
    } finally {
      setActionId(null);
    }
  }

  if (loading) return <p className="text-muted">Loading...</p>;
  if (error) return <p className="text-coral">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Wishlist</h1>
          <p className="text-muted text-sm mt-1">Companies you want to apply to</p>
        </div>
        <button onClick={
          ()=>setShowForm(true)
        } className="bg-gold hover:opacity-90 text-gold-ink font-semibold text-sm px-4 py-2.5 rounded-lg transition">
          + Add Company
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted text-sm">Your wishlist is empty. Add companies you're interested in.</p>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {items.map((item) => (
            <WishlistCard
              key={item._id}
              item={item}
              onMoveToApplications={handleMoveToApplications}
              onRemove={handleRemove}
              loading={actionId === item._id}
            />
          ))}
        </div>
      )}

      {showForm && (
        <AddToWishlistForm onClose={() => setShowForm(false)} onAdded={handleAdded} />
      )}

      {convertingItem && (
        <ConvertToApplicationForm
          wishlistItem={convertingItem}
          onClose={() => setConvertingItem(null)}
          onConverted={handleConverted}
        />
      )}
    </div>
  );
}