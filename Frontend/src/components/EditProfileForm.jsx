import { useState } from "react";
import API from "../services/api";
import { Save, X, BookOpen, GraduationCap, FileText } from "lucide-react";

function EditProfileForm({ user, setEdit, refresh }) {
  const [bio, setBio] = useState(user.bio || "");
  const [skillsHave, setSkillsHave] = useState(user.skillsHave ? user.skillsHave.join(", ") : "");
  const [skillsWant, setSkillsWant] = useState(user.skillsWant ? user.skillsWant.join(", ") : "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put("/users/profile", {
        bio,
        skillsHave: skillsHave.split(",").map(s => s.trim()).filter(Boolean),
        skillsWant: skillsWant.split(",").map(s => s.trim()).filter(Boolean)
      });

      setEdit(false);
      refresh();
    } catch (err) {
      console.log(err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-card-modern glass-card edit-profile-card">
        <h3 className="edit-profile-title">Edit Profile Details</h3>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="premium-input-group">
            <span className="input-group-label">
              <FileText size={16} />
              <span>Bio</span>
            </span>
            <textarea
              className="premium-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other members about your experience, interests, and what you are building..."
              rows={4}
              maxLength={200}
            />
            <span className="char-count">{bio.length}/200</span>
          </div>

          <div className="premium-input-group">
            <span className="input-group-label">
              <BookOpen size={16} />
              <span>Skills You Have</span>
            </span>
            <input
              className="premium-input"
              value={skillsHave}
              onChange={(e) => setSkillsHave(e.target.value)}
              placeholder="React, Node.js, Python, CSS (comma separated)"
            />
            <span className="input-hint">Separate skills with commas</span>
          </div>

          <div className="premium-input-group">
            <span className="input-group-label">
              <GraduationCap size={16} />
              <span>Skills You Want to Learn</span>
            </span>
            <input
              className="premium-input"
              value={skillsWant}
              onChange={(e) => setSkillsWant(e.target.value)}
              placeholder="TypeScript, Docker, AWS, UI Design (comma separated)"
            />
            <span className="input-hint">Separate skills with commas</span>
          </div>

          <div className="edit-profile-actions">
            <button
              type="button"
              className="premium-btn premium-btn-secondary"
              onClick={() => setEdit(false)}
              disabled={loading}
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            
            <button
              type="submit"
              className="premium-btn premium-btn-primary"
              disabled={loading}
            >
              <Save size={16} />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileForm;