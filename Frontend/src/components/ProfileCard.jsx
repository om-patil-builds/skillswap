import { Edit, BookOpen, GraduationCap } from "lucide-react";
import "./ProfileCard.css";

function ProfileCard({ user, setEdit }) {
  return (
    <div className="profile-page-container">
      <div className="profile-card-modern glass-card">
        <div className="profile-avatar-modern">
          {user.username.charAt(0).toUpperCase()}
        </div>

        <h2 className="profile-username">{user.username}</h2>
        <p className="profile-bio">{user.bio || "No bio added yet. Tell us about yourself!"}</p>

        <div className="profile-skills-section">
          <div className="skills-group">
            <h4 className="skills-group-title">
              <BookOpen size={16} className="skills-icon-have" />
              <span>Skills I Have</span>
            </h4>
            <div className="skills-list">
              {user.skillsHave && user.skillsHave.length > 0 ? (
                user.skillsHave.map((skill, i) => (
                  <span key={i} className="skill-badge have">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="no-skills-text">None listed</span>
              )}
            </div>
          </div>

          <div className="skills-group">
            <h4 className="skills-group-title">
              <GraduationCap size={16} className="skills-icon-want" />
              <span>Skills I Want to Learn</span>
            </h4>
            <div className="skills-list">
              {user.skillsWant && user.skillsWant.length > 0 ? (
                user.skillsWant.map((skill, i) => (
                  <span key={i} className="skill-badge want">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="no-skills-text">None listed</span>
              )}
            </div>
          </div>
        </div>

        <button className="premium-btn premium-btn-primary edit-profile-btn" onClick={() => setEdit(true)}>
          <Edit size={16} />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;