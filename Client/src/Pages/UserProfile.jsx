import React, { useEffect } from 'react'
import axios from 'axios'
import { useState, useContext } from 'react'
import { UserContext } from '../Context/userContext'

export default function UserProfile() {

  const { user, setUser } = useContext(UserContext)
  const [selectedFile, setSelectedFile] = useState(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(user.avatarUrl || '');

  useEffect(() =>{
    if(user.image){
      setCurrentImageUrl(user.avatarUrl);
    }
  }, user)

  const handleInputChange = (e) =>{

    const {name, value} = e.target;

    setUser({...user, [name]: value})

   };


   const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);

    if (e.target.files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setCurrentImageUrl(e.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('firstName', user.firstName);
  formData.append('lastName', user.lastName);
  formData.append('phoneNumber', user.phoneNumber);
  formData.append('email', user.email);
  formData.append('userId', user._id);

  if (selectedFile) {
    formData.append('avatar', selectedFile);
  }

  try {
    const response = await axios.post('http://localhost:5001/users/profile', formData, {
      withCredentials: true,
      headers: {
          'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success && response.data.user) {
      // Manually add the isLoggedIn and navbar properties
      const updatedUser = {
        ...response.data.user,
        isLoggedIn: true, // Assuming the user remains logged in after updating their profile
        navbar: true, // Assuming you want the navbar to be visible after updating the profile
      };

      setUser(updatedUser);
      localStorage.setItem("bankUser", JSON.stringify(updatedUser));
      alert('Profile updated successfully');
    } else {
      alert('Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('An error occurred while updating the profile.');
  }
}

  return (
    <div className='profileUpdateContainer'>
        <h2>Edit your Profile</h2>
       <div className='updateContainer'>
       <form onSubmit={handleSubmit}>
            <div className='updateContainerName'>
            <div className='updateContainerNameFirst'>
                <label>First Name</label>
                <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputChange}
                />
            </div>
            <div className='updateContainerNameLast'>
                <label>Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                />
            </div>
            </div>
           <div className='updateContainerContact'>
           <div className='updateContainerPhone'>
                <label>Phone Number</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={user.phoneNumber}
                    onChange={handleInputChange}
                />
            </div>
            <div className='updateContainerEmail'>
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                />
            </div>
           </div>
           <div className='updateContainerImage'>
    <label>Profile Image
        <input className='imageInput'
            hidden
            type="file"
            name="avatar"
            onChange={handleFileChange}
        />
    </label>
    <img src={currentImageUrl ? currentImageUrl : '../Placeholders/no-img.png'} style={{ width: '100px', height: '100px' }} />
</div>

            <button className='saveButton' type="submit">Save Profile</button>
        </form>
        </div>
    </div>
);
}

