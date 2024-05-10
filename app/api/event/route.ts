import { db } from '../../../firebase/clientApp';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Manually set CORS headers
    const response = new NextResponse();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Content-Type', 'application/json');

    // Check for event name
    const eventName = request.nextUrl.searchParams.get('eventName');
    
    if (!eventName) {
        return response;
    }

    try {
        const eventsCollection = collection(db, "events");
        const q = query(eventsCollection, where("name", "==", eventName));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return response;
        }

        const events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return response;
    } catch (error) {
        return response;
    }
}
