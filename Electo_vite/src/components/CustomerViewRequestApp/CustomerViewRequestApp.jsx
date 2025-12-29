import { useEffect, useMemo, useRef, useState } from "react";
import style from "./CustomerViewRequestApp.module.css";

const API_BASE = "http://localhost:4000";

const normalizeRma = (v) => (v || "").trim().toUpperCase();

const formatDate = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const STEPS = ["Submitted", "Approved", "In Repair", "Completed"];

function getStepIndexFromTicket(t) {
  if (!t) return 0;

  const status = normalizeRma(t.status);
  const tech = normalizeRma(t.technical_status);

  if (status.includes("COMPLETED") || tech.includes("COMPLETED") || tech.includes("CLOSED")) return 3;
  if (status.includes("IN-REPAIR") || status.includes("IN REPAIR") || tech.includes("IN REPAIR")) return 2;
  if (tech.includes("APPROVED")) return 1;

  return 0;
}

function getThemeFromTicket(t) {
  if (!t) return "neutral";

  const status = normalizeRma(t.status);
  const tech = normalizeRma(t.technical_status);

  if (tech.includes("REJECT")) return "danger";
  if (status.includes("COMPLETED") || tech.includes("COMPLETED") || tech.includes("CLOSED")) return "success";
  if (status.includes("IN-REPAIR") || status.includes("IN REPAIR") || tech.includes("IN REPAIR")) return "info";
  if (status.includes("PENDING") || tech.includes("PENDING")) return "warning";

  return "neutral";
}

function StatusBadge({ ticket }) {
  const theme = getThemeFromTicket(ticket);
  const status = ticket?.status || "-";
  const tech = ticket?.technical_status;

  // ✅ αποφυγή "completed • completed"
  let text = status;
  if (tech && normalizeRma(tech) !== normalizeRma(status)) text = `${status} • ${tech}`;

  const cls =
    theme === "success"
      ? style.badgeSuccess
      : theme === "danger"
      ? style.badgeDanger
      : theme === "info"
      ? style.badgeInfo
      : theme === "warning"
      ? style.badgeWarning
      : style.badge;

  return <span className={`${style.badge} ${cls}`}>{text}</span>;
}

