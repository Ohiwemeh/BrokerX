import React, { useState, useEffect } from 'react';
import { adminService } from '../api/services';
import NotificationBell from '../components/NotificationBell';
import { 
  FaUsers, 
  FaSearch, 
  FaUserCheck, 
  FaUserTimes, 
  FaPlus, 
  FaEnvelope, 
  FaTrash, 
  FaKey,
  FaTimes,
  FaFileImage,
  FaEye,
  FaEyeSlash,
  FaCertificate,
  FaExclamationCircle,
  FaTimesCircle
} from 'react-icons/fa';

// --- Reusable Sub-Components ---

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-400">{label}</p>
    <p className="text-base text-white font-medium">{value}</p>
  </div>
);

const VerificationBadge = ({ status }) => {
  const statusConfig = {
    'Verified': {
      icon: FaCertificate,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      label: 'Verified'
    },
    'Pending': {
      icon: FaExclamationCircle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      label: 'Pending'
    },
    'Rejected': {
      icon: FaTimesCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      label: 'Rejected'
    }
  };

  const config = statusConfig[status] || statusConfig['Pending'];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <Icon className={`text-xl ${config.color}`} />
      <span className={`font-semibold ${config.color}`}>{config.label}</span>
    </div>
  );
};

const ActionButton = ({ icon, label, onClick, className = 'bg-slate-600 hover:bg-slate-500' }) => (
  <button onClick={onClick} className={`flex items-center justify-center gap-2 w-full text-sm font-semibold py-2 px-4 rounded-lg transition ${className}`}>
    {icon}
    <span>{label}</span>
  </button>
);

const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-slate-700">
                <h2 className="text-lg font-bold text-white">{title}</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white"><FaTimes/></button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
);


