/*
  Functions used to work with Computer related data
*/

// Get a db connection by importing supabase.js which sets it up
import { Supabase } from './supabase.js';

// Function to get all events from supabase
//
async function getAllComputers() {

    // 1. define variable to store events
    let computers;

    // 1. execute query to get computers
    try {
      // 2. store result
      const result = await Supabase
        .from('computers') // select data from the computers table
        .select('*') // all columns
        .order('name', { ascending: true }); // sort by name

      // 3. Read data from the result
      computers = await result.data;

      // Catch and log errors to server side console
    } catch (error) {
      console.log("Supabase Error - get all events: ", error.message);
    } finally {
    }
    // 4. return all computers found
    return computers;
}

// Export functions for import elsewhere
export {
  getAllComputers
};
