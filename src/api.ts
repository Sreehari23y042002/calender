import axios from 'axios';

// Define the event interface based on your API response
export interface Event {
  user_det: any;
  job_id: any;
  id: number;
  title: string;
  start: string;  // Start as a string
  end: string;    // End as a string
  attendees?: string | null;
  status?: string | null;
  comment?: string | null;
  score?: { [key: string]: number };
  link: string;
}

export const fetchEvents = async () => {
  try {
    const response = await axios.get('https://mocki.io/v1/e622fd0d-d79c-4901-9113-3d95967e41e1');
    
    // Convert start and end strings to Date objects
    const eventsWithDateObjects = response.data.map((event: any) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    }));
    
    return eventsWithDateObjects; // Return the transformed events
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};