// --- Main Admin Page Component ---

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserDetails(selectedUser._id);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers({ search: searchTerm });
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const data = await adminService.getUser(userId);
      setSelectedUserDetails(data);
    } catch (err) {
      console.error('Failed to load user details:', err);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerifyUser = async () => {
    if (!selectedUser) return;
    try {
      await adminService.verifyUser(selectedUser._id);
      alert('User verified successfully!');
      fetchUsers();
      fetchUserDetails(selectedUser._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to verify user');
    }
  };

  const handleRejectUser = async () => {
    if (!selectedUser) return;
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await adminService.rejectUser(selectedUser._id, reason);
      alert('User rejected');
      fetchUsers();
      fetchUserDetails(selectedUser._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject user');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminService.deleteUser(selectedUser._id);
      alert('User deleted successfully');
      setSelectedUser(null);
      setSelectedUserDetails(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const openModal = (type) => {
      if (!selectedUser) return;
      
      let title = '';
      let content = null;

      switch(type) {
          case 'addFunds':
              title = `Add Funds to ${selectedUser.name}`;
              content = (
                  <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault();
                      const amount = e.target.amount.value;
                      const description = e.target.description.value;
                      try {
                          await adminService.addFunds(selectedUser._id, parseFloat(amount), description);
                          alert('Funds added successfully!');
                          setIsModalOpen(false);
                          fetchUsers();
                          fetchUserDetails(selectedUser._id);
                      } catch (err) {
                          alert(err.response?.data?.message || 'Failed to add funds');
                      }
                  }}>
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Amount (USD)</label>
                          <input name="amount" type="number" placeholder="0.00" required className="w-full bg-slate-700 border border-slate-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                          <input name="description" type="text" placeholder="Bonus, deposit, etc." className="w-full bg-slate-700 border border-slate-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      </div>
                      <button type="submit" className="w-full bg-blue-600 font-bold py-2 rounded-lg hover:bg-blue-700 transition">Confirm Deposit</button>
                  </form>
              );
              break;
          case 'sendEmail':
              title = `Send Email to ${selectedUser.name}`;
               content = (
                  <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault();
                      const subject = e.target.subject.value;
                      const message = e.target.message.value;
                      try {
                          await adminService.sendEmail(selectedUser._id, subject, message);
                          alert('Email sent successfully!');
                          setIsModalOpen(false);
                      } catch (err) {
                          alert(err.response?.data?.message || 'Failed to send email');
                      }
                  }}>
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
                          <input name="subject" type="text" placeholder="Email subject" required className="w-full bg-slate-700 border border-slate-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                          <textarea name="message" rows="4" placeholder="Your message here..." required className="w-full bg-slate-700 border border-slate-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      </div>
                      <button type="submit" className="w-full bg-blue-600 font-bold py-2 rounded-lg hover:bg-blue-700 transition">Send Email</button>
                  </form>
              );
              break;
          default:
              break;
      }
      setModalContent({ title, content });
      setIsModalOpen(true);
  };


  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-900 text-white font-sans">
        {isModalOpen && <Modal title={modalContent.title} onClose={() => setIsModalOpen(false)}>{modalContent.content}</Modal>}
      {/* Left Panel: User List */}
      <aside className="w-full md:w-1/3 md:max-w-sm h-1/3 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-800">
        <div className="p-3 sm:p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-500">Admin Panel</h1>
              <p className="text-xs sm:text-sm text-slate-400">BrokerX User Management</p>
            </div>
            <NotificationBell />
          </div>
        </div>
        <div className="p-3 sm:p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-slate-400">Loading users...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <FaUsers className="text-6xl mb-4" />
              <p className="text-lg font-semibold">No users found</p>
              <p className="text-sm">Try adjusting your search</p>
            </div>
          ) : (
          <ul className="divide-y divide-slate-800">
            {filteredUsers.map(user => {
                const statusClasses = {
                    'Verified': 'bg-green-500/10 text-green-400',
                    'Pending': 'bg-orange-500/10 text-orange-400',
                    'Rejected': 'bg-red-500/10 text-red-400'
                };
                return (
                    <li
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-3 sm:p-4 cursor-pointer hover:bg-slate-700/50 transition-colors ${selectedUser?._id === user._id ? 'bg-slate-700' : ''}`}
                    >
                        <div className="flex justify-between items-center gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-white text-sm sm:text-base truncate">{user.name}</p>
                                <p className="text-xs sm:text-sm text-slate-400 truncate">{user.email}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full flex-shrink-0 ${statusClasses[user.accountStatus] || 'bg-gray-500/10 text-gray-400'}`}>
                                {user.accountStatus}
                            </span>
                        </div>
                    </li>
                );
            })}
          </ul>
          )}
        </div>
      </aside>

      {/* Right Panel: User Details */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
        {selectedUser ? (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* User Header */}
            <div className="pb-4 sm:pb-6 border-b border-slate-800">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{selectedUser.name}</h2>
                          <VerificationBadge status={selectedUser.accountStatus} />
                        </div>
                        <p className="text-slate-400 text-xs sm:text-sm">Joined on {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                     <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                         <button onClick={handleVerifyUser} className="bg-green-600/80 hover:bg-green-500 text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition text-sm flex items-center justify-center gap-2">
                            <FaUserCheck /> <span>Verify</span>
                         </button>
                         <button onClick={handleRejectUser} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition text-sm flex items-center justify-center gap-2">
                            <FaUserTimes /> <span>Reject</span>
                         </button>
                     </div>
                </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <InfoField label="Email Address" value={selectedUser.email} />
                <InfoField label="Date of Birth" value={selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : 'N/A'} />
                <InfoField label="Wallet Balance" value={`$${selectedUser.balance?.toLocaleString() || 0}`} />
                <InfoField label="Address" value={selectedUser.address || 'N/A'} />
                <InfoField label="City" value={selectedUser.city || 'N/A'} />
                <InfoField label="Zip Code" value={selectedUser.zipCode || 'N/A'} />
            </div>

             {/* Security */}
            <div>
                 <h3 className="text-base sm:text-lg font-bold text-slate-300 mb-3 sm:mb-4">Account Security</h3>
                 <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between">
                     <div className="flex items-center gap-4">
                         <FaKey className="text-2xl text-slate-400"/>
                         <InfoField label="Password Hash" value={passwordVisible ? selectedUser.password : '••••••••••••••••••••••••••••••••••'}/>
                     </div>
                     <button onClick={() => setPasswordVisible(!passwordVisible)} className="text-slate-400 hover:text-white text-xl">
                         {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                     </button>
                 </div>
            </div>

            {/* ID Documents */}
            <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-300 mb-3 sm:mb-4">Uploaded Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <p className="text-sm font-semibold text-slate-400 mb-2">ID Front</p>
                        {selectedUser.idFrontUrl ? (
                          <img src={selectedUser.idFrontUrl} alt="ID Front" className="rounded-lg border-2 border-slate-700"/>
                        ) : (
                          <div className="bg-slate-700 rounded-lg border-2 border-slate-600 h-48 flex items-center justify-center">
                            <p className="text-slate-400">No document uploaded</p>
                          </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-400 mb-2">ID Back</p>
                        {selectedUser.idBackUrl ? (
                          <img src={selectedUser.idBackUrl} alt="ID Back" className="rounded-lg border-2 border-slate-700"/>
                        ) : (
                          <div className="bg-slate-700 rounded-lg border-2 border-slate-600 h-48 flex items-center justify-center">
                            <p className="text-slate-400">No document uploaded</p>
                          </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Admin Actions */}
            <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-300 mb-3 sm:mb-4">Admin Actions</h3>
                {selectedUser.accountStatus !== 'Verified' && (
                  <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg text-sm text-yellow-300">
                    ⚠️ User must be verified before you can add funds
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    <button 
                      onClick={() => selectedUser.accountStatus === 'Verified' ? openModal('addFunds') : alert('User must be verified before adding funds')}
                      disabled={selectedUser.accountStatus !== 'Verified'}
                      className={`flex items-center justify-center gap-2 w-full text-sm font-semibold py-2 px-4 rounded-lg transition ${
                        selectedUser.accountStatus === 'Verified' 
                          ? 'bg-blue-600 hover:bg-blue-500' 
                          : 'bg-slate-600 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <FaPlus/>
                      <span>Add Funds</span>
                    </button>
                    <ActionButton icon={<FaEnvelope/>} label="Send Email" onClick={() => openModal('sendEmail')}/>
                    <ActionButton icon={<FaKey/>} label="Generate Code" onClick={() => alert(`Generated Code: ${Math.random().toString(36).substring(2, 10).toUpperCase()}`)}/>
                    <ActionButton icon={<FaTrash/>} label="Delete User" onClick={handleDeleteUser} className="bg-red-600/80 hover:bg-red-500"/>
                </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <FaUsers className="text-8xl mb-4" />
            <h2 className="text-2xl font-semibold">Select a user</h2>
            <p>Choose a user from the list to view their details and manage their account.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;