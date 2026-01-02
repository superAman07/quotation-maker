import Link from "next/link";
import { User, ShieldCheck, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      
      {/* Employee Portal - Brand Green Theme */}
      <div className="flex-1 bg-[#3e482e] flex flex-col justify-center items-center p-8 md:p-16 text-white relative overflow-hidden group transition-all duration-500 ease-in-out hover:flex-[1.3]">
        {/* Background Pattern/Overlay */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="h-24 w-24 bg-white/10 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 border border-white/20">
            <User className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Quotation Maker</h2>
          <p className="text-gray-300 mb-10 text-lg leading-relaxed">
            Employee portal for creating, managing, and sending travel quotations to clients.
          </p>
          
          <Link 
            href="/user/auth/login"
            className="group/btn flex items-center gap-3 bg-white text-[#3e482e] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#f3f6ee] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Employee Login
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Admin Portal - Colorful Gradient Theme */}
      <div className="flex-1 bg-linear-to-br from-blue-600 via-purple-600 to-indigo-900 flex flex-col justify-center items-center p-8 md:p-16 text-white relative overflow-hidden group transition-all duration-500 ease-in-out hover:flex-[1.3]">
        {/* Background Pattern/Overlay */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="h-24 w-24 bg-white/10 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 border border-white/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Admin Console</h2>
          <p className="text-blue-100 mb-10 text-lg leading-relaxed">
            Administrative control panel for managing packages, destinations, and system settings.
          </p>
          
          <Link 
            href="/admin/auth/login"
            className="group/btn flex items-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Admin Access
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  );
}