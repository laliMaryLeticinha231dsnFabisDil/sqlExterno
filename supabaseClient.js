// supabaseClient.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pnhxllwvyymnsraxlyrg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuaHhsbHd2eXltbnNyYXhseXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMTc0MzgsImV4cCI6MjAzODY5MzQzOH0.8PiT2TYCQi4NdogJfwID6UcppehD4RxDw43MdpBFdEo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    localStorage: AsyncStorage,
    detectSessionInUrl: false,
});
