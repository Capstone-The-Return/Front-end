import styles from "./TicketCard.module.css";

export default function TicketCard({ ticket, onStatusChange }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <strong>{ticket.id}</strong>
        <span className={`${styles.badge} ${styles[ticket.priority.toLowerCase()]}`}>
          {ticket.priority} PRIORITY
        </span>
      </div>

      <p><strong>{ticket.customer}</strong></p>
      <p>{ticket.product}</p>
      <p className={styles.issue}>Issue: {ticket.issue}</p>

      <div className={styles.controls}>
        <select
          value={ticket.status}
          onChange={(e) => onStatusChange(ticket.id, e.target.value)}
        >
          <option>Pending</option>
          <option>Approved</option>
          <option>In Repair</option>
          <option>Completed</option>
          <option>Rejected</option>
        </select>

        <select value={ticket.assignedTo}>
          <option>Unassigned</option>
          <option>Technician 001</option>
          <option>Technician 002</option>
        </select>
      </div>
    </div>
  );
}
