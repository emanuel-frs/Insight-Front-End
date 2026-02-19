import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { setAuthToken } from "../services/api";
import { authService } from "../services/authService";

interface AuthContextData {
  token: string | null;
  isLoading: boolean;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const TOKEN_KEY = "@insight:token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false); // ← enquanto false, app não redireciona

  // Recupera token salvo ao iniciar o app
  useEffect(() => {
    async function loadToken() {
      try {
        const saved = await AsyncStorage.getItem(TOKEN_KEY);
        if (saved) {
          setToken(saved);
          setAuthToken(saved);
        }
      } finally {
        setIsReady(true);
      }
    }
    loadToken();
  }, []);

  async function saveToken(t: string) {
    setToken(t);
    setAuthToken(t);
    await AsyncStorage.setItem(TOKEN_KEY, t);
  }

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      await saveToken(response.data.token);
    } finally {
      setIsLoading(false);
    }
  }

  async function register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    setIsLoading(true);
    try {
      await authService.register(data);
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });
      await saveToken(response.data.token);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setToken(null);
    setAuthToken(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  return (
    <AuthContext.Provider
      value={{ token, isLoading, isReady, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
