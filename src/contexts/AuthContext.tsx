import { UserDTO } from "@dtos/UserDTO";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../service/api";
import { storageUserGet, storageUserRemove, storageUserSave } from '@storage/storageUser'
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from '@storage/storageAuthToken'

export type AuthContextDataProps = {
  user: UserDTO;
  singIn: (email: string, password: string) => void;
  signOut: () => Promise<void>;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
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

  async function userAndTokenUpdate(userData: UserDTO, token: string){
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData);
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
    try {
      setIsLoadingUserStorage(true)
      await storageUserSave(userData);
      await storageAuthTokenSave({token, refresh_token});

    } catch(error) {
      throw error;
    } finally {
      setIsLoadingUserStorage(false)
    }
 
  }

  async function singIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });

      if (data.user && data.token && data.refresh_token) {
        await storageUserAndTokenSave(data.user, data.token, data.refresh_token);
        userAndTokenUpdate(data.user, data.token)
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
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorage(false);
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated);
      await storageUserSave(userUpdated);
    } catch (error) {
      throw error;
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorage(true);

      const userLogged = await storageUserGet();
      const {token} = await storageAuthTokenGet();

      if(token && userLogged) {
        userAndTokenUpdate(userLogged, token);
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

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);

    return () => {
      subscribe();
    }
  },[])


  return (
    <AuthContext.Provider
      value={{
        user,
        singIn,
        signOut,
        updateUserProfile,
        isLoadingUserStorage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
