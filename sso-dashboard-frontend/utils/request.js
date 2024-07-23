const request = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.response = await response.json();
    throw error;
  }
  return response.json();
};

export default request;
