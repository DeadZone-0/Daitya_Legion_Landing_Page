import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlayerCard from "../components/PlayerCard.jsx";

const AdminDashboard = () => {
  const [players, setPlayers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "Batsman",
    matches: 0,
    runs: 0,
    wickets: 0,
    external_id: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch from backend, mocked for now if backend is down
    const fetchPlayers = async () => {
      try {
        const res = await fetch("/api/players");
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        setPlayers([
          {
            _id: "1",
            name: "Sagar Core",
            role: "Batsman",
            matches: 42,
            runs: 1250,
            wickets: 2,
            image_url: "https://randomuser.me/api/portraits/men/44.jpg",
            is_manual_override: false,
          },
        ]);
      }
    };
    fetchPlayers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    // Convert to FormData for Multer/Cloudinary
    const payload = new FormData();
    Object.keys(formData).forEach((key) => payload.append(key, formData[key]));
    if (imageFile) payload.append("image", imageFile);

    try {
      const res = await fetch('/api/players', {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });
      if (res.ok) {
        const newPlayer = await res.json();
        setPlayers([newPlayer, ...players]);
      } else {
        alert("Failed to add player via backend API");
      }
    } catch (err) {
      alert("Backend unavailable: Admin operation ran in Mock mode.");
      setPlayers([
        {
          ...formData,
          _id: Date.now(),
          image_url: previewUrl,
          is_manual_override: true,
        },
        ...players,
      ]);
    }
  };

  const previewPlayer = {
    ...formData,
    image_url: previewUrl || "https://via.placeholder.com/150",
    is_manual_override: true,
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ color: "var(--accent)" }}>Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="btn"
          style={{ background: "var(--danger)" }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div
          className="glass-panel"
          style={{ flex: "1", minWidth: "350px", padding: "2rem" }}
        >
          <h3 style={{ marginBottom: "1rem", color: "var(--text-main)" }}>
            Add / Edit Player
          </h3>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Name"
              className="input-field"
              onChange={handleChange}
              required
            />
            <input
              name="external_id"
              placeholder="CricHeroes ID (Optional)"
              className="input-field"
              onChange={handleChange}
            />

            <select name="role" className="input-field" onChange={handleChange}>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-Rounder">All-Rounder</option>
              <option value="Wicketkeeper">Wicketkeeper</option>
            </select>

            <div style={{ display: "flex", gap: "1rem" }}>
              <input
                name="matches"
                type="number"
                placeholder="Matches"
                className="input-field"
                onChange={handleChange}
                required
              />
              <input
                name="runs"
                type="number"
                placeholder="Runs"
                className="input-field"
                onChange={handleChange}
                required
              />
              <input
                name="wickets"
                type="number"
                placeholder="Wickets"
                className="input-field"
                onChange={handleChange}
                required
              />
            </div>

            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-muted)",
              }}
            >
              Player Image (Cloudinary)
            </label>
            <input
              type="file"
              accept="image/*"
              className="input-field"
              onChange={handleImageChange}
            />

            <button
              type="submit"
              className="btn"
              style={{ width: "100%", marginTop: "1rem" }}
            >
              Save Player
            </button>
          </form>
        </div>

        <div
          style={{
            flex: "1",
            minWidth: "350px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3 style={{ marginBottom: "1rem", color: "var(--text-main)" }}>
            Card Preview
          </h3>
          <PlayerCard player={previewPlayer} />
        </div>
      </div>

      <h3 style={{ marginTop: "3rem", marginBottom: "1rem" }}>
        Current Roster
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {players.map((p) => (
          <div
            key={p._id || p.name}
            className="glass-panel"
            style={{
              padding: "1rem",
              width: "250px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{p.name}</strong>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {p.role}
              </div>
            </div>
            <button
              className="btn"
              style={{
                padding: "0.3rem 0.6rem",
                background: "var(--danger)",
                fontSize: "0.8rem",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
