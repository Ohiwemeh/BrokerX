import React, { useState } from 'react';
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
  FaEyeSlash
} from 'react-icons/fa';

// --- MOCK DATA ---
// In a real app, this would come from an API
const mockUsers = [
  {
    id: 1,
    name: 'Joseph Jegede',
    email: 'joseph.j@example.com',
    passwordHash: '$2a$12$G.o8v9p2zJ3K/9b7c6D5E4F3g2H1i0j',
    status: 'Pending',
    dateJoined: '2025-10-09',
    balance: 500.00,
    personalInfo: {
      dob: '2004-04-29',
      address: '123 Tech Avenue, Silicon Valley',
      city: 'San Francisco',
      zipCode: '94105'
    },
    idFrontImg: 'https://placehold.co/600x400/334155/E2E8F0?text=ID+Front',
    idBackImg: 'https://placehold.co/600x400/334155/E2E8F0?text=ID+Back',
  },
  {
    id: 2,
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    passwordHash: '$2a$12$A.b1c2d3e4f5g6h7i8j9k0l/m1n2o3',
    status: 'Verified',
    dateJoined: '2025-10-08',
    balance: 12550.75,
    personalInfo: {
      dob: '1998-11-15',
      address: '456 Blockchain Blvd',
      city: 'New York',
      zipCode: '10001'
    },
    idFrontImg: 'https://placehold.co/600x400/334155/E2E8F0?text=ID+Front',
    idBackImg: 'https://placehold.co/600x400/334155/E2E8F0?text=ID+Back',
  },
   {
    id: 3,
    name: 'Bob Smith',
    email: 'bob.s@example.com',
    passwordHash: '$2a$12$X.yZ9a8b7c6d5e4f3g2h1i0j/k9l8m',
    status: 'Rejected',
    dateJoined: '2025-10-07',
    balance: 0.00,
    personalInfo: {
      dob: '2001-07-22',
      address: '789 Crypto Lane',
      city: 'Miami',
      zipCode: '33101'
    },
    idFrontImg: 'https://placehold.co/600x400/334155/E2E8F0?text=ID+Front',
    idBackImg: 'https://placehold.co/600x400/334155/E2E8F0?text=ID+Back',
  },
];

// --- Reusable Sub-Components ---

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-400">{label}</p>
    <p className="text-base text-white font-medium">{value}</p>
  </div>
);

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
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (type) => {
      if (!selectedUser) return;
      
      let title = '';
      let content = null;

      switch(type) {
          case 'addFunds':
              title = `Add Funds to ${selectedUser.name}`;
              content = (
                  <form className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Amount (USD)</label>
                          <input type="number" placeholder="0.00" className="w-full bg-slate-700 border border-slate-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      </div>
                      <button type="submit" className="w-full bg-blue-600 font-bold py-2 rounded-lg hover:bg-blue-700 transition">Confirm Deposit</button>
                  </form>
              );
              break;
          case 'sendEmail':
              title = `Send Email to ${selectedUser.name}`;
               content = (
                  <form className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
                          <input type="text" placeholder="Email subject" className="w-full bg-slate-700 border border-slate-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                          <textarea rows="4" placeholder="Your message here..." className="w-full bg-slate-700 border border-slate-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
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
    <div className="flex h-screen bg-slate-900 text-white font-sans">
        {isModalOpen && <Modal title={modalContent.title} onClose={() => setIsModalOpen(false)}>{modalContent.content}</Modal>}
      {/* Left Panel: User List */}
      <aside className="w-1/3 max-w-sm h-full flex flex-col border-r border-slate-800">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-blue-500">Admin Panel</h1>
          <p className="text-sm text-slate-400">BrokerX User Management</p>
        </div>
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-slate-800">
            {filteredUsers.map(user => {
                const statusClasses = {
                    'Verified': 'bg-green-500/10 text-green-400',
                    'Pending': 'bg-orange-500/10 text-orange-400',
                    'Rejected': 'bg-red-500/10 text-red-400'
                };
                return (
                    <li
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-4 cursor-pointer hover:bg-slate-700/50 transition-colors ${selectedUser?.id === user.id ? 'bg-slate-700' : ''}`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-white">{user.name}</p>
                                <p className="text-sm text-slate-400">{user.email}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusClasses[user.status]}`}>
                                {user.status}
                            </span>
                        </div>
                    </li>
                );
            })}
          </ul>
        </div>
      </aside>

      {/* Right Panel: User Details */}
      <main className="flex-1 p-6 overflow-y-auto">
        {selectedUser ? (
          <div className="space-y-8">
            {/* User Header */}
            <div className="pb-6 border-b border-slate-800">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold">{selectedUser.name}</h2>
                        <p className="text-slate-400">Joined on {selectedUser.dateJoined}</p>
                    </div>
                     <div className="flex gap-2">
                         <button className="bg-green-600/80 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition">
                            <FaUserCheck className="inline mr-2"/> Verify
                         </button>
                         <button className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition">
                            <FaUserTimes className="inline mr-2"/> Reject
                         </button>
                     </div>
                </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoField label="Email Address" value={selectedUser.email} />
                <InfoField label="Date of Birth" value={selectedUser.personalInfo.dob} />
                <InfoField label="Wallet Balance" value={`$${selectedUser.balance.toLocaleString()}`} />
                <InfoField label="Address" value={selectedUser.personalInfo.address} />
                <InfoField label="City" value={selectedUser.personalInfo.city} />
                <InfoField label="Zip Code" value={selectedUser.personalInfo.zipCode} />
            </div>

             {/* Security */}
            <div>
                 <h3 className="text-lg font-bold text-slate-300 mb-4">Account Security</h3>
                 <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between">
                     <div className="flex items-center gap-4">
                         <FaKey className="text-2xl text-slate-400"/>
                         <InfoField label="Password Hash" value={passwordVisible ? selectedUser.passwordHash : '••••••••••••••••••••••••••••••••••'}/>
                     </div>
                     <button onClick={() => setPasswordVisible(!passwordVisible)} className="text-slate-400 hover:text-white text-xl">
                         {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                     </button>
                 </div>
            </div>

            {/* ID Documents */}
            <div>
                <h3 className="text-lg font-bold text-slate-300 mb-4">Uploaded Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm font-semibold text-slate-400 mb-2">ID Front</p>
                        <img src={selectedUser.idFrontImg} alt="ID Front" className="rounded-lg border-2 border-slate-700"/>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-400 mb-2">ID Back</p>
                        <img src={selectedUser.idBackImg} alt="ID Back" className="rounded-lg border-2 border-slate-700"/>
                    </div>
                </div>
            </div>

            {/* Admin Actions */}
            <div>
                <h3 className="text-lg font-bold text-slate-300 mb-4">Admin Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <ActionButton icon={<FaPlus/>} label="Add Funds" onClick={() => openModal('addFunds')} className="bg-blue-600 hover:bg-blue-500"/>
                    <ActionButton icon={<FaEnvelope/>} label="Send Email" onClick={() => openModal('sendEmail')}/>
                    <ActionButton icon={<FaKey/>} label="Generate Code" onClick={() => alert(`Generated Code: ${Math.random().toString(36).substring(2, 10).toUpperCase()}`)}/>
                    <ActionButton icon={<FaTrash/>} label="Delete User" onClick={() => confirm('Are you sure you want to delete this user?')} className="bg-red-600/80 hover:bg-red-500"/>
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