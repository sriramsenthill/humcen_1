import React, { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = () => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem('token');
          
          if (!token) {
            // Redirect to login page if token is not found
            router.push('/authentication/sign-in');
            return;
          }

          // Verify the token with the backend
          const response = await axios.get('http://localhost:3000/api/partner/verify-token', {
            headers: { Authorization: token },
          });

          if (response.status !== 200) {
            // Token verification failed, redirect to login page
            router.push('/authentication/sign-in');
          }
        } catch (error) {
          console.error('Failed to verify token:', error);
          // Redirect to login page on error
          router.push('/authentication/sign-in');
        }
      };

      checkAuth();
    }, []);

    return <WrappedComponent />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
