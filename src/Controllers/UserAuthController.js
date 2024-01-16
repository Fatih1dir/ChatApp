import React from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();

export function useAuthentication() {
  const [user, setUser] = React.useState();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      }
      else{
        setUser(null);
        setLoading(false);
      }
    });

    return unsubscribeFromAuthStatuChanged;
  }, []);

  return {
    user,
    loading
  };
}