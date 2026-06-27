import { useEffect, useState } from "react";
import API from "../services/api";
import ProfileCard from "../components/ProfileCard";
import EditProfileForm from "../components/EditProfileForm";
import "./profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile-page">
      <h2 className="page-header">My Profile 👤</h2>

      {edit ? (
        <EditProfileForm user={user} setEdit={setEdit} />
      ) : (
        <ProfileCard user={user} setEdit={setEdit} />
      )}
    </div>
  );
}

export default Profile;
