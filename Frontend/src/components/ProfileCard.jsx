import "./ProfileCard.css";

function ProfileCard({ user, setEdit }) {
  return (
    <div className="profile-container">
      <div className="profile-card">

        <h2>{user.username}</h2>
        <p>{user.bio}</p>

        <div className="skills">
          <h4>Skills I Have</h4>
          {user.skillsHave.map((skill, i) => (
            <span key={i} className="skill-badge">
              {skill}
            </span>
          ))}
        </div>

        <div className="skills">
          <h4>Skills I Want</h4>
          {user.skillsWant.map((skill, i) => (
            <span key={i} className="skill-badge">
              {skill}
            </span>
          ))}
        </div>

        <button className="edit-btn" onClick={() => setEdit(true)}>
          Edit Profile
        </button>

      </div>
    </div>
  );
}

export default ProfileCard;