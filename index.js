const express = require('express');
const axios = require('axios'); // You can use axios to make HTTP requests.
const lodash = require('lodash');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware function to fetch and analyze blog data
app.use('/api/blog-stats', async (req, res, next) => {
  try {
    const apiUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';
    const adminSecret = '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';

    // Make the API request using axios
    const response = await axios.get(apiUrl, {
      headers: {
        'x-hasura-admin-secret': adminSecret,
      },
    });

    const blogData = response.data; // Assuming the data is an array of blog objects

    // Example analysis: Calculate the total number of blogs and average word count
    const totalBlogs = blogData.length;
    const wordCounts = blogData.map((blog) => blog.wordCount);
    const averageWordCount = lodash.mean(wordCounts);

    // You can perform more detailed analysis as needed

    // Attach the analysis results to the response object
    req.blogStats = {
      totalBlogs,
      averageWordCount,
    };

    next(); // Move to the next middleware or route handler
  } catch (error) {
    // Handle errors appropriately
    console.error('Error fetching and analyzing blog data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to retrieve the analyzed blog statistics
app.get('/api/blog-stats', (req, res) => {
  // Retrieve the blog statistics from the middleware and send it as a response
  const { totalBlogs, averageWordCount } = req.blogStats;
  res.json({
    totalBlogs,
    averageWordCount,
    // Add more analysis results here
  });
});

// Blog search endpoint (you can implement it separately)
app.get('/api/blog-search', (req, res) => {
  // Implement your blog search logic here
  const searchTerm = req.query.q; // Assuming the search term is passed as a query parameter
  // Perform the search and return the results
  // You can use a library like ElasticSearch or build custom search logic
  res.json({ results: [] }); // Placeholder for search results
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
