import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GOOGLE_ACCESS_TOKEN } from "../js/token.js";
import { useAuth } from "../authen/auth";

function RedirectGoogleAuth() {
    const navigate = useNavigate();
    const { setIsAuthorized, setUser } = useAuth(); // optional: expose setUser in context if needed

    useEffect(() => {
        const handleRedirect = async () => {
            console.log("RedirectHandler mounted successfully");

            const queryParams = new URLSearchParams(window.location.search);
            const accessToken = queryParams.get('access_token');
            console.log("QueryParams: ", window.location.search);

            if (accessToken) {
                console.log("AccessToken found: ", accessToken);
                localStorage.setItem(GOOGLE_ACCESS_TOKEN, accessToken);

                try {
                    // Set header and verify token from your backend
                    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                    const response = await axios.get('https://asswadgroceries.onrender.com/api/auth/user/');
                    
                    console.log('User data:', response.data);
                    
                    // Optionally store ACCESS_TOKEN too
                    localStorage.setItem("access_token", accessToken);

                    // Mark user as authorized manually (skip checkAuth)
                    setIsAuthorized(true);
                    setUser(response.data); // for display purposes if needed
                    
                    // Clean URL
                    window.history.replaceState(null, '', window.location.pathname);

                    navigate('/');
                } catch (error) {
                    console.error('Error verifying token:', error.response ? error.response.data : error.message);
                    navigate('/login');
                }
            } else {
                console.log('No token found in URL');
                navigate('/login');
            }
        };

        handleRedirect();
    }, [navigate]);

    return <div>Logging In.........</div>;
}

export default RedirectGoogleAuth;
