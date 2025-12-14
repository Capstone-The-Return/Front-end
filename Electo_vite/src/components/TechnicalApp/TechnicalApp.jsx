import { useState } from "react";
import styles from "./TechnicalApp.module.css";
import TicketCard from "../TicketCard/TicketCard";
import initialTickets from "../../data/tickets.json";

export default function TechnicalApp() {
  const [tickets, setTickets] = useState(initialTickets);
  const [filter, setFilter] = useState("All");

  const filteredTickets =
    filter === "All"
      ? tickets
      : tickets.filter(t => t.status === filter);

  const updateStatus = (id, status) => {
    setTickets(tickets.map(t =>
      t.id === id ? { ...t, status } : t
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
