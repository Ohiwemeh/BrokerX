import React, { useState } from 'react';
import { FaUserCircle, FaShieldAlt, FaBell, FaLock, FaMobileAlt  } from 'react-icons/fa';

// --- Reusable Sub-Components ---

// A reusable input field component for consistent styling
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

// The component for the "Profile" tab content
const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    firstName: 'Your First Name',
    lastName: 'Your Last Name',
    dob: '', // Date of birth is often not editable
    address: '',
    zipCode: 'Zip Code',
    city: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call logic here
    alert('Profile updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput id="firstName" label="First name" value={formData.firstName} onChange={handleChange} />
        <FormInput id="lastName" label="Last name" value={formData.lastName} onChange={handleChange} />
      </div>
      <FormInput id="dob" label="Date of Birth" value={formData.dob} onChange={handleChange} type='date' />
      <FormInput id="address" label="Street & Number, Building, Flat, etc." placeholder="Enter your address" value={formData.address} onChange={handleChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput id="zipCode" label="Postal/Zip Code" value={formData.zipCode} onChange={handleChange} />
        <FormInput id="city" label="City/Town" placeholder="Enter your city" value={formData.city} onChange={handleChange} />
      </div>
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Save Changes
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

    const handlePasswordChange = (e) => {
        const { id, value } = e.target;
        setPasswords(prev => ({ ...prev, [id]: value }));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        console.log("Changing password...");
        alert("Password change request submitted!");
    };

    return (
        <div className="space-y-12">
            {/* Change Password Section */}
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Change Password</h2>
                <p className="text-sm text-slate-400 mb-6">For your security, we recommend choosing a strong password that you don't use elsewhere.</p>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                    <FormInput id="currentPassword" label="Current Password" type="password" value={passwords.currentPassword} onChange={handlePasswordChange} />
                    <FormInput id="newPassword" label="New Password" type="password" value={passwords.newPassword} onChange={handlePasswordChange} />
                    <FormInput id="confirmPassword" label="Confirm New Password" type="password" value={passwords.confirmPassword} onChange={handlePasswordChange} />
                    <div className="pt-2 flex justify-end">
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                            Update Password
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
                        onClick={() => setIs2FAEnabled(!is2FAEnabled)}
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