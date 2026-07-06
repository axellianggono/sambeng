/**
 * Seed Script — Truncate semua koleksi Firestore lalu isi dengan data dummy.
 *
 * Jalankan dengan:  npx tsx scripts/seed-firestore.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc, setDoc, deleteDoc } from 'firebase/firestore';

// Hardcode firebase config karena script ini berjalan di luar Next.js (tidak bisa pakai process.env dari .env.local)
import * as fs from 'fs';
import * as path from 'path';

// Parse .env.local
function loadEnv(): Record<string, string> {
  const envPath = path.resolve(__dirname, '..', '.env.local');
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

// Import dummy data
import {
  dummyProfile,
  dummyOrganizations,
  dummyOrganizationDetails,
  dummyUMKM,
  dummyProducts,
  dummyNews,
} from '../src/lib/dummy-data';

// ==========================================
// Helper: hapus semua dokumen dalam koleksi
// ==========================================
async function truncateCollection(collectionName: string) {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);

  if (snapshot.empty) {
    console.log(`  ⏭  ${collectionName} — sudah kosong`);
    return;
  }

  const batch = writeBatch(db);
  snapshot.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });
  await batch.commit();
  console.log(`  🗑  ${collectionName} — ${snapshot.size} dokumen dihapus`);
}

// ==========================================
// Main seed function
// ==========================================
async function seed() {
  console.log('');
  console.log('══════════════════════════════════════════');
  console.log('  🔥 Firestore Seed Script');
  console.log(`  📦 Project: ${env['NEXT_PUBLIC_FIREBASE_PROJECT_ID']}`);
  console.log('══════════════════════════════════════════');
  console.log('');

  // ---- STEP 1: Truncate ----
  console.log('📋 STEP 1: Truncate semua koleksi...');
  const collections = ['profile', 'organizations', 'organization_details', 'umkm', 'products', 'news', 'settings', 'messages'];
  for (const col of collections) {
    await truncateCollection(col);
  }
  console.log('');

  // ---- STEP 2: Seed Profile ----
  console.log('📋 STEP 2: Seed data dummy...');

  // Profile
  await setDoc(doc(db, 'profile', 'village'), dummyProfile);
  console.log('  ✅ profile/village — 1 dokumen');

  // Contact settings
  const defaultContactInfo = {
    address: 'Sambeng, Kelurahan Ngalang, Kapanewon Gedangsari, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta 55861',
    phone: '6281234567890',
    email: 'info@sambeng.desa.id',
  };
  await setDoc(doc(db, 'settings', 'contact'), defaultContactInfo);
  console.log('  ✅ settings/contact — 1 dokumen');

  // Organizations
  const orgBatch = writeBatch(db);
  dummyOrganizations.forEach((org) => {
    orgBatch.set(doc(db, 'organizations', org.id), org);
  });
  await orgBatch.commit();
  console.log(`  ✅ organizations — ${dummyOrganizations.length} dokumen`);

  // Organization Details (members/bagan)
  const detailBatch = writeBatch(db);
  dummyOrganizationDetails.forEach((m) => {
    detailBatch.set(doc(db, 'organization_details', m.id), m);
  });
  await detailBatch.commit();
  console.log(`  ✅ organization_details — ${dummyOrganizationDetails.length} dokumen`);

  // UMKM
  const umkmBatch = writeBatch(db);
  dummyUMKM.forEach((u) => {
    umkmBatch.set(doc(db, 'umkm', u.id), u);
  });
  await umkmBatch.commit();
  console.log(`  ✅ umkm — ${dummyUMKM.length} dokumen`);

  // Products
  const prodBatch = writeBatch(db);
  dummyProducts.forEach((p) => {
    prodBatch.set(doc(db, 'products', p.id), p);
  });
  await prodBatch.commit();
  console.log(`  ✅ products — ${dummyProducts.length} dokumen`);

  // News
  const newsBatch = writeBatch(db);
  dummyNews.forEach((n) => {
    newsBatch.set(doc(db, 'news', n.id), n);
  });
  await newsBatch.commit();
  console.log(`  ✅ news — ${dummyNews.length} dokumen`);

  console.log('');
  console.log('══════════════════════════════════════════');
  console.log('  🎉 Selesai! Semua data dummy berhasil di-seed ke Firestore.');
  console.log('══════════════════════════════════════════');
  console.log('');

  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed gagal:', err);
  process.exit(1);
});
