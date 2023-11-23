import React from 'react';
import { useUser } from '../contexts/UserContext';

const UserProfile = () => {
  const { user, setUser } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      {/* other user details */}
    </div>
  );
};

export default UserProfile;
