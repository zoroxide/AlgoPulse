import axios from 'axios';


// i know this is a lot of code but it is very important to understand the flow of the code
// i know this is also alot of shit, but the authContect not working here, please contibute if you now the solution
const getUserData = async () => {
    try {
      // Retrieve the token from local storage or another secure location
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log("admin panel error: no token found");
        throw new Error('No token found. Please log in.');
      }
  
      // Define the API URL for the get-user endpoint
      const apiUrl = 'http://localhost:3000/api/get-user'; 
  
      // Make the request to the get-user endpoint
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
  
      // Return the user data
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error; // Rethrow the error for the calling function to handle
    }
};

export default getUserData;