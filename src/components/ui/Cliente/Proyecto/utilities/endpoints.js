import { fetchWithAuth } from '../../../../../js/authToken';
import API_BASE_URL from '../../../../../js/urlHelper';

export const fetchProjectWithPhases = async (proyectoId) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/client/project/${proyectoId}/with-phases`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener datos del proyecto');
  }

  return data;
};

export const getChatIdByProyecto = async (proyectoId) => {
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
