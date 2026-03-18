import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, School, CameraAlt } from "@mui/icons-material";
import useAuthStore from "../../store/authStore.js";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    username: "", email: "", password: "", confirmPassword: "",
    role: "student", department: "", year: 1, enrollment_no: "", designation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords don't match");
    }
    setLoading(true);
    try {
      await register(form);
      toast.success("Welcome to CampusLink! 🎓");
      navigate("/home");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 relative overflow-hidden py-8">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-600/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        {/* Logo */}
        <div className="text-center mb-6 animate-slide-down">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl mb-3 shadow-glow">
            <School className="text-white" style={{ fontSize: 28 }} />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Join CampusLink</h1>
          <p className="text-dark-200 mt-1 text-sm">Create your campus profile</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-glass animate-slide-up">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm" onClick={clearError}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-1">Username</label>
                <input name="username" value={form.username} onChange={onChange} required
                  placeholder="johndoe" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-1">Role</label>
                <select name="role" value={form.role} onChange={onChange}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm">
                  <option value="student" className="bg-dark-700">Student</option>
                  <option value="faculty" className="bg-dark-700">Faculty</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-100 mb-1">College Email</label>
              <input type="email" name="email" value={form.email} onChange={onChange} required
                placeholder="you@campus.edu" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-100 mb-1">Department</label>
              <input name="department" value={form.department} onChange={onChange}
                placeholder="Computer Science" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm" />
            </div>

            {form.role === "student" ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-100 mb-1">Year</label>
                  <select name="year" value={form.year} onChange={onChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm">
                    {[1,2,3,4,5].map(y => <option key={y} value={y} className="bg-dark-700">Year {y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-100 mb-1">Enrollment No.</label>
                  <input name="enrollment_no" value={form.enrollment_no} onChange={onChange}
                    placeholder="CS2023001" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-1">Designation</label>
                <input name="designation" value={form.designation} onChange={onChange}
                  placeholder="Professor" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={onChange} required
                    placeholder="Min 6 chars" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-dark-200 hover:text-white">
                    {showPassword ? <VisibilityOff style={{ fontSize: 18 }} /> : <Visibility style={{ fontSize: 18 }} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-1">Confirm</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={onChange} required
                  placeholder="Confirm" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary-600/25 mt-2">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-dark-200 text-sm">
              Already have an account?{" "}
              <Link to="/" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
