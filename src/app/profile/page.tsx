'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import avatar from "../../../public/default-avatar.png"
import { StaticImageData } from "next/image";

interface User {
  id: number;
  avatar: StaticImageData;
  name: string;
  email: string;
  password: string;
  notifications: boolean;
}

// Initial profiles data
const initialProfiles: User[] = [
  {
    id: 1,
    avatar: avatar,
    name: "Jan Kowalski",
    email: "jan@example.com",
    password: "12345",
    notifications: true
  },
  {
    id: 2,
    avatar: avatar,
    name: "Anna Nowak",
    email: "anna@example.com", 
    password: "67890",
    notifications: false
  },
  {
    id: 3,
    avatar: avatar,
    name: "Michał Lewandowski",
    email: "michal@example.com",
    password: "qwerty",
    notifications: true
  }
];

export default function ProfileView() {
  const [profiles, setProfiles] = useState<User[]>(initialProfiles);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // State for form inputs and messages
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    notifications: false
  });
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");

  // Load user data from local storage on component mount
  useEffect(() => {
    const storedProfiles = localStorage.getItem('userProfiles');
    if (storedProfiles) {
      setProfiles(JSON.parse(storedProfiles));
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !file.type.startsWith("image/")) {
      setPopupMessage("Nieprawidłowy format pliku.");
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }
    setSelectedAvatar(file || null);
  };

  const handleNextProfile = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
  };

  const handleEditProfile = () => {
    const currentProfile = profiles[currentProfileIndex];
    // Populate form with current profile data
    setFormData({
      name: currentProfile.name,
      email: currentProfile.email,
      password: currentProfile.password,
      notifications: currentProfile.notifications
    });
    setIsEditing(true);
  };

  const handleSubmit = () => {
    // Validate inputs
    if (formData.password.length > 0 && formData.password.length < 6) {
      setPopupMessage("Hasło jest za krótkie.");
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

    if (!formData.email.includes("@")) {
      setPopupMessage("Nieprawidłowy format email.");
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

    // Create updated profiles array
    const updatedProfiles = profiles.map((profile, index) => 
      index === currentProfileIndex 
        ? {
            ...profile,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            notifications: formData.notifications
          }
        : profile
    );

    // Save to local storage
    localStorage.setItem('userProfiles', JSON.stringify(updatedProfiles));
    
    // Update state
    setProfiles(updatedProfiles);

    // Set success popup
    setPopupMessage("Zmiany zapisane pomyślnie!");
    setPopupType("success");
    setIsPopupOpen(true);

    // Exit editing mode
    setIsEditing(false);

    // If avatar was selected, you could add logic to upload/save it here
    if (selectedAvatar) {
      console.log("Avatar selected:", selectedAvatar);
    }
  };

  // Custom Popup Component
  const Popup = () => {
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsPopupOpen(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    return (
      <div 
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: popupType === 'success' ? '#4CAF50' : '#f44336',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          transition: 'opacity 0.3s ease-in-out'
        }}
        onClick={() => setIsPopupOpen(false)}
      >
        {popupMessage}
      </div>
    );
  };

  const currentProfile = profiles[currentProfileIndex];

  return (
    <>
      <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Profil użytkownika</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleNextProfile}
              style={{ 
                padding: '5px 10px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Następny profil
            </button>
            <button 
            data-testid="edit"
              onClick={handleEditProfile}
              style={{ 
                padding: '5px 10px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Edytuj profil
            </button>
          </div>
        </div>
        
        {/* Profile Display Section */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Image
            src={currentProfile.avatar}
            alt="Avatar"
            width={100}
            height={100}
            style={{ borderRadius: "50%", marginRight: '20px' }}
          />
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{currentProfile.name}</h4>
            <p style={{ marginBottom: '5px' }}>Email: {currentProfile.email}</p>
            <p style={{ marginBottom: '5px' }}>Hasło: {currentProfile.password}</p>
            <p>Powiadomienia: {currentProfile.notifications ? "Włączone" : "Wyłączone"}</p>
          </div>
        </div>

        {/* Edit Form Section */}
        {isEditing && (
          <div style={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: '8px', 
            padding: '20px', 
            marginTop: '20px' 
          }}>
            <h4 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Edytuj profil</h4>
            
            <input
            id="fileUpload" 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarChange} 
              style={{ display: "block", margin: "10px 0" }} 
            />
            
            <input 
              type="text" 
              data-testid='nameSurname'
              placeholder="Imię i nazwisko" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
              style={{ width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }} 
            />
            
            <input 
              type="email" 
              data-testid="email"
              placeholder="Email" 
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} 
              style={{ width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }} 
            />
            
            <input 
              type="text" 
              data-testid='password'
              placeholder="Hasło" 
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))} 
              style={{ width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }} 
            />
            
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <input 
              data-testid="checkbox"
                type="checkbox" 
                checked={formData.notifications}
                onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))} 
              />
              <span>Powiadomienia email</span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
              data-testid="save"
                onClick={handleSubmit} 
                style={{ 
                  flex: 1, 
                  padding: "10px", 
                  backgroundColor: "#007bff", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "4px", 
                  cursor: "pointer" 
                }}
              >
                Zapisz zmiany
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                style={{ 
                  flex: 1, 
                  padding: "10px", 
                  backgroundColor: "#6c757d", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "4px", 
                  cursor: "pointer" 
                }}
              >
                Anuluj
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Popup */}
      {isPopupOpen && <Popup />}
    </>
  );
}