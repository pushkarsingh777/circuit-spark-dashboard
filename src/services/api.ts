export const API_BASE = "http://127.0.0.1:5000";

export async function fetchTestMessage() {
  const response = await fetch(`${API_BASE}/api/test`);
  return await response.json();
}
