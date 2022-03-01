/*
  Functions used to work with Event related data
*/

// Get a db connection
import { Supabase } from './supabase.js';


// Get all events as a list (array) of Event Objects
// Also replace the Computer id with name in each event
// orderCol and asc params have default values - used if parms are missing.
//
async function getAllEvents(orderCol= 'timestamp', asc = false) {

    // define variable to store events
    let events;

    // execute request
    // Note await in try/catch block
    try {
      // Query the database
      const result = await Supabase
        .from('events') // from the evnts table
        .select('*, computers(name)') // select all (from events) and computer name
        .order(orderCol, { ascending: asc }); // order results, default is timestamp

      // read event data from the result
      events = await result.data;
      //console.log('events: ', result.data);

      // Catch and log errors to server side console
    } catch (error) {
      console.log("Supabase Error - get all events: ", error.message);
    } finally {
    }
    // return all products found
    return events;
}

//
// Get a single event by id
//
async function getEventById(id) {

  // to do: validate id

  // define variable to store events
  let event;

  // execute request
  // Note await in try/catch block
  try {
    // Execute the query
    const result = await Supabase
      .from('events')
      .select('*, computers(name)')
      .eq('id', id)
      .order('timestamp', { ascending: false });

    // first element of the recordset contains products
    event = await result.data;
    //console.log('events: ', result.data);

    // Catch and log errors to server side console
  } catch (error) {
    console.log("Supabase Error - get all events: ", error.message);
  } finally {
  }
  // return all products found
  return event;
}

// Get events for a computer, by its id
//
async function getEventByCompId(id) {

  // to do: validate id

  // define variable to store events
  let events;

  // execute db query
  try {
    // Execute the query
    const result = await Supabase
      .from('events') // select from events
      .select('*, computers(name)') // * from events and name from computers
      .eq('computer_id', id) // where computer_id == id
      .order('timestamp', { ascending: false }); // order by timestamp

    // first element of the recordset contains products
    events = await result.data;
    //console.log('events: ', result.data);

    // Catch and log errors to server side console
  } catch (error) {
    console.log("Supabase Error - get all events: ", error.message);
  } finally {
  }
  // return all products found
  return events;
}

// Find events using a text search
// https://supabase.com/docs/reference/javascript/textsearch
// https://supabase.com/docs/reference/javascript/using-filters
async function searchFilter(search) {
  // define variable to store events
  let events;

  // execute request
  try {
    // Execute the query
    const result = await Supabase
      .from('events') // from events
      .select('*, computers(name)') // select all and computers.name
      .textSearch('description', `'${search}'`) // filter result where description contains the search term
      .order('timestamp', { ascending: false }); // sort by timestamp

    // get data from result
    events = await result.data;
    //console.log('events: ', result.data);

    // Catch and log errors to server side console
  } catch (error) {
    console.log("Supabase Error - get all events: ", error.message);
  } finally {
  }
  // return all events found
  return events;
}

// Export
export {
  Supabase,
  getAllEvents,
  getEventById,
  getEventByCompId,
  searchFilter

};
