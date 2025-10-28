import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (isSignUp) {
        response = await supabase.auth.signUp({ email, password });
      } else {
        response = await supabase.auth.signInWithPassword({ email, password });
      }

      if (response.error) {
        throw response.error;
      }

      if (isSignUp && response.data.user) {
        alert('회원가입이 완료되었습니다. 이메일을 확인하여 계정을 활성화해주세요.');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`w-1/2 py-3 text-center text-base font-medium transition-colors duration-200 focus:outline-none -mb-px ${
        active
          ? 'text-black border-b-2 border-black'
          : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mx-auto">
      <div className="flex border-b border-gray-200">
        <TabButton active={!isSignUp} onClick={() => setIsSignUp(false)}>로그인</TabButton>
        <TabButton active={isSignUp} onClick={() => setIsSignUp(true)}>회원가입</TabButton>
      </div>

      <form onSubmit={handleAuthAction} className="space-y-6 mt-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="input-field w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-field w-full"
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '처리 중...' : (isSignUp ? '회원가입' : '로그인')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;