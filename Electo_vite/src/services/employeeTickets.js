const BASE = 'http://localhost:4000/tickets';
//const TechSupportBase = 'http://localhost:4000/TechnicalTickets';

export const getAllTickets = async () => {
  const res = await fetch(BASE);
  return res.json();
};

export const createTicket = async (data) => {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create ticket');
  }
  return res.json();
};

export const updateTicket = async (id, data) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update ticket');
  }
  return res.json();
};


export const deleteTicket = async id => {
  await fetch(`${BASE}/${id}`, { method: 'DELETE' });
};
