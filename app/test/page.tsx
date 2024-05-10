"use client"
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebase/clientApp'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

interface Event {
    id: string;
    name: string;
    description: string;
    website: string;
    location: string;
    numberOfTickets: number;
    userId: string;
}

const page = () => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [location, setLocation] = useState('');
    const [numberOfTickets, setNumberOfTickets] = useState(0);
    const [events, setEvents] = useState<Event[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const fetchEvents = async () => {
                    const q = query(collection(db, "events"), where("userId", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    const eventsArray = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data() as Omit<Event, 'id'>
                    }));
                    console.log(eventsArray)
                    setEvents(eventsArray);
                    setLoading(false);
                };

                fetchEvents();
            } else {
                setLoading(false);
                alert('Not authenticated');
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!auth.currentUser) {
        alert('Not authenticated');
        return;
    }
    try {
        await addDoc(collection(db, "events"), {
            name: name,
            description: description,
            website: website,
            location: location,
            numberOfTickets: numberOfTickets,
            userId: auth.currentUser.uid
        });
        alert('Event added successfully!');
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

  return (
    <>
    <div>
        Signed in {auth.currentUser?.email}
    </div>
    <div className='flex-col justify-around bg-base-100 pt-14 pl-14'>
        <div className='mb-8'>
            <h1 className='font-mono text-xl font-bold'>
                Add event
            </h1>
        </div>
        <form>
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input input-bordered w-full max-w-md"
                />
            </div>
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="input input-bordered w-full max-w-md"
                />
            </div>
            <div className="mt-4">
                <input
                    type="url"
                    placeholder="Website"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    className="input input-bordered w-full max-w-md"
                />
            </div>
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="input input-bordered w-full max-w-md"
                />
            </div>
            <div className="mt-4">
                <input
                    type="number"
                    placeholder="Number of Tickets"
                    value={numberOfTickets}
                    onChange={e => setNumberOfTickets(parseInt(e.target.value))}
                    className="input input-bordered w-full max-w-md"
                />
            </div>
            <div className="py-4">
                <button type="button" className="btn" onClick={handleSubmit}>Submit</button>
            </div>
        </form>
    </div> 
    <div>
        Your events:

        {events.map((event) => (
                <div key={event.id}>
                    <h2>{event.name}</h2>
                    <p>{event.description}</p>
                    <p>{event.website}</p>
                    <p>{event.location}</p>
                    <p>Tickets: {event.numberOfTickets}</p>
                </div>
            ))}
    </div>
    </>
  )
}

export default page