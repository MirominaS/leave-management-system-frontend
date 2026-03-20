import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LeaveRequests = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3300/leave');
            const data = await response.json();
            // bring newst to the top
            setLeaveRequests(data.sort((a, b) => b.id - a.id));
        } catch (error) {
            console.error("Error fetching leaves:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    //Approve/Reject
   const updateStatus = async (id, action) => {
    // action will be 'approve' or 'reject'
    const endpoint = `http://localhost:3300/leave/${action}?id=${id}`;
    const roleId = localStorage.getItem('role_id');

    try {
        const response = await fetch(endpoint, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'role_id': roleId 
            }
        });

        if (response.ok) {
            fetchRequests(); 
        } else {
            const msg = await response.text();
            alert(msg);
        }
    } catch (error) {
        alert("Connection error");
    }
};

    return (
        <div className="min-h-screen bg-[#F6E7BC] p-4 md:p-8 font-sans text-[#0B2D72]">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl 
                            font-black 
                            tracking-tighter 
                            uppercase">
                            Request Inbox
                        </h1>
                        <p className="text-[10px] 
                            font-bold 
                            text-[#0AC4E0] 
                            tracking-[0.2em] 
                            uppercase">
                            Management Control Panel
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => navigate('/employee')}
                            className="bg-white 
                                text-[#0B2D72] 
                                px-6 py-2 
                                rounded-xl 
                                font-black 
                                text-[10px] 
                                uppercase 
                                tracking-widest 
                                border-2 border-[#0B2D72] hover:bg-gray-100 transition-colors"
                        >
                            Back
                        </button>
                        <button 
                            onClick={fetchRequests}
                            className="bg-[#0B2D72] text-white px-6 py-2 
                                rounded-xl font-black text-[10px] uppercase 
                                tracking-widest hover:bg-[#0AC4E0] transition-colors"
                        >
                            {loading ? 'Refreshing...' : 'Refresh List'}
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border-b-[12px] border-[#0B2D72]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b-2 border-gray-100">
                                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                        Employee Details
                                    </th>
                                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                        Leave Type
                                    </th>
                                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                        Period
                                    </th>
                                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                        Reason
                                    </th>
                                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 
                                        tracking-widest text-center">
                                        Decision
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {leaveRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#0B2D72] 
                                                    rounded-full flex items-center justify-center 
                                                    text-white font-black text-xs uppercase">
                                                    {req.employee?.charAt(0) || 'E'}
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm uppercase">{req.employee}</p>
                                                    <p className="text-[10px] text-[#0AC4E0] font-bold">
                                                        #EMP-{req.employee_id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1 bg-gray-100 rounded-lg 
                                                text-[10px] font-black uppercase">
                                                {req.leave_type_name}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="text-[11px] font-bold">
                                                <span>{req.start_date}</span>
                                                <span className="mx-2 text-gray-300">to</span>
                                                <span>{req.end_date}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                                                {req.reason || "No reason provided"}
                                            </p>
                                        </td>
                                        <td className="p-6">
                                            {req.status === 'Pending' ? (
                                                <div className="flex gap-2 justify-center">
                                                    <button 
                                                        onClick={() => updateStatus(req.id, 'approve')}
                                                        className="bg-green-500 hover:bg-green-600 
                                                            text-white text-[9px] font-black px-4 py-2 
                                                            rounded-lg uppercase transition-all shadow-md active:scale-95"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(req.id, 'reject')}
                                                        className="bg-red-500 hover:bg-red-600 
                                                            text-white text-[9px] font-black px-4 py-2 
                                                            rounded-lg uppercase transition-all shadow-md 
                                                            active:scale-95"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center">
                                                    <span className={`text-[9px] font-black px-4 py-2 
                                                        rounded-lg uppercase border-2 ${
                                                        req.status === 'Approved' 
                                                            ? 'border-green-200 text-green-500 bg-green-50' 
                                                            : 'border-red-200 text-red-500 bg-red-50'
                                                    }`}>
                                                        {req.status}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeaveRequests;