import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try{
            const response = await fetch('http://localhost:3300/login',{
                method: 'POST',
                headers:{'Content-Type' : 'application/json'},
                body: JSON.stringify({email,password})
            })

            const data = await response.json();

            if(response.ok){
                localStorage.setItem('employee_id',data.employee_id);
                localStorage.setItem('role_id',data.role_id);
                navigate('/employee');                
            } else{
                setError(data.message || 'Invalid email or password');
            }
        } catch (err) {
            setError('Server Connection failed.')
        }finally{
            setLoading(false)
        }
    }
    
  return (    
    <div className="min-h-screen flex items-center justify-center bg-[#F6E7BC]">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-b-8 border-[#0B2D72]">
        
        <h2 className="text-3xl font-black text-center text-[#0B2D72] mb-2 tracking-tight">
          ABC Company
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 uppercase tracking-tighter">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label 
              htmlFor="email" 
              className="block text-xs font-bold uppercase tracking-wider text-[#0B2D72] mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"   
              onChange={(e) => setEmail(e.target.value)}           
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0AC4E0] focus:border-[#0AC4E0] outline-none transition-all bg-gray-50 text-[#0B2D72]"
              placeholder="admin@abccompany.com"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-xs font-bold uppercase tracking-wider text-[#0B2D72] mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0AC4E0] focus:border-[#0AC4E0] outline-none transition-all bg-gray-50 text-[#0B2D72]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B2D72] text-white font-black py-4 px-4 rounded-xl hover:bg-[#0992C2] focus:ring-4 focus:ring-[#0AC4E0]/30 transition-all duration-300 shadow-lg uppercase tracking-widest text-sm"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login