import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

interface HeaderProps {
  onSignInClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSignInClick }) => {
  const { session, user, profile } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-end items-center h-16">
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm font-medium text-gray-700">{profile?.username || user?.email}</span>
                <button 
                  onClick={handleLogout} 
                  className="btn-secondary text-sm px-3 py-1.5"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={onSignInClick} 
                  className="btn-primary text-sm px-3 py-1.5"
                >
                  로그인 / 회원가입
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;