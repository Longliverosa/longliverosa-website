import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../config/firebase';
import './Sign-up.css'

import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { app as firebaseApp } from '../config/firebase';

const db = getFirestore(firebaseApp);

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!inviteCode.trim()) {
      setError('Invite code is required.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }

    setLoading(true);

    try {
      // Check invite code validity and usage
      const inviteQuery = query(
        collection(db, 'inviteCodes'),
        where('code', '==', inviteCode.trim().toUpperCase()),
        where('used', '==', false)
      );
      const querySnapshot = await getDocs(inviteQuery);

      if (querySnapshot.empty) {
        setError('Invalid or already used invite code.');
        setLoading(false);
        return;
      }

      // Check if invite code is less than 24 hours old
      const inviteDoc = querySnapshot.docs[0];
      const inviteData = inviteDoc.data();
      const createdAt = inviteData.createdAt;
      let createdAtDate = null;
      if (createdAt && typeof createdAt.toDate === 'function') {
        createdAtDate = createdAt.toDate();
      } else if (createdAt instanceof Date) {
        createdAtDate = createdAt;
      } else if (typeof createdAt === 'number') {
        createdAtDate = new Date(createdAt);
      }

      if (!createdAtDate) {
        setError('Invite code is missing creation time. Please request a new code.');
        setLoading(false);
        return;
      }

      const now = new Date();
      const diffMs = now - createdAtDate;
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours > 24) {
        setError('Invite code has expired (over 24 hours old). Please request a new code.');
        setLoading(false);
        return;
      }

      // Proceed with user creation
      await createUserWithEmailAndPassword(auth, email, password);

      // Mark invite code as used
      await updateDoc(doc(db, 'inviteCodes', inviteDoc.id), { used: true });

      alert('User created successfully');
      setUsername('');
      setEmail('');
      setInviteCode('');
      setPassword('');
      setConfirmPassword('');
      setTermsAccepted(false);
    } catch (error) {
      setError(error.message || 'Failed to create user.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-bg">
      <h2>Register your Account</h2>
      <form onSubmit={handleCreateUser}>
        <div>
          <label htmlFor='username'>Name</label>
          <input
            type='text'
            id='username'
            name='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete='username'
          />
        </div>

        <div>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete='email'
          />
        </div>

        <div>
          <label htmlFor='invite_code'>Invite Code</label>
          <input
            type='text'
            id='invite_code'
            name='invite_code'
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            autoComplete='off'
          />
        </div>

        <div>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='new-password'
          />
        </div>

        <div>
          <label htmlFor='confirm_password'>
            Confirm Password
          </label>
          <input
            type='password'
            id='confirm_password'
            name='confirm_password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete='new-password'
          />
        </div>

        {error && (
          <div style={{ color: 'red', marginTop: '8px' }}>
            {error}
          </div>
        )}

        <button type='submit' disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;