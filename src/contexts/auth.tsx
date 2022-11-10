import React, {useState, createContext} from 'react';

interface Context {
  signed: boolean;
}

export const AuthContext = createContext({} as Context);

function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{signed: !!user}}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
