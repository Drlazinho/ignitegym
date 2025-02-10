import { UserDTO } from "@dtos/UserDTO";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../service/api";
import { storageUserGet, storageUserRemove, storageUserSave } from '@storage/storageUser'
import { storageAuthTokenSave } from '@storage/storageAuthToken'

export type AuthContextDataProps = {
  user: UserDTO;
  singIn: (email: string, password: string) => void;
  signOut: () => Promise<void>;
  isLoadingUserStorage: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorage, setIsLoadingUserStorage] = useState(true);

  async function storageUserAndToken(userData: UserDTO, token: string){
    try {
      setIsLoadingUserStorage(true)

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      await storageUserSave(userData);
      await storageAuthTokenSave(token);
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorage(false)
    }

  }

  async function singIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });
      console.log(data);
      if (data.user && data.token) {
        setUser(data.user);
        storageUserAndToken(data.user, data.token)
      }
    } catch (error) {
        throw error
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorage(true);
      setUser({} as UserDTO);
      await storageUserRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorage(false);
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet();
      if(userLogged) {
        setUser(userLogged)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorage(false)
     }
  
  }
  
  useEffect(() => {
    loadUserData()
  },[])


  return (
    <AuthContext.Provider
      value={{
        user,
        singIn,
        signOut,
        isLoadingUserStorage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
