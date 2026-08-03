import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create custom Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send HTTP-only cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pv_access_token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Silent Token Refresh on 401 Expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh loop for login/register/logout calls
    const isAuthRoute = originalRequest.url.includes('/auth/login') ||
                        originalRequest.url.includes('/auth/register') ||
                        originalRequest.url.includes('/auth/refresh-token') ||
                        originalRequest.url.includes('/auth/logout');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data?.success && refreshResponse.data?.accessToken) {
          const newToken = refreshResponse.data.accessToken;
          localStorage.setItem('pv_access_token', newToken);

          if (refreshResponse.data?.user) {
            localStorage.setItem('user', JSON.stringify(refreshResponse.data.user));
          }

          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

          processQueue(null, newToken);
          return api(originalRequest);
        } else {
          throw new Error('Refresh failed');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('pv_access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        // Dispatch event or let AuthContext handle state reset
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
