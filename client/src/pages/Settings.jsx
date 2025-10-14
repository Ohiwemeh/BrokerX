import React, { useState, useRef, useEffect } from 'react';
import { profileService } from '../api/services';
import { 
  FaUserCircle, 
  FaShieldAlt, 
  FaBell, 
  FaLock, 
  FaMobileAlt, 
  FaUser,
  // --- FIX: Added missing icons ---
  FaUpload,
  FaFileImage
} from 'react-icons/fa';

// --- Reusable Sub-Components ---

const FormInput = ({ id, label, type = 'text', value, onChange, placeholder, disabled = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-400 mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full bg-slate-700 border border-slate-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed"
    />
  </div>
);

const DocumentUploader = ({ title, file, onFileChange }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation(); // Prevent the click from re-opening the file dialog
    onFileChange(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-2">{title}</label>
      <div
        onClick={handleBoxClick}
        className="flex justify-center items-center w-full h-40 px-6 py-10 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition-colors"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, application/pdf"
          className="hidden"
        />
        {file ? (
          <div className="text-center">
            <FaFileImage className="mx-auto text-4xl text-blue-400 mb-2" />
            <p className="text-sm text-slate-200 font-semibold">{file.name}</p>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="mt-2 text-xs text-red-400 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <FaUpload className="mx-auto text-4xl text-slate-500 mb-2" />
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">PNG, JPG or PDF</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    zipCode: '',
    city: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);

  const profilePicInputRef = useRef(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleUploadClick = () => {
    profilePicInputRef.current.click();
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        setFormData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          dob: profile.dob ? profile.dob.split('T')[0] : '',
          address: profile.address || '',
          zipCode: profile.zipCode || '',
          city: profile.city || '',
          phoneNumber: profile.phoneNumber || '',
        });
        if (profile.profileImageUrl) {
          setImagePreview(profile.profileImageUrl);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Update profile
      await profileService.updateProfile(formData);

      // Upload profile image if changed
      if (profileImage) {
        await profileService.uploadProfileImage(profileImage);
      }

      // Upload ID documents if provided
      if (idFront || idBack) {
        await profileService.uploadID(idFront, idBack);
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
          {success}
        </div>
      )}
      <div className="flex items-center gap-6 pb-6 border-b border-slate-700">
        <div className="relative">
          {imagePreview ? (
            <img src={imagePreview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center">
              <FaUser className="text-4xl text-slate-500" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">
            {formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}` : "User Profile"}
          </h3>
          <p className="text-sm text-slate-400">Update your photo and personal details.</p>
          <div className="mt-3 flex items-center gap-4">
            <input
              type="file"
              ref={profilePicInputRef}
              onChange={handleImageChange}
              accept="image/png, image/jpeg"
              className="hidden"
            />
            <button
              type="button"
              onClick={handleUploadClick}
              className="bg-slate-600/50 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-slate-700 transition"
            >
              Change photo
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput id="firstName" label="First name" value={formData.firstName} onChange={handleChange} placeholder="Enter your first name" />
        <FormInput id="lastName" label="Last name" value={formData.lastName} onChange={handleChange} placeholder="Enter your last name" />
      </div>
      <FormInput id="dob" label="Date of Birth" value={formData.dob} onChange={handleChange} type='date' />
      <FormInput id="address" label="Street & Number, Building, Flat, etc." placeholder="Enter your address" value={formData.address} onChange={handleChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput id="zipCode" label="Postal/Zip Code" placeholder="Enter zip code" value={formData.zipCode} onChange={handleChange} />
        <FormInput id="city" label="City/Town" placeholder="Enter your city" value={formData.city} onChange={handleChange} />
      </div>
      <FormInput id="phoneNumber" label="Phone Number" placeholder="Enter your phone number" value={formData.phoneNumber} onChange={handleChange} />

      <div className="border-t border-slate-700 pt-6">
        <h2 className="text-xl font-bold text-white mb-1">Identity Verification</h2>
        <p className="text-sm text-slate-400 mb-6">To comply with regulations, please upload a clear image of the front and back of your government-issued ID.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentUploader title="Front of ID Card" file={idFront} onFileChange={setIdFront} />
          <DocumentUploader title="Back of ID Card" file={idBack} onFileChange={setIdBack} />
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

const SecuritySettings = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await profileService.getProfile();
                setIs2FAEnabled(profile.twoFactorEnabled || false);
            } catch (err) {
                console.error('Failed to load 2FA status:', err);
            }
        };
        loadProfile();
    }, []);

    const handlePasswordChange = (e) => {
        const { id, value } = e.target;
        setPasswords(prev => ({ ...prev, [id]: value }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("New passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            await profileService.changePassword(passwords.currentPassword, passwords.newPassword);
            setSuccess('Password changed successfully!');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handle2FAToggle = async () => {
        try {
            const result = await profileService.toggle2FA();
            setIs2FAEnabled(result.twoFactorEnabled);
        } catch (err) {
            console.error('Failed to toggle 2FA:', err);
        }
    };

    return (
        <div className="space-y-12">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
                    {success}
                </div>
            )}

            {/* Change Password Section */}
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Change Password</h2>
                <p className="text-sm text-slate-400 mb-6">For your security, we recommend choosing a strong password that you don't use elsewhere.</p>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                    <FormInput id="currentPassword" label="Current Password" type="password" value={passwords.currentPassword} onChange={handlePasswordChange} />
                    <FormInput id="newPassword" label="New Password" type="password" value={passwords.newPassword} onChange={handlePasswordChange} />
                    <FormInput id="confirmPassword" label="Confirm New Password" type="password" value={passwords.confirmPassword} onChange={handlePasswordChange} />
                    <div className="pt-2 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Two-Factor Authentication Section */}
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Two-Factor Authentication (2FA)</h2>
                <p className="text-sm text-slate-400 mb-6">Add an extra layer of security to your account by requiring a second authentication step.</p>
                <div className="bg-slate-700/50 p-6 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <FaMobileAlt className="text-3xl text-blue-400" />
                        <div>
                            <h3 className="font-semibold text-white">Authenticator App</h3>
                            <span className={`text-sm ${is2FAEnabled ? 'text-green-400' : 'text-slate-400'}`}>
                                {is2FAEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>
                    {/* Toggle Switch */}
                    <button 
                        onClick={handle2FAToggle}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${is2FAEnabled ? 'bg-blue-600' : 'bg-slate-600'}`}
                    >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${is2FAEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main Settings Page Component ---

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUserCircle },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 text-white">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 md:px-6 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'security' && <SecuritySettings />} {/* <-- Renders our new component */}
          {activeTab === 'notifications' && (
             <div className="text-center text-slate-400 py-10">
              <FaBell className="mx-auto text-5xl mb-4 text-slate-600" />
              <h2 className="text-xl font-bold mb-2 text-white">Notification Preferences</h2>
              <p>Manage your email, SMS, and push notification settings here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;