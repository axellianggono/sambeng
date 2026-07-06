import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
} from 'firebase/firestore';
import {
  dummyProfile,
  dummyOrganizations,
  dummyOrganizationDetails,
  dummyUMKM,
  dummyProducts,
  dummyNews,
  VillageProfile,
  Organization,
  OrganizationDetail,
  UMKM,
  Product,
  News,
  User,
} from './dummy-data';

// ==========================================
// 1. VILLAGE PROFILE FUNCTIONS
// ==========================================
export async function getVillageProfile(): Promise<VillageProfile> {
  try {
    const profileRef = doc(db, 'profile', 'village');
    const docSnap = await getDoc(profileRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as VillageProfile;
    } else {
      // Seed initial data
      await setDoc(profileRef, dummyProfile);
      return dummyProfile;
    }
  } catch (error) {
    console.error('Error fetching village profile from Firestore:', error);
    return dummyProfile;
  }
}

export async function saveVillageProfile(profile: VillageProfile): Promise<void> {
  const profileRef = doc(db, 'profile', 'village');
  await setDoc(profileRef, profile);
}

// ==========================================
// 2. ORGANIZATIONS & MEMBERS FUNCTIONS
// ==========================================
export async function getOrganizations(): Promise<Organization[]> {
  try {
    const orgsCol = collection(db, 'organizations');
    const qSnapshot = await getDocs(orgsCol);
    
    if (qSnapshot.empty) {
      // Seed organizations
      const batch = writeBatch(db);
      dummyOrganizations.forEach((org) => {
        const docRef = doc(orgsCol, org.id);
        batch.set(docRef, org);
      });
      await batch.commit();
      return dummyOrganizations;
    }

    const list: Organization[] = [];
    qSnapshot.forEach((doc) => {
      list.push(doc.data() as Organization);
    });
    return list;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return dummyOrganizations;
  }
}

export async function saveOrganization(org: Organization): Promise<void> {
  const docRef = doc(db, 'organizations', org.id);
  await setDoc(docRef, org);
}

export async function deleteOrganization(orgId: string): Promise<void> {
  // Delete the organization
  const docRef = doc(db, 'organizations', orgId);
  await deleteDoc(docRef);

  // Delete all members inside this organization
  const detailsCol = collection(db, 'organization_details');
  const q = query(detailsCol, where('orgId', '==', orgId));
  const qSnapshot = await getDocs(q);
  
  const batch = writeBatch(db);
  qSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}

export async function getOrganizationDetails(): Promise<OrganizationDetail[]> {
  try {
    const detailsCol = collection(db, 'organization_details');
    const qSnapshot = await getDocs(detailsCol);
    
    if (qSnapshot.empty) {
      // Seed organization details
      const batch = writeBatch(db);
      dummyOrganizationDetails.forEach((member) => {
        const docRef = doc(detailsCol, member.id);
        batch.set(docRef, member);
      });
      await batch.commit();
      return dummyOrganizationDetails;
    }

    const list: OrganizationDetail[] = [];
    qSnapshot.forEach((doc) => {
      list.push(doc.data() as OrganizationDetail);
    });
    return list;
  } catch (error) {
    console.error('Error fetching organization details:', error);
    return dummyOrganizationDetails;
  }
}

export async function saveOrganizationDetailsForOrg(orgId: string, updatedMembers: OrganizationDetail[]): Promise<void> {
  // Delete existing members for this organization first
  const detailsCol = collection(db, 'organization_details');
  const q = query(detailsCol, where('orgId', '==', orgId));
  const qSnapshot = await getDocs(q);

  const batch = writeBatch(db);
  qSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Save new/updated members
  const saveBatch = writeBatch(db);
  updatedMembers.forEach((m) => {
    const docRef = doc(detailsCol, m.id);
    saveBatch.set(docRef, m);
  });
  await saveBatch.commit();
}

// ==========================================
// 3. UMKM & PRODUCTS FUNCTIONS
// ==========================================
export async function getUMKMs(): Promise<UMKM[]> {
  try {
    const umkmCol = collection(db, 'umkm');
    const qSnapshot = await getDocs(umkmCol);
    
    if (qSnapshot.empty) {
      // Seed UMKM
      const batch = writeBatch(db);
      dummyUMKM.forEach((u) => {
        const docRef = doc(umkmCol, u.id);
        batch.set(docRef, u);
      });
      await batch.commit();
      return dummyUMKM;
    }

    const list: UMKM[] = [];
    qSnapshot.forEach((doc) => {
      list.push(doc.data() as UMKM);
    });
    return list;
  } catch (error) {
    console.error('Error fetching UMKM:', error);
    return dummyUMKM;
  }
}

