/*
  Supabase configuration.
*/

const { createClient } = supabase;

const supabaseUrl = 'my supabase DB URL';
const supabaseKey = 'supabase anon api key';

// Supabase is imported in index.html
const Supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase Instance: ', Supabase);


export  {
  Supabase
};

