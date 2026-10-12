// src/app/profile/[userId]/page.js
import React from 'react';
import UserProfile from './UserProfile';

const ProfilePage = async ({ params }) => {
  const { userId } = params;

  return <UserProfile userId={userId} />;
};

export default ProfilePage;
