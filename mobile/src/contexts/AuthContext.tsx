import { createContext, ReactNode } from "react";

export interface UserProps {
    name: string;
    avatarURL: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    signIn: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}
export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }) {

    async function signIn() {
        console.log('Entrou')
    }

    return (
        <AuthContext.Provider value={{
            signIn,
            user: {
                name: 'Gabriele',
                avatarURL: 'https://github.com/berubel.png'
            }
        }}>
            {children}
        </AuthContext.Provider>
    )
}