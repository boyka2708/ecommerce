// lib/purchaseHistory.ts

import { db } from "@/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

interface PurchaseHistoryEntry {
  id: string;                // The Firestore document ID (session ID)
  timestamp: Timestamp;      // The timestamp of the purchase
  items: {                  // Object representing purchased items and quantities
    [productId: string]: number; 
  };
  total: number;             // The total amount of the purchase (in the smallest currency unit)
  formdata: {                // Form data submitted during checkout
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    // Add other form fields as needed
  };
}

export async function getPurchaseHistory(userId: string): Promise<PurchaseHistoryEntry[]> {
  const historyRef = collection(db, "users", userId, "history");
  const q = query(historyRef, orderBy("timestamp", "desc")); 

  const querySnapshot = await getDocs(q);
  const purchaseHistory: PurchaseHistoryEntry[] = [];
  querySnapshot.forEach((doc) => {
    purchaseHistory.push({ id: doc.id, ...doc.data() } as PurchaseHistoryEntry);
  });

  return purchaseHistory;
}
