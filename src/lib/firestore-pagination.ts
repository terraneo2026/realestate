import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  getCountFromServer,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { firestore } from './firebase';

export interface PaginationResult<T> {
  data: T[];
  total: number;
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export interface PaginationOptions {
  collectionName: string;
  pageSize: number;
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  filters?: QueryConstraint[];
}

/**
 * Robust Firestore Server-Side Pagination
 */
export async function getPaginatedData<T>(options: PaginationOptions): Promise<PaginationResult<T>> {
  const { 
    collectionName, 
    pageSize, 
    lastVisible = null, 
    orderByField = 'createdAt', 
    orderDirection = 'desc',
    filters = [] 
  } = options;

  const collectionRef = collection(firestore, collectionName);
  
  // 1. Get total count for the filtered query
  const countQuery = query(collectionRef, ...filters);
  const countSnapshot = await getCountFromServer(countQuery);
  const total = countSnapshot.data().count;

  // 2. Build the paginated query
  const queryConstraints: QueryConstraint[] = [
    ...filters,
    orderBy(orderByField, orderDirection),
    limit(pageSize)
  ];

  if (lastVisible) {
    queryConstraints.push(startAfter(lastVisible));
  }

  const q = query(collectionRef, ...queryConstraints);
  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as unknown as T[];

  const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  const hasMore = querySnapshot.docs.length === pageSize;

  return {
    data,
    total,
    lastVisible: newLastVisible,
    hasMore
  };
}
