import { 
  notifyTicketCreated, 
  notifyTechnicalStatusChange 
} from './notificationService';

const BASE = 'http://localhost:4000/tickets';

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
  
  const ticket = await res.json();
  
  // ✅ NOTIFY: New ticket created
  try {
    await notifyTicketCreated(ticket, 'employee');
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
  
  return ticket;
};

export const updateTicket = async (id, data, updatedBy = 'system') => {
  // First, get the current ticket to compare values
  const currentRes = await fetch(`${BASE}/${id}`);
  const currentTicket = await currentRes.json();
  
  const oldTechStatus = currentTicket.technical_status;
  
  // Update the ticket
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      last_updated: new Date().toISOString()
    })
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update ticket');
  }
  
  const updatedTicket = await res.json();
  
  try {
    if (data.technical_status && data.technical_status !== oldTechStatus) {
      const isNullToPending = 
        (!oldTechStatus || oldTechStatus === null) && 
        data.technical_status.toLowerCase() === 'pending';
      
      if (!isNullToPending) {
        await notifyTechnicalStatusChange(
          updatedTicket, 
          oldTechStatus, 
          data.technical_status, 
          'employee'
        );
      }
    }
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
  
  return updatedTicket;
};

export const deleteTicket = async (id) => {
  await fetch(`${BASE}/${id}`, { method: 'DELETE' });
};