

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, User, Settings, Zap } from "lucide-react";

const navigationItems = [
  {
    title: "Discover",
    url: createPageUrl("Home"),
    icon: Zap,
  },
  {
    title: "Matches", 
    url: createPageUrl("Matches"),
    icon: Heart,
  },
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: User,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
      <style>{`
        :root {
          --primary-purple: #a855f7; /* purple-500 */
          --dark-navy: #1a1d29;
          --glass-bg: rgba(255, 255, 255, 0.08);
          --glass-border: rgba(255, 255, 255, 0.12);
        }
        
        .glass-effect {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
        }
        
        .swipe-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
          backdrop-filter: blur(20px);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4);
        }
      `}</style>
      
      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        {children}
      </main>

      {/* iOS-style Tab Bar - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden">
        <div className="glass-effect border-t border-white/10 px-4 py-2">
          <div className="flex justify-around items-center">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'text-purple-400 scale-110' 
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'drop-shadow-lg' : ''}`} />
                  <span className="text-xs font-medium">{item.title}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-72 glass-effect border-r border-white/10 p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Swipe Match</h1>
            <p className="text-sm text-white/60">AI-Powered Recruiting</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop Content Area */}
      <div className="hidden md:block ml-72">
        {children}
      </div>
    </div>
  );
}

