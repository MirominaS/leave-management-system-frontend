import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    roles: []
  });
  const [addEmployee, setAddEmployee] = useState({
    name:'',
    email:'',
    password:'',
    role_id:''
  })

  useEffect(()=> {
    fetchDashboardData();
    fetchActivities()
  },[]);

  useEffect(() => {
    const role = parseInt(localStorage.getItem('role_id'));
    const privilegedRoles = [4, 6];

    if (!privilegedRoles.includes(role)) {

        navigate('/employee'); 
    }
}, [navigate]);

  const fetchDashboardData = async () => {
        try{
            const response = await fetch("http://localhost:3300/dashboard");
            const data = await response.json();

            console.log("RAW API:", data);
            console.log("Roles:",data.roles)

            const formattedData = {
                totalEmployees: data.total_employees,
                pendingLeaves: data.pending_leaves,
                approvedLeaves: data.approved_leaves,
                rejectedLeaves: data.rejected_leaves,
                roles: data.roles || []
            };

            console.log("Formatted Data:",formattedData)
            setStats(formattedData);

            if(data.roles && data.roles.length > 0){
              setAddEmployee(prev => ({
                ...prev,
                role_id:data.roles[0]?.id?.toString()
              }))
            }
        } catch (error) {
            console.error("Error fetching dashboard data:",error)
        }
    }

    const handleAddEmployee = async (e) => {
        e.preventDefault()


        console.log("FORM DATA:", addEmployee);

        const roleIdInt = parseInt(addEmployee.role_id);
        if (!roleIdInt) {
          alert("Please select a valid role.");
          return;
        }

        setLoading(true)
        try {
            const response = await fetch("http://localhost:3300/employees/create",{
              method: "POST",
              headers:{"Content-Type":"application/json"},
              body: JSON.stringify({
                name:addEmployee.name,
                email:addEmployee.email,
                password:addEmployee.password,
                role_id: parseInt(addEmployee.role_id)
              })
            })
            if (response.ok){
              alert("Employee created successfully!")
              setShowAddPopup(false)
              setAddEmployee({
                name:'',
                email:'',
                password:'',
                role_id:''
              })

              fetchDashboardData();
            }else {
              const errorMsg = await response.text();
            alert("Failed to create employee: " + errorMsg);
            }
        } catch (error) {
          console.error("Connection Error:", error);
          alert("Connection Error")
        } finally {
          setLoading(false)
        }
    }

    const fetchActivities = async () => {
      try {
        const res = await fetch("http://localhost:3300/activities")
        const data = await res.json()
        setActivities(data)
      } catch (err) {
        console.error("Activity fetch error",err)
      }
    }

  return (
    <div className="h-screen w-full bg-[#F6E7BC] p-4 flex flex-col overflow-hidden font-sans">
      <header className="flex justify-between items-center mb-4 px-2">
        <h1 className="text-2xl font-black text-[#0B2D72] tracking-tight">
          ABC Company <span className="font-light text-[#0992C2]">| Leave Management</span>
        </h1>
        <div className="flex gap-3">
           <button 
          onClick={() => navigate('/employee')}
          className="bg-white text-[#0B2D72] px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 border-[#0B2D72] hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        <button 
          onClick={() => setShowAddPopup(true)}
          className="bg-[#0B2D72] text-white text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-[#0AC4E0] hover:text-[#0B2D72] transition-all shadow-lg flex items-center gap-2 border-b-4 border-black/20"
        >
         + Add Employee
        </button>

        </div>
       
      </header>

      {showAddPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2D72]/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border-b-[10px] border-[#0AC4E0] overflow-hidden transform transition-all scale-100">
                  
                  {/* Modal Header */}
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <div>
                          <h2 className="text-xl font-black text-[#0B2D72] tracking-tighter">Add Employee</h2>                          
                      </div>
                      <button 
                          onClick={() => setShowAddPopup(false)} 
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                          <span className="text-2xl font-light">&times;</span>
                      </button>
                  </div>

                  {/* Form Body */}
                  <form onSubmit={handleAddEmployee} className="p-6 space-y-5">
                      
                      {/* Full Name */}
                      <div className="space-y-1">
                          <label className="text-[12px] font-black text-gray-400 ml-1">Full Name</label>
                          <input 
                              type="text" 
                              required 
                              placeholder="e.g. Michael Scott"
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0AC4E0] focus:bg-white outline-none transition-all placeholder:text-gray-300"
                              value={addEmployee.name}
                              onChange={(e) => setAddEmployee({...addEmployee, name: e.target.value})}
                          />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                          <label className="text-[12px] font-black text-gray-400 ml-1">Email</label>
                          <input 
                              type="email" 
                              required 
                              placeholder="m.scott@company.com"
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0AC4E0] focus:bg-white outline-none transition-all placeholder:text-gray-300"
                              value={addEmployee.email}
                              onChange={(e) => setAddEmployee({...addEmployee, email: e.target.value})}
                          />
                      </div>

                      {/* Password */}
                      <div className="space-y-1">
                          <label className="text-[12px] font-black text-gray-400 ml-1">Password</label>
                          <input 
                              type="password" 
                              required 
                              placeholder="••••••••"
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0AC4E0] focus:bg-white outline-none transition-all"
                              value={addEmployee.password}
                              onChange={(e) => setAddEmployee({...addEmployee, password: e.target.value})}
                          />
                      </div>
                      {/* Dropdown */}
                      <div className="space-y-1">
                          <label className="text-[12px] font-black text-gray-400 ml-1">Role</label>
                          <div className="relative">
                            <select
                              required
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0AC4E0] focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                              value={addEmployee.role_id || ""}
                              onChange={(e) =>
                                setAddEmployee({ ...addEmployee, role_id: e.target.value })
                              }
                            >
                              <option value="">Select Role</option>

                              {stats.roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.title}
                                </option>
                              ))}
                            </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#0B2D72]">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                              </div>
                          </div>
                      </div>

                      {/*Buttons */}
                     <div className="flex gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={() => setShowAddPopup(false)}
                            className="flex-1 bg-gray-100 text-gray-500 font-black py-4 rounded-xl hover:bg-gray-200 uppercase tracking-widest text-[10px] transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 bg-[#0B2D72] text-white font-black py-4 rounded-xl hover:bg-[#0AC4E0] hover:text-[#0B2D72] transition-all uppercase tracking-widest text-[12px] border-b-4 border-black/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                        >
                            {loading ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : "Create"}
                        </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      <div className="flex-1 grid grid-cols-4 grid-rows-3 gap-4 h-full">
        {/* total staff */}
        <div className="col-span-1 bg-[#0B2D72] rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 text-white">
          <h3 className="text-[10px] uppercase tracking-[0.2em] opacity-70 mb-1 font-bold">Total Staff</h3>
          <p className="text-5xl font-black">{stats.totalEmployees}</p>
        </div>
        {/* pending request */}
        <div className="col-span-1 bg-[#0AC4E0] rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 text-[#0B2D72]">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80 mb-1">Pending</h3>
          <p className="text-5xl font-black">{stats.pendingLeaves}</p>
        </div>

       {/* staff activity */}
        <div className="col-span-2 row-span-2 bg-white rounded-3xl shadow-xl p-6 flex flex-col">
          <h2 className="text-lg font-bold text-[#0B2D72] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0AC4E0] animate-pulse"></span>
            Recent Staff Activity
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar text-sm">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-[#F6E7BC]/30 transition-colors">
                <div className="w-4 h-4 bg-[#0B2D72] rounded-lg"></div>
                <div>
                  <p className="font-bold text-gray-800">
                    {activity.name} leave {activity.status.toLowerCase()}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* approved request */}
        <div className="col-span-1 bg-[#0992C2] rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 text-white">
          <h3 className="text-[10px] uppercase tracking-[0.2em] opacity-80 mb-1 font-bold">Approved</h3>
          <p className="text-5xl font-black">{stats.approvedLeaves}</p>
        </div>
        {/* rejected request */}
        <div className="col-span-1 bg-white border-2 border-[#0B2D72]/10 rounded-2xl shadow-sm flex flex-col items-center justify-center p-4 text-center">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1 text-[#0B2D72]">Rejected</h3>
          <p className="text-5xl font-black text-[#0B2D72] ">{stats.rejectedLeaves}</p>
        </div>

       {/* role based employee status */}
        <div className="col-span-4 row-span-1 grid grid-cols-6 gap-3">
          {stats.roles && stats.roles.map((role, index) => (
            <div key={index} className="bg-white rounded-2xl p-3 shadow-md flex flex-col justify-between">
              <h4 className="font-bold text-[#0B2D72] text-[11px] truncate uppercase tracking-tight">{role.title}</h4>
              
              <div className="flex flex-col mt-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-black text-[#0B2D72]">{role.active}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Active</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className={`text-lg font-black ${role.onLeave > 0 ? 'text-[#0AC4E0]' : 'text-gray-200'}`}>
                    {role.onLeave}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Away</span>
                </div>
              </div>

              <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i < (role.active/10) ? 'bg-[#0992C2]' : 'bg-gray-100'}`}></div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;