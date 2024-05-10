"use client"
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { firebase, auth } from '../firebase/clientApp';
import { useRouter } from 'next/navigation';


export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<null | { email: string }>(null);
  const navigation = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && !user.emailVerified) {
        alert("Please verify your email to access this feature.");
        navigation.push('/'); 
        signOut(auth);
      } else if (user && user.emailVerified) {
        setUser({ email: user.email as string });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.emailVerified) {
        navigation.push('/test');
      } else {
        alert('Please verify your email first.');
        await signOut(auth);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleSignUp = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      alert('Verification email sent. Please check your email.');
      await signOut(auth);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
  <>
  {user ? (
        <div>
          Signed in as {user.email}
          <button className="btn" onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <>
        <button className="btn" onClick={() => {
          if (document) {
          (document.getElementById('signInModal') as HTMLFormElement).showModal();
          }
        }}>
          Sign in
        </button>
        <button className="btn" onClick={() => {
          if (document) {
          (document.getElementById('signUpModal') as HTMLFormElement).showModal();
          }
        }}>
          Sign up
        </button>
          <dialog id="signInModal" className="modal">
          <div className="modal-box">
          <form>
              <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          />
              <button className='btn mt-2' onClick={handleSignIn}>
                  Sign in
              </button>
              </form>
          </div>
          <form method="dialog" className="modal-backdrop">
              <button>close</button>
          </form>
          </dialog>
          <dialog id="signUpModal" className="modal">
          <div className="modal-box">
          <form>
              <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          />
              <button className='btn mt-2' onClick={handleSignUp}>
                  Sign up
              </button>
              </form>
          </div>
          <form method="dialog" className="modal-backdrop">
              <button>close</button>
          </form>
          </dialog>
          </>
      )}
  </>
  );
}
