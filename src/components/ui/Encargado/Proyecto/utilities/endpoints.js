import { fetchWithAuth } from '../../../../../js/authToken';
import API_BASE_URL from '../../../../../js/urlHelper';

export const fetchProjectWithPhases = async (proyectoId) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/manager/project/${proyectoId}/with-phases`);
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
      throw new Error(data.message || 'No se encontró un chat asociado al proyecto');
    }

    return data.idChat || null; // Handle the idChat property returned by the endpoint
  } catch (error) {
    console.error('Error fetching chat ID:', error);
    throw error;
  }
};

export const updateProjectPhase = async (proyectoId, nuevaFase) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/manager/project/${proyectoId}/phase`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fase: nuevaFase }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar la fase del proyecto');
    }

    return data;
  } catch (error) {
    console.error('Error updating project phase:', error);
    throw error;
  }
};