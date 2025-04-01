import { useState } from "react";
import "./register.css";

const Register = () => {
  const [profilePhoto, setProfilePhoto] = useState("/assets/default-profile.png");
  const [backgroundPhoto, setBackgroundPhoto] = useState("/assets/default-background.jpg");

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const changeBackground = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="register-container" style={{ background: `url(${backgroundPhoto}) no-repeat center center/cover` }}>
      <div className="register-box">
        <h2>Register</h2>
        <label htmlFor="profilePhoto" className="profile-photo-container">
          <img src={profilePhoto} alt="Profile" className="profile-photo" />
          <input type="file" id="profilePhoto" accept="image/*" onChange={handlePhotoChange} hidden />
        </label>
        <input type="text" placeholder="Username" className="register-input" />
        <input type="email" placeholder="College Email" className="register-input" />
        <input type="tel" placeholder="Contact" className="register-input" />
        <input type="password" placeholder="Password" className="register-input" />
        <input type="password" placeholder="Confirm Password" className="register-input" />
        <label htmlFor="backgroundPhoto" className="register-button">Change Background</label>
        <input type="file" id="backgroundPhoto" accept="image/*" onChange={changeBackground} hidden />
        <button className="register-button">Sign Up</button>
      </div>
    </div>
  );
};

export default Register;
