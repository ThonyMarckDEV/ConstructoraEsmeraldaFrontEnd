import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';

/**
 * Fetches the chat ID associated with a project ID.
 * @param {number} proyectoId - The ID of the project.
 * @returns {Promise<number|null>} - The chat ID if found, null otherwise.
 * @throws {Error} - If the API call fails.
 */
const getChatIdByProyecto = async (proyectoId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/project/${proyectoId}/chat-id`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener el ID del chat');
    }

    return data.idChat || null;
  } catch (error) {
    console.error('Error fetching chat ID:', error);
    throw error;
  }
};

export default getChatIdByProyecto;