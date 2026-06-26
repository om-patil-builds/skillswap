import { useState } from "react";
import API from "../services/api";

function EditProfileForm({ user, setEdit, refresh }) {
  const [bio, setBio] = useState(user.bio);
  const [skillsHave, setSkillsHave] = useState(user.skillsHave.join(", "));
  const [skillsWant, setSkillsWant] = useState(user.skillsWant.join(", "));

  const handleSubmit = async () => {
    try {
      await API.put("/users/profile", {
        bio,
        skillsHave: skillsHave.split(",").map(s => s.trim()),
        skillsWant: skillsWant.split(",").map(s => s.trim())
      });

      setEdit(false);
      refresh();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h3>Edit Profile</h3>

      <input
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Bio"
      />

      <input
        value={skillsHave}
        onChange={(e) => setSkillsHave(e.target.value)}
        placeholder="Skills you have (comma separated)"
      />

      <input
        value={skillsWant}
        onChange={(e) => setSkillsWant(e.target.value)}
        placeholder="Skills you want (comma separated)"
      />

      <br />

      <button onClick={handleSubmit}>Save</button>
      <button onClick={() => setEdit(false)}>Cancel</button>
    </div>
  );
}

export default EditProfileForm;