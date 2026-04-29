import React, { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const allowedRoles = ['superadmin', 'admin', 'teacher'];

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState('');

  const getFriendlyError = (err) => {
    console.error('Error Firebase completo:', err.code, err.message);

    if (err.code === 'auth/invalid-credential') {
      return 'Credenciales inválidas. Revisa correo y contraseña.';
    }

    if (err.code === 'auth/user-disabled') {
      return 'Este usuario está deshabilitado en Firebase.';
    }

    if (err.code === 'auth/network-request-failed') {
      return 'Error de conexión. Revisa internet o Firebase.';
    }

    if (err.code === 'auth/too-many-requests') {
      return 'Demasiados intentos fallidos. Espera unos minutos.';
    }

    return `${err.code || 'error'} - ${err.message || 'Error desconocido'}`;
  };

  const validateUserAccess = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await signOut(auth);
      return {
        ok: false,
        message: 'Tu cuenta existe en Authentication, pero no está registrada en Firestore.',
      };
    }

    const userData = userSnap.data();

    const isAuthorized =
      userData.active === true &&
      allowedRoles.includes(userData.role);

    if (!isAuthorized) {
      await signOut(auth);
      return {
        ok: false,
        message: `Usuario no autorizado. Rol actual: ${userData.role || 'sin rol'} / active: ${String(userData.active)}`,
      };
    }

    return {
      ok: true,
      userData,
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCheckingAuth(false);
        return;
      }

      try {
        const result = await validateUserAccess(user);

        if (!result.ok) {
          setError(result.message);
          setCheckingAuth(false);
          return;
        }

        window.location.href = '/';
      } catch (err) {
        console.error('Error validando usuario:', err);
        setError(getFriendlyError(err));
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Debes ingresar correo y contraseña.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const result = await validateUserAccess(cred.user);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      window.location.href = '/';
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-5"
      >
        <div className="text-center">
          <h1 className="text-xl font-black uppercase tracking-wider text-slate-800">
            Acceso de Gestión
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Colegio Italiano San Pedro
          </p>
        </div>

        <input
          type="email"
          placeholder="Correo institucional"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 rounded-2xl bg-slate-50 border outline-none"
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 rounded-2xl bg-slate-50 border outline-none"
          autoComplete="current-password"
        />

        {error && (
          <div className="text-sm text-red-600 font-bold text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black uppercase disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}