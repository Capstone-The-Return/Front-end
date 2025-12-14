import { useEffect, useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getAllTickets, updateTicket, deleteTicket } from '../../services/employeeTickets';
import style from './EmployeePageApp.module.css';
import { FiHome, FiUser, FiSettings, FiLogOut,FiFileText,FiSearch,FiList,FiTool, FiMenu } from "react-icons/fi";

const STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  'in-repair': 'In Repair',
  completed: 'Completed'
};

const TECHNICIANS = [
  'Unassigned',
  'Tech One',
  'Tech Two',
  // Άλλα μέλη εδώ
];

export default function EmployeePage() {
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAllTickets().then(setTickets);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedTicket && !saving) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTicket, saving]);

  // useMemo για filteredTickets (ανανεώνεται όταν αλλάζουν tickets ή searchQuery)
  const filteredTickets = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return tickets.filter(ticket =>
      ticket.rma.toLowerCase().includes(query) ||
      ticket.customer?.name.toLowerCase().includes(query) ||
      ticket.product?.name.toLowerCase().includes(query)
    );
  }, [tickets, searchQuery]);

  // useMemo για columns (ανανεώνεται όταν αλλάζουν τα filteredTickets)
  const columns = useMemo(() => ({
    pending: filteredTickets.filter(t => t.status === 'pending'),
    approved: filteredTickets.filter(t => t.status === 'approved'),
    'in-repair': filteredTickets.filter(t => t.status === 'in-repair'),
    completed: filteredTickets.filter(t => t.status === 'completed'),
  }), [filteredTickets]);

  const onDragEnd = async (result) => {
  const { destination, source, draggableId } = result;

  if (!destination) return;

  // No change in position or column
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) return;

  const newStatus = destination.droppableId;
  const id = draggableId;

  // Optimistically update UI
  setTickets(prevTickets => {
    const updated = prevTickets.map(ticket =>
     ticket.id === id ? { ...ticket, status: newStatus } : ticket
    );

    return updated;
  });

  try {
    await updateTicket(id, { status: newStatus });
    // No further update needed because UI updated optimistically
  } catch (error) {
    alert('Failed to update ticket status');
    console.error(error);

    // Rollback to previous status on error
    setTickets(prevTickets => 
      prevTickets.map(ticket =>
        ticket.id === id ? { ...ticket, status: source.droppableId } : ticket
      )
    );
  }
};

  const handleDelete = async (id) => {
    await deleteTicket(id);
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setEditData({
      assigned_to: ticket.assigned_to || 'Unassigned',
      warranty: ticket.warranty || false,
    });
  };

  const closeModal = () => {
    if (saving) return;
    setSelectedTicket(null);
    setEditData({});
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedFields = {
        assigned_to: editData.assigned_to === 'Unassigned' ? null : editData.assigned_to,
        warranty: editData.warranty,
      };

      await updateTicket(selectedTicket.id, updatedFields);

      setTickets(prev =>
        prev.map(t =>
          t.id === selectedTicket.id ? { ...t, ...updatedFields } : t
        )
      );

      closeModal();
    } catch (error) {
      alert('Error saving changes');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={style.container}>
      <h1 className={style.header}><FiUser className={style.icon} /> Employee Portal</h1>
      <p className={style.subtitle}>Manage all RMA tickets and requests</p>

      <input
        type="text"
        placeholder="Search tickets..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className={style.searchBar}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={style.kanban}>
          {Object.entries(columns).map(([status, items]) => (
            <Droppable droppableId={status} key={status}>
              {provided => (
                <div
                  className={style.column}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className={style.columnTitle}>{STATUS_LABELS[status]}</h2>

                  {items.map((ticket, index) => (
                    <Draggable
                      key={ticket.id}
                      draggableId={String(ticket.id)}
                      index={index}
                    >
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${style.card} ${style[status]}`}
                          onDoubleClick={() => openModal(ticket)}
                        >
                          <strong>{ticket.rma}</strong>
                          <p>{ticket.customer?.name}</p>
                          <p className={style.product}>{ticket.product?.name}</p>
                          <p>Warranty: {ticket.warranty ? 'Yes' : 'No'}</p>
                          <p>Issue: {ticket.issue}</p>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(ticket.id);
                            }}
                            className={style.deleteButton}
                            aria-label="Delete ticket"
                            title="Delete ticket"
                          >
                            ❌
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {selectedTicket && (
        <div className={style.modalOverlay} onClick={closeModal}>
          <div
            className={style.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <h2>Ticket Details: {selectedTicket.rma}</h2>
            <p><strong>Customer:</strong> {selectedTicket.customer?.name}</p>
            <p><strong>Product:</strong> {selectedTicket.product?.name}</p>
            <p><strong>Status:</strong> {STATUS_LABELS[selectedTicket.status]}</p>

            <label>
              <strong>Assigned to:</strong>
              <select
                className={style.modalSelect}
                value={editData.assigned_to}
                onChange={e => setEditData({ ...editData, assigned_to: e.target.value })}
                disabled={saving}
              >
                {TECHNICIANS.map(emp => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
            </label>

            <label>
              <strong>Warranty:</strong>
              <select
                className={style.modalSelect}
                value={editData.warranty ? 'Yes' : 'No'}
                onChange={e => setEditData({ ...editData, warranty: e.target.value === 'Yes' })}
                disabled={saving}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>

            <p><strong>Issue:</strong> {selectedTicket.issue}</p>
            <p><strong>Contact:</strong> {selectedTicket.phone || 'N/A'}, {selectedTicket.email || 'N/A'}</p>
            <p><strong>Address:</strong> {selectedTicket.address || 'N/A'}</p>
            <p><strong>Serial Number:</strong> {selectedTicket.serial_number || 'N/A'}</p>
            <p><strong>Purchase Date:</strong> {selectedTicket.purchase_date || 'N/A'}</p>
            <p><strong>Created at:</strong> {new Date(selectedTicket.created_at).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(selectedTicket.last_updated).toLocaleString()}</p>
            <p><strong>Notes:</strong> {selectedTicket.notes || 'N/A'}</p>  
            <p><strong>Owner:</strong> {selectedTicket.owner || 'N/A'}</p>
            <p><strong>Photo:</strong> {selectedTicket.photo_url ? <a href={selectedTicket.photo_url} target="_blank" rel="noopener noreferrer">View Photo</a> : 'N/A'}</p>

            <div className={style.modalButtons}>
              <button
                onClick={closeModal}
                disabled={saving}
                className={`${style.button} ${style.cancel}`}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className={`${style.button} ${style.save}`}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
