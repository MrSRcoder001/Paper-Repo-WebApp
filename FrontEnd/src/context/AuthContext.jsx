import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('pv_access_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Helper to persist auth state
  const setSession = (token, userData) => {
    if (token) {
      setAccessToken(token);
      localStorage.setItem('pv_access_token', token);
      localStorage.setItem('pv_token', token);
    }
    if (userData) {
      const mergedData = { xpPoints: 1250, ...userData };
      setUser(mergedData);
      localStorage.setItem('user', JSON.stringify(mergedData));
      localStorage.setItem('userRole', mergedData.role || 'student');
    }
  };

  // Helper to partially update logged-in user data (e.g. XP points)
  const updateUser = (partialUserData) => {
    setUser(prev => {
      const updated = { ...(prev || {}), ...partialUserData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  // Clear auth state locally
  const clearSession = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('pv_access_token');
    localStorage.removeItem('pv_token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  }, []);

  // Silent refresh check on app mount for persistent login
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.post('/auth/refresh-token');
      if (res.data?.success && res.data?.accessToken) {
        setSession(res.data.accessToken, res.data.user);
      }
    } catch (err) {
      // If silent refresh fails and we have no stored user/token, clear local storage
      if (!localStorage.getItem('pv_access_token')) {
        clearSession();
      }
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    checkAuth();

    // Listen for unauthorized events triggered by axios interceptor
    const handleUnauthorized = () => {
      clearSession();
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [checkAuth, clearSession]);

  // Login handler
  const login = async (username, password, rememberMe = false) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { username, password, rememberMe });
      
      if (res.data?.success) {
        setSession(res.data.accessToken, res.data.user);
        toast.success(`Welcome back, ${res.data.user.name || res.data.user.username}!`);
        return { success: true, user: res.data.user };
      } else {
        toast.error(res.data?.message || 'Login failed');
        return { success: false, message: res.data?.message };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Server connection error during login';
      toast.error(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', userData);
      
      if (res.data?.success) {
        setSession(res.data.accessToken, res.data.user);
        toast.success(res.data.message || 'Account created successfully!');
        return { 
          success: true, 
          user: res.data.user, 
          verificationCode: res.data.verificationCode 
        };
      } else {
        toast.error(res.data?.message || 'Registration failed');
        return { success: false, message: res.data?.message };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Server connection error during registration';
      toast.error(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Login
  const loginWithGoogle = async (googlePayload = {}) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/google', googlePayload);
      
      if (res.data?.success) {
        setSession(res.data.accessToken, res.data.user);
        toast.success(`Logged in with Google as ${res.data.user.name}!`);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Google authentication failed';
      toast.error(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Email Verification
  const verifyEmail = async (email, code) => {
    try {
      const res = await api.post('/auth/verify-email', { email, code });
      if (res.data?.success) {
        if (res.data.user) {
          setSession(accessToken, res.data.user);
        }
        toast.success('Email address verified successfully!');
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Email verification failed';
      toast.error(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Resend Verification Code
  const resendVerificationCode = async (email) => {
    try {
      const res = await api.post('/auth/resend-verification', { email });
      if (res.data?.success) {
        toast.success(`Verification code sent to ${email}`);
        return { success: true, verificationCode: res.data.verificationCode };
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code');
      return { success: false };
    }
  };

  // Logout from Current Device
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      clearSession();
      toast.success('Logged out successfully');
    }
  };

  // Logout from ALL Devices
  const logoutAll = async () => {
    try {
      await api.post('/auth/logout-all');
      toast.success('Logged out from all active devices');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Logout from all devices failed');
    } finally {
      clearSession();
    }
  };

  // Fetch Active Sessions
  const getSessions = async () => {
    try {
      const res = await api.get('/auth/sessions');
      return res.data?.sessions || [];
    } catch (err) {
      toast.error('Failed to fetch active sessions');
      return [];
    }
  };

  // Revoke Specific Session
  const revokeSession = async (sessionId) => {
    try {
      const res = await api.delete(`/auth/sessions/${sessionId}`);
      if (res.data?.success) {
        toast.success('Session revoked');
        return true;
      }
    } catch (err) {
      toast.error('Failed to revoke session');
    }
    return false;
  };

  // Quick Demo Login helper for UI previewing
  const quickDemoLogin = (role = 'student') => {
    const demoUser = {
      id: `demo_${role}_123`,
      name: role === 'admin' ? 'Super Admin' : role === 'faculty' ? 'Prof. Sharma' : 'Satish Rathod',
      username: role === 'admin' ? 'admin' : role === 'faculty' ? 'faculty' : 'satish',
      email: `${role}@papervault.edu`,
      role: role,
      isEmailVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      university: 'SPPU',
      college: 'Pune Engineering College',
      branch: 'Computer Engineering'
    };
    setSession('demo-jwt-access-token-2026', demoUser);
    toast.success(`Logged in as ${role.toUpperCase()} (Demo Mode)`);
    return demoUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        isAuthenticated: !!user,
        role: user?.role || 'student',
        login,
        register,
        loginWithGoogle,
        verifyEmail,
        resendVerificationCode,
        logout,
        logoutAll,
        getSessions,
        revokeSession,
        quickDemoLogin,
        checkAuth,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
