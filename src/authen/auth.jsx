import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../js/api.js';
import { ACCESS_TOKEN, REFRESH_TOKEN, GOOGLE_ACCESS_TOKEN } from "../js/token.js";


// Create the AuthContext
const AuthContext = createContext({
    isAuthorized: false,
    user: null,
    login: () => {},
    logout: () => {},
});

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [user, setUser] = useState(null);

    // Function to check and validate token
    const checkAuth = async () => {
        // refreshToken();
        let token = localStorage.getItem(ACCESS_TOKEN);
        const googleAccessToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);
    
        let isGoogleLogin = false;
    
        if (!token && googleAccessToken) {
            token = googleAccessToken;
            isGoogleLogin = true;
        }
        
    
        console.log("Google Access Token: ", googleAccessToken);
        console.log("Access Token: ", token);
    
        if (token) {
            try {
                if (isGoogleLogin) {
                    // validate token and get user profile
                    const res = await api.get('/api/auth/user/', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
    
                    setIsAuthorized(true);
                    setUser(res.data);
                } else {
                    const decoded = jwtDecode(token);
                    const tokenExpiration = decoded.exp;
                    const now = Date.now() / 1000;
    
                    if (tokenExpiration < now) {
                        await refreshToken();
                    } else {
                        setIsAuthorized(true);
                        const userResponse = await api.get("/api/auth/user/");
                        setUser(userResponse.data);
                    }
                }
            } catch (error) {
                console.error('checkAuth failed:', error);
                logout();
            }
        } else {
            logout();
        }
    };
    
    // Refresh token method
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post('/api/token/refresh/', {
                refresh: refreshToken,
            });
            
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                const decoded = jwtDecode(res.data.access);
                setIsAuthorized(true);
                const userResponse = await api.get("/api/auth/user/");
                setUser(userResponse.data);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed', error);
            logout();
        }
        return false;
    };

    // Validate Google token
    const validateGoogleToken = async (googleAccessToken) => {
        try {
            const res = await api.post('/api/google/validate_token/', {
                access_token: googleAccessToken,
            });
            return res.data.valid;
        } catch (error) {
            console.error('Google token validation failed', error);
            return false;
        }
    };

    // Login method
    const login = async ({ username, password }) => {
        try {
          const response = await api.post("/api/token/", { username, password });
          const { access, refresh } = response.data;
      
          // Save tokens
          localStorage.setItem(ACCESS_TOKEN, access);
          localStorage.setItem(REFRESH_TOKEN, refresh);
          api.defaults.headers.Authorization = `Bearer ${access}`;
            

          // 🔥 Fetch user info
          const userResponse = await api.get("/api/auth/user/"); 
          const user = userResponse.data;
      
          setIsAuthorized(true);
          setUser(user);
          return true;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      };
      
    // Logout method
    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem(GOOGLE_ACCESS_TOKEN);
        setIsAuthorized(false);
        setUser(null);
    };

    // Check auth on mount and set up token refresh interval
    useEffect(() => {
        checkAuth();

        const interval = setInterval(() => {
            checkAuth();
        }, 5 * 60 * 1000); 

        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{ 
            isAuthorized, 
            user, 
            login, 
            logout, 
            refreshToken ,
            checkAuth,
            setIsAuthorized,  
            setUser   
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};