/**
 * Clear Script — Menghapus semua data dummy dan menyisakan data kosong (blank template).
 *
 * Jalankan dengan:  npx tsx scripts/clear-firestore.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc, setDoc, deleteDoc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Parse .env.local
function loadEnv(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), '.env.local');
  const content = fs.readFileSync(envPath, 'utf-8');
  const vars: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    vars[key] = val;
  }
  return vars;
}

const env = loadEnv();

const firebaseConfig = {
  apiKey: env['NEXT_PUBLIC_FIREBASE_API_KEY'],
  authDomain: env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'],
  projectId: env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'],
  storageBucket: env['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: env['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'],
  appId: env['NEXT_PUBLIC_FIREBASE_APP_ID'],
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper: hapus semua dokumen dalam koleksi
async function truncateCollection(collectionName: string) {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  if (snapshot.empty) {
    console.log(`  ⏭  ${collectionName} — sudah kosong`);
    return;
  }

  const batch = writeBatch(db);
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log(`  🗑  ${collectionName} — ${snapshot.size} dokumen dihapus`);
}

async function run() {
  console.log('══════════════════════════════════════════');
  console.log('  🗑  Firestore Clear / Reset Script');
  console.log(`  📦 Project: ${env['NEXT_PUBLIC_FIREBASE_PROJECT_ID']}`);
  console.log('══════════════════════════════════════════');
  console.log('');

  // ---- STEP 1: Truncate ----
  console.log('📋 STEP 1: Mengosongkan database...');
  const collections = ['profile', 'organizations', 'organization_details', 'umkm', 'products', 'news', 'settings', 'messages'];
  for (const col of collections) {
    await truncateCollection(col);
  }
  console.log('');

  // ---- STEP 2: Seed Blank Templates ----
  console.log('📋 STEP 2: Menyiapkan template kosong (Blank)...');

  // Blank Village Profile
  const blankProfile = {
    description: 'Deskripsi profil padukuhan belum diisi. Silakan edit melalui CMS admin.',
    statistics: [],
    gallery: [],
    logoUrl: '',
    updatedAt: new Date().toISOString(),
  };
  await setDoc(doc(db, 'profile', 'village'), blankProfile);
  console.log('  ✅ profile/village — 1 dokumen (Blank)');

  // Blank Contact Info
  const blankContactInfo = {
    address: 'Alamat Balai Padukuhan belum diisi.',
    phone: '628',
    email: 'admin@desa.id',
  };
  await setDoc(doc(db, 'settings', 'contact'), blankContactInfo);
  console.log('  ✅ settings/contact — 1 dokumen (Blank)');

  console.log('');
  console.log('══════════════════════════════════════════');
  console.log('  🎉 Sukses! Semua data dummy telah dibersihkan.');
  console.log('  ✨ Sekarang website Anda siap diisi data real desa.');
  console.log('══════════════════════════════════════════');
}

run().catch(console.error);
