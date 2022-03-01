// Import dependencies
import * as eventData from "./dataAccess/eventData.js";
import * as compData from "./dataAccess/computerData.js";
/*
  Functions used to update the index page view
*/

// Display event objects in a table element
//
function displayEventList(events) {
  // Use the Array map method to iterate through the array of message documents
  // Each message will be formated as HTML table rows and added to the array
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  // Finally the output array is inserted as the content into the <tbody id="eventRows"> element.

  // page element where rows will be inserted
  const eventRows = document.getElementById("eventRows");


  const tableRows = events.map((event) => {
    // Get the styling object for this level - for use below
    // Note: the following is a template string, enclosed by `backticks` and not 'single quptes'
    // This allows ${JavaScript} to be added directl to the string if enclosed by ${ }
    // See https://wesbos.com/template-strings-html for more.

    const levelStyle = getAlertStyle(event.level);

    return `<tr class="${levelStyle.alert}">
          <td data-toggle="tooltip" title="id=${event.id}">
            <i class="${levelStyle.icon}"></i>
          <td>${event.type}</td>
          <td>${event.level}</td>
          <td>${new Date(event.timestamp).toISOString()}</td>
          <td>${event.service}</td>
          <td data-toggle="tooltip" title="computer_id=${event.computer_id}">${
      event.computers.name
    }</td>
          <td>${event.user}</td>
          <td>${event.description}</td>
      </tr>`;
  });

  // Add rows to the table body
  eventRows.innerHTML = tableRows.join("");
}

// 1. Parse JSON
// 2. Create computer links
// 3. Display in web page
//
function displayComputers(computers) {

  // Use the Array map method to iterate through the array of categories (in json format)
  const compLinks = computers.map((comp) => {

    // return a link button for each computer, setting attribute data-computer_id for the id
    // the data attribute is used instead of id as an id value can only be used once in the document
    // note the computer-link css class - used to identify the buttons (used later)
    return `<button data-computer_id="${comp.id}" class="list-group-item list-group-item-action computer-button">
              ${comp.name}
            </button>`;

  });

  // Add a link for 'all computers' to start of the list
  // first check compLinks is an array
  if (Array.isArray(compLinks)) {
    // Then use unshift to move all elements up one and insert a new element at the start
    // This button has computer_id=0
    compLinks.unshift(`<button data-computer_id="0" 
                        class="list-group-item list-group-item-action computer-button">
                        All Computers
                      </button>`);
  }

  // Set the innerHTML of the productRows root element = rows
  // join('') converts the rows array to a string, replacing the ',' delimiter with '' (blank)
  document.getElementById('computerList').innerHTML = compLinks.join("");

  // Add Event listeners to handle clicks
  // When clicked, the computer links will filter events - displaying  events for that computer
  //
  // 1. Find button all elements with matching the class name used to identify computer buttons
  const compButtons = document.getElementsByClassName('computer-button');

  // 2. Assign a 'click' event listener to each button
  // When clicked the filterComputer() function will be called.
  for (let i = 0; i < compButtons.length; i++) {
    compButtons[i].addEventListener('click', filterComputers);
  }
}

// Return event styling depending on level
// icons - https://icons.getbootstrap.com/
//
function getAlertStyle(level) {
  const error = {
    alert: 'alert alert-danger',
    icon: 'bi bi-bug-fill'
  };

  const warning = {
    alert: 'alert alert-warning',
    icon: 'bi bi-exclamation-triangle-fill'
  };

  const information = {
    alert: 'alert alert-info',
    icon: 'bi bi-info-circle-fill'
  };

  const _default = {
    alert: 'alert alert-light',
    icon: 'bi bi-calendar3-event-fill'
  };

  // return style object based on level value
  switch (level) {
    case 'error':
      return error;
    case 'warning':
      return warning;
    case 'information':
      return information;
    // Everything else
    default:
      return _default;
  }
}

// Function to show events based on search box text
// https://supabase.com/docs/reference/javascript/using-filters
//
async function filterSearch() {

  // read the value of the search input field
  const search = document.getElementById('inputSearch').value;
  
    // Get events by calling eventData.Search
    const events = await eventData.searchFilter(search);

    // If events returned then display them
    if (Array.isArray(events)) {
      displayEventList(events);
    }

}

// Show events for selected computer
//
async function filterComputers() {

    // Get id of cat link (from the data attribute)
    // https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
    const compId = Number(this.dataset.computer_id);

    // validation - if 0 or NaN reload everything
    if (isNaN(compId) || compId == 0) {
      loadAndDisplayData();
    
    // Otherwise get events for this computer
    } else {

      // Get events
      const events = await eventData.getEventByCompId(compId);

      // If events returned then display them
      if (Array.isArray(events)) {
        displayEventList(events);
      }
    }
}

// Sort based on user value
// sort direction opposite to current direction
//
async function toggleSortUser() {

  // read current sort order from session storage
  let sUser = JSON.parse(sessionStorage.getItem('sortUser')) === true;

  // set session storage value to opposite
  sessionStorage.setItem('sortUser', !sUser);

  // load events - passs filter options as parameters
  const events = await eventData.getAllEvents('user', !sUser);
  console.log("events:", events);
  displayEventList(events);

}


// Get JSON array of events
// Then pass that data for display
//
async function loadAndDisplayData() {
  
  // Load all computers and display
  const computers = await compData.getAllComputers();
  console.log("computers:", computers);
  displayComputers(computers);
  
  // load all events and display
  const events = await eventData.getAllEvents();
  console.log("events:", events);
  displayEventList(events);
}


export { loadAndDisplayData, filterSearch, toggleSortUser };

// Add event listners to page elements
// document.getElementById('inputSearch').addEventListener('keypress', filterSearch);
document.getElementById('btnSearch').addEventListener('click', filterSearch);

document.getElementById('userSort').addEventListener('click', toggleSortUser)

// Initial data load
loadAndDisplayData();

// Subscribe to changes (e.g. new events)
// This will refresh display when new events are added
const eventsSub = eventData.Supabase
  .from('events')
  .on('*', loadAndDisplayData)
  .subscribe();
