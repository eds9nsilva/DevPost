import React, {useState, createContext, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  uid: string;
  nome: string;
  email: string | null;
}


interface Context {
  signed: boolean;
  signUp: (email: string, password: string, name: string) => void;
  singIn: (email: string, password: string) => void;
  loadingAuth: boolean;
  signOut: () => void;
  storageUser: (data: User | null) => void;
  loading: boolean;
  user: User;
}


export const AuthContext = createContext({} as Context);

function AuthProvider({children}) {
  const [user, setUser] = useState<User | null>();
  const [loadingAuth, setLoadingAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadStorage() {
      const storageUser = await AsyncStorage.getItem('@devApp');

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    }

    loadStorage();
  }, []);

  async function signUp(email: string, password: string, name: string) {
    setLoadingAuth(true);
    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async value => {
        let uid = value.user.uid;
        await firestore()
          .collection('users')
          .doc(uid)
          .set({
            nome: name,
            createAt: new Date(),
          })
          .then(() => {
            let data = {
              uid: uid,
              nome: name,
              email: value.user.email,
            };
            setUser(data);
            setLoadingAuth(false);
          });
      })
      .catch(error => {
        console.log(error);
        setLoadingAuth(false);
      });
  }

  async function singIn(email: string, password: string) {
    setLoadingAuth(true);
    await auth()
      .signInWithEmailAndPassword(email, password)
      .then(async value => {
        let uid = value.user.uid;
        const userProfile = await firestore()
          .collection('users')
          .doc(uid)
          .get();

        let data = {
          uid: uid,
          nome: userProfile.data().nome,
          email: value.user.email,
        };
        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
      })
      .catch(error => {
        console.log(error);
        setLoadingAuth(false);
      });
  }

  async function storageUser(data: User | null) {
    await AsyncStorage.setItem('@devApp', JSON.stringify(data));
  }

  async function signOut() {
    await auth().signOut();
    await AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        signUp,
        singIn,
        loadingAuth,
        signOut,
        storageUser,
        loading,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
