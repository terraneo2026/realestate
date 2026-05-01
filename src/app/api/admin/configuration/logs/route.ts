import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  startAfter 
} from "firebase/firestore";
import { withErrorHandling } from "@/lib/api-wrapper";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const pageSize = parseInt(searchParams.get('limit') || '20');
  const moduleFilter = searchParams.get('module');

  let q = query(
    collection(firestore, 'configuration_audit_logs'),
    orderBy('timestamp', 'desc'),
    limit(pageSize)
  );

  const snap = await getDocs(q);
  const logs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return NextResponse.json({ 
    success: true, 
    data: logs,
    total: logs.length // Simplified for now
  });
});
