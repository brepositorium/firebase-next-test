// app/api/event/route.ts
import { db } from '../../../firebase/clientApp';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import Cors from 'cors';

// Initialize the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],  // Allow only GET and HEAD methods through CORS
  origin: '*',               // Adjust this to list specific origins or use '*' to allow all
});

// Helper function to run middleware
function runMiddleware(request: NextRequest, fn: any) {
  return new Promise((resolve, reject) => {
    fn(request, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export async function GET(request: NextRequest) {
    // Run the CORS middleware
    await runMiddleware(request, cors);

    const eventName = request.nextUrl.searchParams.get('eventName');
    
    if (!eventName) {
        return new NextResponse(JSON.stringify({ error: 'Event name is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        const eventsCollection = collection(db, "events");
        const q = query(eventsCollection, where("name", "==", eventName));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return new NextResponse(JSON.stringify({ error: 'No event found with the specified name' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return new NextResponse(JSON.stringify(events), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error }), { // Better error handling
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
