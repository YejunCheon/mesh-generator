import React from 'react';
import { supabase } from '../../lib/supabaseClient';

const Profile: React.FC = () => {
  return (
    <div>
      <h2>Profile</h2>
      <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </div>
  );
};

export default Profile;