import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Employee = () => {
    const navigate = useNavigate();
    const [showRequestPopup, setShowRequestPopup] = useState(false)
    const [leaveTypes,setLeaveTypes] = useState([]);
    const [myLeaves, setMyLeaves] = useState([]);
    const [user, setUser] = useState({ id: null, name: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [clearLeave, setClearLeave] = useState([])

    const [formData, setFormData] = useState({
        startDate:'',
        endDate: '',
        leaveTypeId: '',
        reason: ''
    });

    useEffect(() => {
    const loadData = async () => {
        const empId = localStorage.getItem('employee_id');
        
        if (!empId) {
            console.error("No employee ID found in storage");
            return;
        }

        try {
            // 1. Fetch Profile first
            const profileRes = await fetch(`http://localhost:3300/employees/profile?id=${empId}`, {
                headers: { 'employee_id': empId }
            });
            const userData = await profileRes.json();
            setUser(userData);

            // 2. Fetch Leave Types (This was likely getting skipped or failing)
            const typesRes = await fetch('http://localhost:3300/leave-types');
            const typesData = await typesRes.json();
            setLeaveTypes(typesData);
            
            // Set default leave type ID if data exists
            if (typesData.length > 0) {
                setFormData(f => ({ ...f, leaveTypeId: typesData[0].id }));
            }

            // 3. Fetch all leaves and filter for this specific user
            const leavesRes = await fetch('http://localhost:3300/leave');
            const allLeaves = await leavesRes.json();
            
            // Safer to filter by name or ID once userData is loaded
            setMyLeaves(allLeaves.filter(l => l.employee === userData.name));

        } catch (err) {
            console.error("Data fetch failed:", err);
        }
        };

        loadData();
    }, []);

    const latestLeave = myLeaves
    .filter(l => !clearLeave.includes(l.id)) // Filter out dismissed ones
    .slice(-1)[0] || null; // Get the last one

    const handleCancel = async (leaveId) => {
        if (!window.confirm("Are you sure you want to cancel this request?")) return;

        try {
            // Adjust this URL to match your Go backend cancel endpoint
            const res = await fetch(`http://localhost:3300/leave/cancel?id=${leaveId}`, {
                method: 'DELETE',
                headers: {
                    'employee_id': user.id.toString() // If your backend requires the requester's ID
                }
            });

            if (res.ok) {
                // Refresh the list immediately so the UI updates
                const refresh = await fetch('http://localhost:3300/leave');
                const data = await refresh.json();
                setMyLeaves(data.filter(l => l.employee === user.name));
            } else {
                const msg = await res.text();
                alert("Cancel failed: " + msg);
            }
        } catch (err) {
            console.error("Cancel error:", err);
            alert("Connection error while cancelling");
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            employee_id: user.id,
            start_date:formData.startDate,
            end_date:formData.endDate,
            leave_type_id: parseInt(formData.leaveTypeId),
            reason:formData.reason
        }

        try {
            const res = await fetch('http://localhost:3300/leave/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setShowRequestPopup(false);
                // Refresh list after success
                const refresh = await fetch('http://localhost:3300/leave');
                const data = await refresh.json();
                setMyLeaves(data.filter(l => l.employee === user.name));
                // Reset form
                setFormData({ ...formData, startDate: '', endDate: '', reason: '' });
            } else {
                const errorText = await res.text();
                alert(errorText);
            }
        } catch (err) {
            alert("Server connection error");
        } finally {
            setLoading(false);
        } 
    }

    const handleLogout = () => {
        localStorage.clear()
        sessionStorage.clear()

        navigate('/')
    }

    const handleClear = (leaveId) => {
        setClearLeave([...clearLeave, leaveId]);
    // Optional: Save to localStorage if you want it to stay hidden after refresh
    // localStorage.setItem('dismissed_leaves', JSON.stringify([...dismissedLeaves, leaveId]));
    };

    const userRole = parseInt(localStorage.getItem('role_id'));

    const privilegedRoles = [4, 6];

  return (
    <div className="h-screen w-full bg-[#F6E7BC] flex flex-col overflow-hidden font-sans text-[#0B2D72]">
            {/* Navbar */}
            <nav className="h-16 w-full bg-[#0B2D72] text-white px-8 flex justify-between items-center shadow-lg border-b-4 border-[#0AC4E0] shrink-0">
                <div className="flex items-center gap-6">
                    <h2 className="text-lg font-black tracking-tighter">ABC Company</h2>
                    <span className="hidden sm:block text-[9px] font-black uppercase tracking-[0.2em] text-[#0AC4E0]">Employee Portal</span>
                    {/* Check if userRole is 4 (Manager) or 6 (Admin) */}
                    {privilegedRoles.includes(userRole) && (
                    <div className="flex gap-2">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="bg-[#0AC4E0] text-[#0B2D72] text-[10px] font-black uppercase px-4 py-2 rounded-lg hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(10,196,224,0.4)] flex items-center gap-2"
                        >
                            <span className="w-2 h-2 bg-[#0B2D72] rounded-full animate-pulse"></span>
                            {userRole === 6 ? "Admin Panel" : "Management View"}
                        </button>
                        <button 
                            onClick={() => navigate('/leave-request')} // Ensure this route matches your App.js
                            className="bg-[#0AC4E0] text-[#0B2D72] text-[10px] font-black uppercase px-4 py-2 rounded-lg hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(10,196,224,0.4)] flex items-center gap-2"
                        >
                        <span className="w-2 h-2 bg-[#0B2D72] rounded-full animate-pulse"></span>
                            Review Requests
                        </button>
                    </div>
                    )}
                </div>
                <button 
                    className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </nav>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border-b-[10px] border-[#0B2D72] flex flex-col max-h-[90vh]">
                    <div className="p-6 md:p-8 overflow-y-auto">
                        <div className="mb-6">
                            <h1 className="text-2xl font-black tracking-tighter">My Profile</h1>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#0AC4E0]">Synced with Database</p>
                        </div>

                        {/* Profile Data - Dynamic */}
                        <div className="grid grid-cols-2 gap-y-10 gap-x-12 mb-10 px-2">
                            <div className="space-y-1 border-l-2 border-[#0AC4E0] pl-4">
                                <label className="text-[10px] font-black uppercase text-gray-400">Full Name</label>
                                <p className="text-base font-bold">{user.name || "Loading..."}</p>
                            </div>
                            <div className="space-y-1 border-l-2 border-[#0AC4E0] pl-4">
                                <label className="text-[10px] font-black uppercase text-gray-400">Employee ID</label>
                                <p className="text-base font-bold">#EMP-{user.id || "----"}</p>
                            </div>
                            <div className="space-y-1 border-l-2 border-[#0AC4E0] pl-4 col-span-2">
                                <label className="text-[10px] font-black uppercase text-gray-400">Email Address</label>
                                <p className="text-[13px] font-bold truncate">{user.email || "Loading..."}</p>
                            </div>
                        </div>

                        {/* Status Card - Dynamic based on Backend */}
                        {/* Status Card - Updated with Cancel Button */}
                        {latestLeave && (
                            <div className={`mb-6 p-4 rounded-xl border-2 border-dotted flex justify-between items-center ${
                                latestLeave.status === 'Pending' ? 'bg-yellow-50 border-yellow-200' : 
                                latestLeave.status === 'Approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                            }`}>
                                <div className="flex flex-col">
                                    <p className="text-[8px] font-black uppercase opacity-60">
                                        {latestLeave.status} Request
                                    </p>
                                    <p className="text-sm font-bold">{latestLeave.leave_type_name}</p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <span className={`text-[10px] font-black px-3 py-1 rounded uppercase ${
                                        latestLeave.status === 'Approved' ? 'bg-green-500 text-white' : 
                                        latestLeave.status === 'Rejected' ? 'bg-red-500 text-white' : 'bg-yellow-400'
                                    }`}>
                                        {latestLeave.status}
                                    </span>

                                    {/* Only show Cancel button if status is Pending */}
                                    {latestLeave.status === "Pending" && (
                                        <button 
                                            onClick={() => handleCancel(latestLeave.id)}
                                            className="text-[9px] font-black text-red-500 hover:text-red-700 uppercase tracking-tighter underline decoration-dotted underline-offset-2 transition-colors"
                                        >
                                            Cancel Request
                                        </button>
                                    )}
                                    {(latestLeave.status === "Approved" || latestLeave.status === "Rejected") && (
                                        <button 
                                        onClick={() => handleClear(latestLeave.id)}
                                        className="text-[9px] font-black text-gray-400 hover:text-[#0B2D72] uppercase underline transition-colors"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowRequestPopup(true)}
                            disabled={latestLeave?.status === "Pending"}
                            className="w-full bg-[#0B2D72] text-white font-black py-3.5 rounded-xl hover:bg-[#0AC4E0] hover:text-[#0B2D72] transition-all shadow-lg uppercase tracking-widest text-[10px] border-b-4 border-[#0B2D72] disabled:opacity-30"
                        >
                            {latestLeave?.status === "Pending" ? "Request Pending" : "Request New Leave"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Popup Form */}
            {showRequestPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2D72]/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border-b-[10px] border-[#0AC4E0]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-black tracking-tighter">Request Leave</h2>
                            <button onClick={() => setShowRequestPopup(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Leave Type</label>
                                <select 
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold"
                                    value={formData.leaveTypeId}
                                    onChange={(e) => setFormData({...formData, leaveTypeId: e.target.value})}
                                >
                                    {leaveTypes.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Start Date</label>
                                    <input type="date" required className="w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-sm font-bold" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">End Date</label>
                                    <input type="date" required className="w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-sm font-bold" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Reason</label>
                                <textarea rows="3" required className="w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-sm font-bold resize-none" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} />
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-[#0B2D72] text-white font-black py-4 rounded-xl hover:bg-[#0AC4E0] uppercase tracking-widest text-[10px] border-b-4 border-[#0B2D72]">
                                {loading ? "Submitting..." : "Submit Request"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
  );
};

export default Employee;
