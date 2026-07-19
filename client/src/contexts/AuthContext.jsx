
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true, // same as fetch's credentials: 'include'
});
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [appError, setAppError] = useState(null)
  const [popError, setPopError] = useState(null)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async ({ username, password }) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      if (res.data.status === 200) {
        setUser(res.data.user);
        return navigate('/raffle-admin');
      }
      return res.data;
    } catch (err) {
      return { error: err.response?.data?.message || 'Login failed' };
    }
  };

  const deleteUser = async () => {
    try {
      const res = await api.post('/auth/delete_user');
      setUser(null);
      navigate('/login');
    } catch (err) {
      setAppError(err)
    }
  }
  
  const logout = async () => {
    try {
      const res = await api.post('/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (err) {
      setAppError(err)
    }
  };
  
  const register = async ({ name, email, password }) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data.status === 201) {
        setUser(res.data.user);
        navigate('/raffle-admin');
      }
      return res.data;
    } catch (err) {
      return { error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const linkAccount =  async (email, fbId) => {
    try {
      const res = await api.post("/auth/link-account", {email, facebookId: fbId})
      if (res.data.status === 200) {
        setUser(res.data.user);
        navigate('/raffle-admin');
      }
    } catch (error) {
      setAppError(error)
    }
  }

  const sendRecoveryEmail = async (email) => {
    const res = await api.post('/auth/generate-password-token', {email})
    console.log(res)
    return res;
  }


  const connectDomain = async (domain) => {
    try {
      console.log(domain, user._id, "hi")
      const res = await api.post('/api/domains', {domain, userId: user._id});
      return res.data;
    } catch (err) {
      console.log(err)
      return { error: err.response?.data?.message || 'Connection failed' };
    }
  };


  const verifyCNAME = async (domain) => {
    try {
      const res = await api.post('/api/domains/verify/cname', {domain});
      return res.data;
    } catch (err) {
      return { error: err.response?.data?.message || 'Connection failed' };
    }
  };

  const domainDisconnect = async (domain) => {
    try {
      await api.post('/api/domains/disconnect', {domainId: domain._id });
    } catch (err) {
      return { error: err.response?.data?.message || 'Connection failed' };
    }
  };

  // const pollHostname = async (domain) => {
  //   try {
  //     const res = await api.post('/api/domains/poll_hostname_status', {hostnameId: domain.hostnameId});
  //     return res.data;
  //   } catch (err) {
  //     return { error: err.response?.data?.message || 'Connection failed' };
  //   }
  // };
  
  const save = async (user) => {
    try {
      const res = await api.post('/auth/save_settings', user);
      return res.data;
    } catch (err) {
      return { error: err.response?.data?.message || 'Save failed' };
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider 
      value={{ user, login, logout, register, save, setUser, connectDomain, verifyCNAME, appError, setAppError, domainDisconnect, popError, setPopError, deleteUser, linkAccount, sendRecoveryEmail}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
