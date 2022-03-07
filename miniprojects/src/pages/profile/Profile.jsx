import { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";

import { useAuthContext } from "../../hooks/useAuthContext";
import "./Profile.css";

export default function Profile() {
  const { user, updateUserProfile } = useAuthContext();
  const [userData, setUserData] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [kudos, setKudos] = useState([]);

  useEffect(() => {
    setUserData({
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        const kudos = await projectFirestore
          .collection("users")
          .doc(user.uid)
          .collection("kudos")
          .get();
        setKudos(kudos.docs.map((kudo) => kudo.data()));
        //console.log('ku==>>', );
        // setKudos(kudos)
      } catch (err) {
        console.log("err getting kudos", err);
      }
    })();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile({ displayName: userData.displayName, thumbnail });
      alert("User updated!");
    } catch (err) {
      console.log("err updating profile==>>", err);
    }
  };

  const handleFileChange = (e) => {
    let selected = e.target.files[0];
    if (selected) {
      const reader = new FileReader();
      reader.onload = () =>
        setUserData((prevState) => ({ ...prevState, photoURL: reader.result }));
      reader.readAsDataURL(selected);

      setThumbnail(null);
      if (!selected) {
        setThumbnailError("Please select a file");
        return;
      }

      if (!selected.type.includes("image")) {
        setThumbnailError("Selected file must be an image");
        return;
      }

      if (selected.size > 100000) {
        setThumbnailError("image file size must be less than 100kb");
        return;
      }

      setThumbnailError(null);
      setThumbnail(selected);
    }
  };

  return (
    <div className="profile-details">
      {userData && (
        <form onSubmit={handleProfileUpdate}>
          Usernmae:{" "}
          <input
            name="displayName"
            value={userData.displayName}
            onChange={handleInputChange}
          />{" "}
          <br />
          <img src={userData.photoURL} width={100} height={100} />
          <label>
            <span>profile thumbnail:</span>
            <input type="file" onChange={handleFileChange} />
            {thumbnailError && <div className="error">{thumbnailError}</div>}
          </label>
          <br />
          <button>Update Profile</button>
        </form>
      )}
      {kudos.length ? <h1>My Kudos</h1> : ''}
      {kudos.map((kudo, index) => (
        <p key={index}>{kudo.message}</p>
      ))}
    </div>
  );
}
