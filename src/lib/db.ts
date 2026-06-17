import { collection, getDocs, doc, getDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import {
  DEFAULT_SETTINGS,
  DEFAULT_ORGANISATIONS,
  DEFAULT_UMKM,
  DEFAULT_NEWS,
  DEFAULT_EVENTS,
  SystemSettings,
  Organization,
  UMKMItem,
  NewsItem,
  EventItem,
} from "./data-defaults";

// Helper to convert Firestore timestamp or string date to standard ISO string
export function formatFirestoreDate(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val.toDate === "function") {
    return val.toDate().toISOString();
  }
  if (val.seconds) {
    return new Date(val.seconds * 1000).toISOString();
  }
  return new Date(val).toISOString();
}

export async function getSettings(): Promise<SystemSettings> {
  try {
    const docRef = doc(db, "settings", "beranda");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...DEFAULT_SETTINGS, ...docSnap.data() } as SystemSettings;
    }
  } catch (err) {
    console.error("Firestore settings load failed, using defaults:", err);
  }
  return DEFAULT_SETTINGS;
}

export async function getOrganizations(): Promise<Organization[]> {
  try {
    const colRef = collection(db, "organizations");
    const querySnapshot = await getDocs(colRef);
    if (!querySnapshot.empty) {
      const orgs: Organization[] = [];
      querySnapshot.forEach((docSnap) => {
        orgs.push({ id: docSnap.id, ...docSnap.data() } as Organization);
      });
      return orgs;
    }
  } catch (err) {
    console.error("Firestore organizations load failed, using defaults:", err);
  }
  return DEFAULT_ORGANISATIONS;
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  try {
    const colRef = collection(db, "organizations");
    const q = query(colRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as Organization;
    }
  } catch (err) {
    console.error(`Firestore org by slug ${slug} failed:`, err);
  }
  
  // Search in default fallback
  const defaultOrg = DEFAULT_ORGANISATIONS.find((o) => o.slug === slug);
  return defaultOrg || null;
}

export async function getUMKM(): Promise<UMKMItem[]> {
  try {
    const colRef = collection(db, "umkm");
    const querySnapshot = await getDocs(colRef);
    if (!querySnapshot.empty) {
      const items: UMKMItem[] = [];
      querySnapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as UMKMItem);
      });
      return items;
    }
  } catch (err) {
    console.error("Firestore UMKM load failed, using defaults:", err);
  }
  return DEFAULT_UMKM;
}

export async function getUMKMById(id: string): Promise<UMKMItem | null> {
  try {
    const docRef = doc(db, "umkm", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as UMKMItem;
    }
  } catch (err) {
    console.error(`Firestore UMKM by id ${id} failed:`, err);
  }
  const defaultItem = DEFAULT_UMKM.find((u) => u.id === id);
  return defaultItem || null;
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const colRef = collection(db, "news");
    const q = query(colRef, where("status", "==", "published"), orderBy("publishedAt", "desc"));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const items: NewsItem[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          ...data,
          publishedAt: formatFirestoreDate(data.publishedAt),
        } as NewsItem);
      });
      return items;
    }
  } catch (err) {
    console.error("Firestore news load failed, trying unordered fallback:", err);
    try {
      const colRef = collection(db, "news");
      const q = query(colRef, where("status", "==", "published"));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const items: NewsItem[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            ...data,
            publishedAt: formatFirestoreDate(data.publishedAt),
          } as NewsItem);
        });
        // Sort in memory instead
        return items.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
      }
    } catch (e) {
      console.error("Fallback news load failed:", e);
    }
  }
  return DEFAULT_NEWS;
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const colRef = collection(db, "news");
    const q = query(colRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        publishedAt: formatFirestoreDate(data.publishedAt),
      } as NewsItem;
    }
  } catch (err) {
    console.error(`Firestore news by slug ${slug} failed:`, err);
  }
  const defaultItem = DEFAULT_NEWS.find((n) => n.slug === slug);
  return defaultItem || null;
}

export async function getEvents(): Promise<EventItem[]> {
  try {
    const colRef = collection(db, "events");
    const q = query(colRef, where("isVisible", "==", true), orderBy("startDate", "asc"));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const items: EventItem[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          ...data,
          startDate: formatFirestoreDate(data.startDate),
          endDate: formatFirestoreDate(data.endDate),
        } as EventItem);
      });
      return items;
    }
  } catch (err) {
    console.error("Firestore events load failed, trying unordered fallback:", err);
    try {
      const colRef = collection(db, "events");
      const q = query(colRef, where("isVisible", "==", true));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const items: EventItem[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            ...data,
            startDate: formatFirestoreDate(data.startDate),
            endDate: formatFirestoreDate(data.endDate),
          } as EventItem);
        });
        return items.sort((a, b) => a.startDate.localeCompare(b.startDate));
      }
    } catch (e) {
      console.error("Fallback events load failed:", e);
    }
  }
  return DEFAULT_EVENTS;
}
