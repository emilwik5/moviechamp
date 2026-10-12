'use client'
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/clientApp";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

const FormattedUser = () => {
  const [user, loading, error] = useAuthState(auth);
  const [hasFriendRequests, setHasFriendRequests] = useState(false);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.friendRequests && userData.friendRequests.length > 0) {
            setHasFriendRequests(true);
          }
        }
      }
    };

    fetchFriendRequests();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-full h-full">
      {user ? (
        // Om användaren e inloggad så visa förnamn + profilbild
        <>
          <Link href={`/profile/${user.uid}`} className="h-full w-full flex flex-row gap-4 justify-center items-center uppercase">
            <h1>{user.displayName?.split(' ')[0]}</h1>
            <div className="relative">
              {hasFriendRequests && (
                // Om användaren har friend requests så lägg till en liten röd pulserande grejsimojs
                <>
                  <div className="absolute animate-ping bg-amber-500 ring-2 ring-amber-300 rounded-full w-2 h-2 right-[1%] top-1"></div>
                  <div className="absolute bg-amber-500 ring-2 ring-amber-300 rounded-full w-2 h-2 right-[1%] top-1"></div>
                </>
              )}
              <img src={user.photoURL ?? ""} alt={user.displayName ?? ""} className="rounded-full w-10 h-10" />
            </div>
          </Link>
        </>
      ) : (
        // If user inte är inloggad låt dem logga in
        <Link href="/login" className="flex justify-center items-center w-full h-full">
          <h1>LOG IN</h1>
        </Link>
      )}
    </div>
  );
};

export default FormattedUser;
