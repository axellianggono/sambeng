import { auth, db } from './firebase';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from './dummy-data';

// ==========================================
// 1. LOGIN / LOGOUT
// ==========================================

/**
 * Login admin menggunakan Firebase Auth (Email + Password).
 * Setelah berhasil, ambil data profil admin dari koleksi Firestore `admin_users/{uid}`.
 * Jika profil belum ada di Firestore (misal user baru pertama kali), buat profil default.
 */
export async function loginAdmin(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = credential.user;

  // Cek apakah user punya profil di Firestore
  const profileRef = doc(db, 'admin_users', firebaseUser.uid);
  const profileSnap = await getDoc(profileRef);

  if (profileSnap.exists()) {
    return profileSnap.data() as User;
  }

  // Buat profil default untuk user baru
  const defaultProfile: User = {
    id: firebaseUser.uid,
    email: firebaseUser.email || email,
    name: firebaseUser.displayName || email.split('@')[0],
    role: 'SUPER_ADMIN', // User pertama diberi Super Admin
    permissions: ['MANAGE_PROFIL', 'MANAGE_ORGANISASI', 'MANAGE_UMKM', 'MANAGE_BERITA'],
    createdAt: new Date().toISOString(),
  };
  await setDoc(profileRef, defaultProfile);
  return defaultProfile;
}

/**
 * Logout admin dari Firebase Auth.
 */
export async function logoutAdmin(): Promise<void> {
  await firebaseSignOut(auth);
}

// ==========================================
// 2. AUTH STATE OBSERVER
// ==========================================

/**
 * Mengamati perubahan status autentikasi Firebase.
 * Mengembalikan profil User dari Firestore jika sudah login, atau null jika belum.
 */
export function onAdminAuthStateChanged(
  callback: (user: User | null) => void
): () => void {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    try {
      const profileRef = doc(db, 'admin_users', firebaseUser.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        callback(profileSnap.data() as User);
      } else {
        // User terautentikasi tapi belum punya profil di Firestore
        callback(null);
      }
    } catch (err) {
      console.error('Gagal memuat profil admin dari Firestore:', err);
      callback(null);
    }
  });

  return unsubscribe;
}
