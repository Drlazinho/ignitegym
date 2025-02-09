import { UserDTO } from "@dtos/UserDTO";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../service/api";
import { storageUserGet, storageUserSave } from '@storage/storageUser'

export type AuthContextDataProps = {
  user: UserDTO;
  singIn: (email: string, password: string) => void;
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

  async function singIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });

      if (data.user) {
        setUser(data.user);
        storageUserSave(data.user)
      }
    } catch (error) {
        throw error
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
        isLoadingUserStorage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
