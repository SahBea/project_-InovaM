const REPO_OWNER = 'SahBea';
const REPO_NAME = 'project_AG';
const API_BASE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

/**
 * Helper to fetch a file's SHA from the GitHub repository.
 * Necessary for updating existing files.
 * @param {string} token - GitHub Personal Access Token
 * @param {string} filePath - Path to file in repo (e.g. 'src/data/content.json')
 * @returns {Promise<string|null>} The file's SHA or null if it doesn't exist
 */
async function getFileSha(token, filePath) {
  try {
    const response = await fetch(`${API_BASE_URL}/contents/${filePath}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch file metadata: ${response.statusText}`);
    }

    const data = await response.json();
    return data.sha;
  } catch (error) {
    console.error('Error getting file SHA:', error);
    throw error;
  }
}

/**
 * Commits a file update or creation directly to the GitHub repository.
 * @param {string} token - GitHub Personal Access Token
 * @param {string} filePath - Path to save the file in the repo
 * @param {string} contentStr - File content (as a string)
 * @param {string} commitMessage - Message for the Git commit
 */
export async function commitFileToGithub(token, filePath, contentStr, commitMessage = 'Update site content') {
  try {
    const sha = await getFileSha(token, filePath);
    const base64Content = btoa(unescape(encodeURIComponent(contentStr)));

    const body = {
      message: commitMessage,
      content: base64Content,
    };

    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(`${API_BASE_URL}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Error committing file to GitHub');
    }

    return await response.json();
  } catch (error) {
    console.error('Error committing to GitHub:', error);
    throw error;
  }
}

/**
 * Uploads a binary file (e.g., an image) to the GitHub repository.
 * Converts the file to Base64 first.
 * @param {string} token - GitHub Personal Access Token
 * @param {File} file - The file object from a file input
 * @param {string} commitMessage - Message for the Git commit
 * @returns {Promise<string>} The local asset path (e.g., '/uploads/filename.jpg')
 */
export async function uploadImageToGithub(token, file, commitMessage = 'Upload project image') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        // Get the base64 content after the data URL prefix (comma)
        const base64Content = reader.result.split(',')[1];
        
        // Clean filename: remove special chars, keep extensions, make lowercase
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
        // Append timestamp to avoid collisions
        const fileName = `${Date.now()}_${cleanName}`;
        const filePath = `public/uploads/${fileName}`;

        // Check if file exists (unlikely, but safe)
        const sha = await getFileSha(token, filePath);

        const body = {
          message: commitMessage,
          content: base64Content,
        };

        if (sha) {
          body.sha = sha;
        }

        const response = await fetch(`${API_BASE_URL}/contents/${filePath}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Error uploading image to GitHub');
        }

        // Return path relative to the public directory
        resolve(`/uploads/${fileName}`);
      } catch (error) {
        console.error('Error uploading image:', error);
        reject(error);
      }
    };
    reader.onerror = (error) => {
      console.error('File reading error:', error);
      reject(error);
    };
  });
}
