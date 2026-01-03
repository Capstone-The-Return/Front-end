const BASE = 'http://localhost:3000/notifications';

// Get all notifications (sorted newest first)
export const getAllNotifications = async () => {
  const res = await fetch(`${BASE}?_sort=created_at&_order=desc`);
  return res.json();
};

// Get unread notifications only (sorted newest first)
export const getUnreadNotifications = async () => {
  const res = await fetch(`${BASE}?read=false&_sort=created_at&_order=desc`);
  return res.json();
};

// Get unread notifications by role (sorted newest first)
export const getUnreadNotificationsByRole = async (role) => {
  const res = await fetch(`${BASE}?for_role=${role}&read=false&_sort=created_at&_order=desc`);
  return res.json();
};

// Create a notification
export const createNotification = async (data) => {
  const notification = {
    id: `notif-${Date.now()}`,
    created_at: new Date().toISOString(),
    read: false,
    ...data
  };
  
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notification)
  });
  
  if (!res.ok) {
    throw new Error('Failed to create notification');
  }
  return res.json();
};

// Mark notification as read
export const markAsRead = async (id) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ read: true })
  });
  return res.json();
};

// Mark all unread notifications as read
export const markAllAsRead = async () => {
  const unread = await getUnreadNotifications();
  const updates = unread.map(n => markAsRead(n.id));
  return Promise.all(updates);
};

// Delete a notification
export const deleteNotification = async (id) => {
  await fetch(`${BASE}/${id}`, { method: 'DELETE' });
};

// ============ NOTIFICATION TRIGGERS ============

// 1. Notify when a NEW TICKET is created
export const notifyTicketCreated = async (ticket, forRole = 'employee') => {
  return createNotification({
    ticket_id: ticket.id,
    rma: ticket.rma,
    type: 'created',
    message: `New ${ticket.record_type || 'repair'} ticket created`,
    old_status: null,
    new_status: ticket.status,
    old_technical_status: null,
    new_technical_status: ticket.technical_status || null,
    for_role: forRole
  });
};

// 2. Notify when TECHNICAL_STATUS changes
export const notifyTechnicalStatusChange = async (ticket, oldTechStatus, newTechStatus, forRole = 'employee') => {
  return createNotification({
    ticket_id: ticket.id,
    rma: ticket.rma,
    type: 'technical_status_change',
    message: `Technical status: ${oldTechStatus || 'None'} → ${newTechStatus}`,
    old_status: ticket.status,
    new_status: ticket.status,
    old_technical_status: oldTechStatus,
    new_technical_status: newTechStatus,
    for_role: forRole
  });
};