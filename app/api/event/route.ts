import { db } from '../../../firebase/clientApp';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Check for event name
    const eventName = request.nextUrl.searchParams.get('eventName');
    
    if (!eventName) {
        return new NextResponse(JSON.stringify({ error: 'Event name is required' }), {
            status: 400,
            headers: new Headers({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }),
        });
    }

    try {
        const eventsCollection = collection(db, "events");
        const q = query(eventsCollection, where("name", "==", eventName));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return new NextResponse(JSON.stringify({ error: 'No event found with the specified name' }), {
                status: 404,
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }),
            });
        }

        const events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return new NextResponse(JSON.stringify(events), {
            status: 200,
            headers: new Headers({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }),
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error }), {
            status: 500,
            headers: new Headers({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }),
        });
    }
}
