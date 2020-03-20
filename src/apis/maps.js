import axios from 'axios';

// I originally left the API key here in plain text, but I created a new repository and removed the key.
// If you would like to use the key to test my code, please contact me at joeygonzalesdones@gatech.edu or
// at joeygonzalesdones@gmail.com.
const API_KEY = ""; 

// We need this to avoid a "blocked by CORS policy" error;
// I spent two hours trying to fix this problem before stumbling upon this thread, which suggested the fix below:
// https://gis.stackexchange.com/questions/279018/cors-error-when-using-google-elevation-api
const PROXY_URL = "https://cors-anywhere.herokuapp.com" 
const BASE_URL = "https://maps.googleapis.com/maps/api/distancematrix";

export default axios.create({
  baseURL: `${PROXY_URL}/${BASE_URL}`,
  params: {
    units: "imperial", // compute mileage in miles rather than in kilometers
    key: API_KEY
  }
});