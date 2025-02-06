import { UserDTO } from "@dtos/UserDTO";
import { createContext, ReactNode, useState } from "react";
import { api } from "../service/api";

export type AuthContextDataProps = {
  user: UserDTO;
  singIn: (email: string, password: string) => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);

  async function singIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });

      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
        throw error
    }
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        singIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