export async function saveUMKM(umkm: UMKM): Promise<void> {
  const docRef = doc(db, 'umkm', umkm.id);
  await setDoc(docRef, umkm);
}

export async function deleteUMKM(umkmId: string): Promise<void> {
  // Delete the business
  const docRef = doc(db, 'umkm', umkmId);
  await deleteDoc(docRef);

  // Delete all products inside this business
  const prodCol = collection(db, 'products');
  const q = query(prodCol, where('umkmId', '==', umkmId));
  const qSnapshot = await getDocs(q);
  
  const batch = writeBatch(db);
  qSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}

export async function getProducts(): Promise<Product[]> {
  try {
    const prodCol = collection(db, 'products');
    const qSnapshot = await getDocs(prodCol);
    
    if (qSnapshot.empty) {
      // Seed products
      const batch = writeBatch(db);
      dummyProducts.forEach((p) => {
        const docRef = doc(prodCol, p.id);
        batch.set(docRef, p);
      });
      await batch.commit();
      return dummyProducts;
    }

    const list: Product[] = [];
    qSnapshot.forEach((doc) => {
      list.push(doc.data() as Product);
    });
    return list;
  } catch (error) {
    console.error('Error fetching products:', error);
    return dummyProducts;
  }
}

export async function saveProduct(product: Product): Promise<void> {
  const docRef = doc(db, 'products', product.id);
  await setDoc(docRef, product);
}

export async function deleteProduct(productId: string): Promise<void> {
  const docRef = doc(db, 'products', productId);
  await deleteDoc(docRef);
}

// ==========================================
// 4. NEWS / BERITA FUNCTIONS
// ==========================================
export async function getNews(): Promise<News[]> {
  try {
    const newsCol = collection(db, 'news');
    const qSnapshot = await getDocs(newsCol);
    
    if (qSnapshot.empty) {
      // Seed news
      const batch = writeBatch(db);
      dummyNews.forEach((n) => {
        const docRef = doc(newsCol, n.id);
        batch.set(docRef, n);
      });
      await batch.commit();
      return dummyNews;
    }

    const list: News[] = [];
    qSnapshot.forEach((doc) => {
      list.push(doc.data() as News);
    });
    return list;
  } catch (error) {
    console.error('Error fetching news:', error);
    return dummyNews;
  }
}

export async function saveNewsItem(newsItem: News): Promise<void> {
  const docRef = doc(db, 'news', newsItem.id);
  await setDoc(docRef, newsItem);
}

export async function deleteNewsItem(newsId: string): Promise<void> {
  const docRef = doc(db, 'news', newsId);
  await deleteDoc(docRef);
}

// ==========================================
// 5. ADMIN USERS FUNCTIONS
// ==========================================
export async function getAdminUsers(): Promise<User[]> {
  try {
    const usersCol = collection(db, 'admin_users');
    const qSnapshot = await getDocs(usersCol);

    const list: User[] = [];
    qSnapshot.forEach((doc) => {
      list.push(doc.data() as User);
    });
    return list;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
}

export async function saveAdminUser(user: User): Promise<void> {
  const docRef = doc(db, 'admin_users', user.id);
  await setDoc(docRef, user);
}

export async function deleteAdminUser(userId: string): Promise<void> {
  const docRef = doc(db, 'admin_users', userId);
  await deleteDoc(docRef);
}

// ==========================================
// 6. CONTACT INFO & MESSAGES FUNCTIONS
// ==========================================
export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const defaultContactInfo: ContactInfo = {
  address: 'Sambeng, Kelurahan Ngalang, Kapanewon Gedangsari, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta 55861',
  phone: '6281234567890',
  email: 'info@sambeng.desa.id',
};

export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const docRef = doc(db, 'settings', 'contact');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as ContactInfo;
    } else {
      await setDoc(docRef, defaultContactInfo);
      return defaultContactInfo;
    }
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return defaultContactInfo;
  }
}

export async function saveContactInfo(info: ContactInfo): Promise<void> {
  const docRef = doc(db, 'settings', 'contact');
  await setDoc(docRef, info);
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const colRef = collection(db, 'messages');
    const qSnapshot = await getDocs(colRef);
    const list: ContactMessage[] = [];
    qSnapshot.forEach((doc) => {
      list.push(doc.data() as ContactMessage);
    });
    // Sort by newest first
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }
}

export async function saveContactMessage(msg: ContactMessage): Promise<void> {
  const docRef = doc(db, 'messages', msg.id);
  await setDoc(docRef, msg);
}

export async function deleteContactMessage(msgId: string): Promise<void> {
  const docRef = doc(db, 'messages', msgId);
  await deleteDoc(docRef);
}

