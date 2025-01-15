import axios from "axios";

const BASE_URL = "https://youtube.googleapis.com/youtube/v3";

export const fetchFromAPI = async (url) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${url}`, {
      params: {
        key: process.env.REACT_APP_YOUTUBE_API_KEY, 
        maxResults: 50, 
        relevanceLanguage: "en",
      },
    });
    console.log("API Response:", data); 
    return data;
  } catch (error) {
    console.error("Error fetching data from API:", error.message); 
    return { items: [] }; 
  }
};
