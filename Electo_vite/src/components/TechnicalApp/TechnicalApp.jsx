import { useState, useEffect } from "react";
import styles from "./TechnicalApp.module.css";
import TicketCard from "../TicketCard/TicketCard";
import { getAllTickets, updateTicket, deleteTicket } from '../../services/employeeTickets';


export default function TechnicalApp() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getAllTickets().then(data => {
      setTickets(data.filter(t => t.technical_status !== null));
    });
  }, []);

  const filteredTickets =
    filter === "All"
      ? tickets
      : tickets.filter(t => t.status === filter);

  const updateStatus = async (id, status) => {

    await updateTicket(id, {'technical_status': status});
    
    setTickets(tickets.map(t =>
      t.id === id ? { ...t, technical_status: status } : t
    ));

  };

  return (
    <section className={styles.technical}>
      <div className={styles.header}>
        <div className={styles.icon}>🔧</div>
        <div>
          <h2>Technical Center</h2>
          <p>Ticket Management & Repair Status</p>
        </div>
      </div>

      <div className={styles.filters}>
        <input placeholder="Search by RMA ID, customer, or product..." />
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>In Repair</option>
          <option>Completed</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className={styles.title}>
        <h3>Active Tickets ({filteredTickets.length})</h3>
        <p>Manage and update repair ticket statuses</p>
      </div>

      {filteredTickets.map(ticket => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onStatusChange={updateStatus}
        />
      ))}
    </section>
  );
}
