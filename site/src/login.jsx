import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth as importedAuth } from '../config/firebase';
import './login.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Use the same auth instance as admin panel expects
  const auth = importedAuth || getAuth();

  // Map Firebase error codes to user-friendly messages
  const getFriendlyError = (firebaseError) => {
    if (!firebaseError || !firebaseError.code) return 'Failed to sign in.';
    switch (firebaseError.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      default:
        return firebaseError.message || 'Failed to sign in.';
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to admin panel on successful login, passing auth if needed
      // If you use context or a global auth, this is sufficient.
      // If you want to pass auth explicitly, you could do:
      // navigate('/admin-panel', { state: { auth } });
      navigate('/admin-panel');
    } catch (error) {
      setError(getFriendlyError(error));
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <div style={{ color: 'red', marginTop: '8px' }}>
            {error}
          </div>
        )}

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;