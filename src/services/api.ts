import { firestore, collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter } from './firebase';
import { DocumentData, DocumentReference, QueryConstraint, QueryDocumentSnapshot, DocumentSnapshot, WithFieldValue } from 'firebase/firestore';

/**
 * CollectionName type represents all available collections in Firestore
 */
export type CollectionName = 'users' | 'venues' | 'bookings' | 'payments' | 'reviews' | 'review_reports';

/**
 * Generic API service for Firestore operations
 */
export class FirestoreAPI {
  /**
   * Get a reference to a collection
   * @param collectionName - The name of the collection
   * @returns A reference to the collection
   */
  static getCollection(collectionName: CollectionName) {
    return collection(firestore, collectionName);
  }

  /**
   * Get a document reference by ID
   * @param collectionName - The name of the collection
   * @param id - The document ID
   * @returns A reference to the document
   */
  static getDocRef(collectionName: CollectionName, id: string) {
    return doc(firestore, collectionName, id);
  }

  /**
   * Create a new document in a collection
   * @param collectionName - The name of the collection
   * @param data - The data to store in the document
   * @returns A promise that resolves to the new document reference
   */
  static async create<T extends DocumentData>(collectionName: CollectionName, data: WithFieldValue<T>) {
    try {
      const docRef = await addDoc(collection(firestore, collectionName), data);
      return docRef;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Create a document with a specific ID
   * @param collectionName - The name of the collection
   * @param id - The document ID
   * @param data - The data to store in the document
   * @returns A promise that resolves when the document is created
   */
  static async createWithId<T extends DocumentData>(
    collectionName: CollectionName, 
    id: string, 
    data: WithFieldValue<T>
  ) {
    try {
      const docRef = doc(firestore, collectionName, id);
      await updateDoc(docRef, data);
      return docRef;
    } catch (error) {
      console.error(`Error creating document with ID in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get a document by ID
   * @param collectionName - The name of the collection
   * @param id - The document ID
   * @returns A promise that resolves to the document data
   */
  static async getById<T>(collectionName: CollectionName, id: string): Promise<T | null> {
    try {
      const docRef = doc(firestore, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting document by ID from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update a document by ID
   * @param collectionName - The name of the collection
   * @param id - The document ID
   * @param data - The data to update in the document
   * @returns A promise that resolves when the document is updated
   */
  static async update<T extends DocumentData>(
    collectionName: CollectionName, 
    id: string, 
    data: Partial<T>
  ) {
    try {
      const docRef = doc(firestore, collectionName, id);
      await updateDoc(docRef, data as DocumentData);
      return docRef;
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document by ID
   * @param collectionName - The name of the collection
   * @param id - The document ID
   * @returns A promise that resolves when the document is deleted
   */
  static async delete(collectionName: CollectionName, id: string) {
    try {
      const docRef = doc(firestore, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Query documents in a collection
   * @param collectionName - The name of the collection
   * @param constraints - The query constraints
   * @returns A promise that resolves to an array of documents
   */
  static async query<T>(
    collectionName: CollectionName, 
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    try {
      const collectionRef = collection(firestore, collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      const documents: T[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() } as T);
      });
      
      return documents;
    } catch (error) {
      console.error(`Error querying documents from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Paginate through documents in a collection
   * @param collectionName - The name of the collection
   * @param constraints - The query constraints
   * @param pageSize - The number of documents to fetch
   * @param lastDocument - The last document from the previous page
   * @returns A promise that resolves to an object containing the documents and the last document
   */
  static async paginate<T>(
    collectionName: CollectionName,
    constraints: QueryConstraint[] = [],
    pageSize: number = 10,
    lastDocument?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ documents: T[], lastDocument?: QueryDocumentSnapshot<DocumentData> }> {
    try {
      const collectionRef = collection(firestore, collectionName);
      
      let queryConstraints = [...constraints, limit(pageSize)];
      if (lastDocument) {
        queryConstraints.push(startAfter(lastDocument));
      }
      
      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      const documents: T[] = [];
      let lastDoc: QueryDocumentSnapshot<DocumentData> | undefined;
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() } as T);
        lastDoc = doc;
      });
      
      return { 
        documents, 
        lastDocument: lastDoc 
      };
    } catch (error) {
      console.error(`Error paginating documents from ${collectionName}:`, error);
      throw error;
    }
  }
} 