function ProgressBar({ currentIndex = 0 }) {
  return (
    <div className={style.timeline}>
      <div className={style.timelineTop}>
        {STEPS.map((s, i) => (
          <div key={s} className={style.topItem}>
            <div className={`${style.circle} ${i <= currentIndex ? style.circleActive : ""}`} title={s}>
              {i <= currentIndex ? "✓" : ""}
            </div>

            {i < STEPS.length - 1 && (
              <div className={`${style.connector} ${i < currentIndex ? style.connectorActive : ""}`} />
            )}
          </div>
        ))}
      </div>

      <div className={style.timelineLabels}>
        {STEPS.map((s, i) => (
          <div key={s} className={`${style.stepLabel} ${i <= currentIndex ? style.stepLabelActive : ""}`}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketDetails({ ticket }) {
  if (!ticket) return null;

  const theme = getThemeFromTicket(ticket);
  const stepIndex = getStepIndexFromTicket(ticket);

  const customerName = ticket.customer?.name || "-";
  const productName = ticket.product?.name || "-";

  return (
    <div className={style.resultCard} data-theme={theme}>
      <div className={style.resultHeader}>
        <div>
          <h2 className={style.resultTitle}>RMA Status</h2>
          <p className={style.resultSub}>
            RMA: <b>{ticket.rma}</b>
          </p>
        </div>

        <StatusBadge ticket={ticket} />
      </div>

      <ProgressBar currentIndex={stepIndex} />

      <div className={style.detailsGrid}>
        <div className={style.field}>
          <div className={style.fieldLabel}>Customer</div>
          <div className={style.fieldValue}>{customerName}</div>
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>Email</div>
          <div className={style.fieldValue}>{ticket.email || "-"}</div>
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>Phone</div>
          <div className={style.fieldValue}>{ticket.phone || "-"}</div>
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>Purchase Date</div>
          <div className={style.fieldValue}>{ticket.purchase_date || "-"}</div>
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>Product</div>
          <div className={style.fieldValue}>{productName}</div>
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>Serial Number</div>
          <div className={style.fieldValue}>{ticket.serial_number || "-"}</div>
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>Assigned To</div>
          <div className={style.fieldValue}>{ticket.assigned_to || ticket.assignedTo || "-"}</div>
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>Created At</div>
          <div className={style.fieldValue}>
            {formatDate(ticket.created_at || ticket.createdAt || ticket.date)}
          </div>
        </div>
      </div>

      <div className={style.block}>
        <div className={style.blockLabel}>Issue</div>
        <div className={style.blockValue}>{ticket.issue || "-"}</div>
      </div>

      <div className={style.block}>
        <div className={style.blockLabel}>Notes</div>
        <div className={style.blockValue}>{ticket.notes || "-"}</div>
      </div>
    </div>
  );
}

export default function CustomerViewRequestApp() {
  const [tab, setTab] = useState("track"); // "new" | "track" | "list"

  const [tickets, setTickets] = useState([]);
  const ticketsMemo = useMemo(() => tickets || [], [tickets]);

  // Track RMA
  const [rma, setRma] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [ticket, setTicket] = useState(null);

  // Notifications dropdown
  const [notifOpen, setNotifOpen] = useState(false);
  const notifBtnRef = useRef(null);
  const notifMenuRef = useRef(null);

  const clearMessages = () => {
    setErrorMsg("");
    setInfoMsg("");
  };

  async function loadTickets() {
    const res = await fetch(`${API_BASE}/tickets`);
    if (!res.ok) throw new Error("Failed to load tickets");
    const data = await res.json();
    setTickets(Array.isArray(data) ? data : []);
    return data;
  }

  useEffect(() => {
    (async () => {
      try {
        await loadTickets();
      } catch {
        // silent
      }
    })();
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    if (!notifOpen) return;

    const onDown = (e) => {
      const btn = notifBtnRef.current;
      const menu = notifMenuRef.current;
      if (btn && btn.contains(e.target)) return;
      if (menu && menu.contains(e.target)) return;
      setNotifOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [notifOpen]);

  const notifications = useMemo(() => {
    const arr = [...ticketsMemo];

    const getTs = (t) => {
      const raw = t.last_updated || t.updatedAt || t.created_at || t.createdAt || t.date || null;
      const ts = raw ? new Date(raw).getTime() : 0;
      return Number.isFinite(ts) ? ts : 0;
    };

    arr.sort((a, b) => getTs(b) - getTs(a));
    return arr.slice(0, 4);
  }, [ticketsMemo]);

  const handleSearch = async (e) => {
    e.preventDefault();

    const query = normalizeRma(rma);
    clearMessages();
    setTicket(null);

    if (!query) {
      setErrorMsg("Please enter an RMA number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/tickets?rma=${encodeURIComponent(query)}`);
      if (res.ok) {
        const arr = await res.json();
        const found = Array.isArray(arr) && arr.length ? arr[0] : null;
        if (found) {
          setTicket(found);
          setInfoMsg("Ticket loaded successfully.");
          setLoading(false);
          return;
        }
      }

      const foundLocal = ticketsMemo.find((x) => normalizeRma(x.rma) === query);
      if (!foundLocal) {
        setErrorMsg("No ticket found for this RMA number.");
      } else {
        setTicket(foundLocal);
        setInfoMsg("Ticket loaded successfully.");
      }
    } catch {
      setErrorMsg("Could not connect to server. Is json-server running on :4000?");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setRma("");
    setLoading(false);
    clearMessages();
    setTicket(null);
  };

  const openNew = () => setTab("new");
  const openTrack = () => setTab("track");
  const openList = () => setTab("list");

  const handlePickFromList = (t) => {
    setTicket(t);
    setRma(t.rma);
    clearMessages();
    setInfoMsg("Ticket loaded successfully.");
    setTab("track");
  };

  // ✅ ΜΟΝΟ αυτό θες: View all → να ανοίγει View My Requests
  const handleViewAllNotifications = () => {
    setNotifOpen(false);
    setTab("list");
  };

  return (
    <div className={style.page}>
      <header className={style.portalHeader}>
        <div>
          <h1 className={style.portalTitle}>Customer Portal</h1>
          <p className={style.portalSubtitle}>Track the progress of your requests</p>
        </div>

        <div className={style.portalActions}>
          <button
            className={`${style.tabBtn} ${tab === "new" ? style.tabBtnActive : ""}`}
            onClick={openNew}
            type="button"
          >
            New Request
          </button>

          <button
            className={`${style.tabBtn} ${tab === "track" ? style.tabBtnActive : ""}`}
            onClick={openTrack}
            type="button"
          >
            Track RMA
          </button>

          <button
            className={`${style.tabBtn} ${tab === "list" ? style.tabBtnActive : ""}`}
            onClick={openList}
            type="button"
          >
            View My Requests
          </button>

          {/* Notifications dropdown (floating, ΔΕΝ χαλάει layout) */}
          <div className={style.notifWrap}>
            <button
              ref={notifBtnRef}
              className={`${style.tabBtn} ${notifOpen ? style.tabBtnActive : ""}`}
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              title="Notifications"
            >
              <span className={style.bell} aria-hidden="true">🔔</span> Notifications
            </button>

            {notifOpen && (
              <div ref={notifMenuRef} className={style.notifMenu}>
                {notifications.length === 0 ? (
                  <div className={style.notifEmpty}>No notifications yet.</div>
                ) : (
                  <>
                    {notifications.map((t) => {
                      const theme = getThemeFromTicket(t);

                      const dotCls =
                        theme === "success"
                          ? style.notifDotSuccess
                          : theme === "danger"
                          ? style.notifDotDanger
                          : theme === "info"
                          ? style.notifDotInfo
                          : theme === "warning"
                          ? style.notifDotWarning
                          : style.notifDot;

                      const line2 = t.technical_status
                        ? normalizeRma(t.technical_status) === normalizeRma(t.status)
                          ? `${t.status}`
                          : `${t.status} • ${t.technical_status}`
                        : `${t.status}`;

                      const when = formatDate(t.last_updated || t.created_at || t.date);

                      return (
                        <div key={t.id || t.rma} className={style.notifItem}>
                          <span className={`${style.notifDot} ${dotCls}`} aria-hidden="true" />
                          <div className={style.notifText}>
                            <div className={style.notifTitle}>{t.rma}</div>
                            <div className={style.notifSub}>{line2}</div>
                          </div>
                          <div className={style.notifDate}>{when}</div>
                        </div>
                      );
                    })}

                    <button type="button" className={style.notifViewAll} onClick={handleViewAllNotifications}>
                      View all →
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {tab === "new" && (
        <div className={style.newWrap}>
          <h2 className={style.sectionTitle}>New Request</h2>
        </div>
      )}

      {/* Track RMA εμφανίζεται ΜΟΝΟ στο track tab */}
      {tab === "track" && (
        <>
          <div className={style.searchCard}>
            <h2 className={style.sectionTitle}>Track your RMA</h2>

            <form className={style.form} onSubmit={handleSearch}>
              <label className={style.label}>
                RMA Number
                <input
                  className={style.input}
                  type="text"
                  placeholder="e.g. RMA-002"
                  value={rma}
                  onChange={(e) => setRma(e.target.value)}
                  disabled={loading}
                />
              </label>

              <div className={style.actions}>
                <button className={style.primaryBtn} type="submit" disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </button>

                <button className={style.secondaryBtn} type="button" onClick={handleClear}>
                  Clear
                </button>
              </div>
            </form>

            {errorMsg && <div className={style.alertError}>{errorMsg}</div>}
            {infoMsg && <div className={style.alertOk}>{infoMsg}</div>}
          </div>

          <TicketDetails ticket={ticket} />
        </>
      )}

      {/* View My Requests tab: ΜΟΝΟ η λίστα */}
      {tab === "list" && (
        <div className={style.listWrap}>
          <div className={style.listHeaderRow}>
            <h2 className={style.sectionTitle}>My Requests</h2>
            <button
              type="button"
              className={style.secondaryBtn}
              onClick={async () => {
                clearMessages();
                try {
                  setLoading(true);
                  await loadTickets();
                  setInfoMsg("Tickets refreshed.");
                } catch {
                  setErrorMsg("Could not refresh tickets.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              Refresh
            </button>
          </div>

          {errorMsg && <div className={style.alertError}>{errorMsg}</div>}
          {infoMsg && <div className={style.alertOk}>{infoMsg}</div>}

          <div className={style.cardsGrid}>
            {ticketsMemo.map((t) => {
              const theme = getThemeFromTicket(t);
              const badgeCls =
                theme === "success"
                  ? style.badgeSmallSuccess
                  : theme === "danger"
                  ? style.badgeSmallDanger
                  : theme === "info"
                  ? style.badgeSmallInfo
                  : theme === "warning"
                  ? style.badgeSmallWarning
                  : style.badgeSmall;

              return (
                <button
                  key={t.id || t.rma}
                  type="button"
                  className={style.requestCard}
                  onClick={() => handlePickFromList(t)}
                >
                  <div className={style.cardTop}>
                    <div className={style.cardTitle}>{t.product?.name || "Product"}</div>
                    <span className={`${style.badgeSmall} ${badgeCls}`}>{t.status}</span>
                  </div>

                  <div className={style.cardMeta}>
                    <div>
                      <span className={style.metaLabel}>RMA:</span> {t.rma}
                    </div>
                    <div>
                      <span className={style.metaLabel}>Customer:</span> {t.customer?.name || "-"}
                    </div>
                  </div>

                  <div className={style.cardIssue}>
                    <span className={style.metaLabel}>Issue:</span> {t.issue || "-"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
// 