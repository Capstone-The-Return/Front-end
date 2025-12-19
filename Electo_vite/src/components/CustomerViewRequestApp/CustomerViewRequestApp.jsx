import { useEffect, useMemo, useState } from "react";
import style from "./CustomerViewRequestApp.module.css";
import requestsData from "../../pages/mock/requests.json";
// must connect to our database
const STORAGE_KEY = "electo_requests_v1";

const normalizeRma = (v) => (v || "").trim().toUpperCase();

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const STEPS = ["Submitted", "Approved", "In Repair", "Completed"];

function getStepIndex(req) {
  if (!req) return 0;

  const status = normalizeRma(req.status);

  // closed/completed
  if (status.includes("CLOSED") || status.includes("COMPLETED")) return 3;

  // in repair / in progress
  if (
    status.includes("IN PROGRESS") ||
    status.includes("IN REPAIR") ||
    status.includes("REPAIR")
  )
    return 2;

  // approved-ish
  if (
    status.includes("APPROVED") ||
    status.includes("COVERED") ||
    status.includes("ASSIGNED")
  )
    return 1;

  // default submitted
  return 0;
}

function ProgressBar({ currentIndex = 0 }) {
  return (
    <div className={style.timeline}>
      <div className={style.timelineTop}>
        {STEPS.map((s, i) => (
          <div key={s} className={style.topItem}>
            <div
              className={`${style.circle} ${i <= currentIndex ? style.circleActive : ""}`}
              aria-label={s}
              title={s}
            >
              {i <= currentIndex ? "✓" : ""}
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={`${style.connector} ${
                  i < currentIndex ? style.connectorActive : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className={style.timelineLabels}>
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`${style.stepLabel} ${i <= currentIndex ? style.stepLabelActive : ""}`}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function RequestDetails({ request }) {
  if (!request) return null;

  const updates = request?.updates?.length ? request.updates : [];

  return (
    <div className={style.resultCard}>
      <div className={style.resultHeader}>
        <div>
          <h2 className={style.resultTitle}>RMA Status</h2>
          <p className={style.resultSub}>
            RMA: <b>{request.rma}</b>
          </p>
        </div>

        <span className={style.badge}>{request.status}</span>
      </div>

      <ProgressBar currentIndex={getStepIndex(request)} />

      <div className={style.detailsGrid}>
        <div className={style.field}>
          <div className={style.fieldLabel}>Type</div>
          <div className={style.fieldValue}>{request.type ?? "N/A"}</div>
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>Created At</div>
          <div className={style.fieldValue}>{formatDate(request.createdAt)}</div>
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>Product</div>
          <div className={style.fieldValue}>
            {(request.product?.brand ?? "N/A") + " " + (request.product?.model ?? "")}
          </div>
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>Serial Number</div>
          <div className={style.fieldValue}>{request.product?.serialNumber ?? "N/A"}</div>
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>Purchase Date</div>
          <div className={style.fieldValue}>
            {request.purchaseDate ? formatDate(request.purchaseDate) : "N/A"}
          </div>
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>Reason for Return</div>
          <div className={style.fieldValue}>{request.reasonForReturn ?? "N/A"}</div>
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>Customer</div>
          <div className={style.fieldValue}>{request.customer?.fullName ?? "N/A"}</div>
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>Email</div>
          <div className={style.fieldValue}>{request.customer?.email ?? "N/A"}</div>
        </div>
      </div>

      <div className={style.block}>
        <div className={style.blockLabel}>Issue Description</div>
        <div className={style.blockValue}>{request.issueDescription ?? "N/A"}</div>
      </div>

      <div className={style.block}>
        <div className={style.blockLabel}>Updates</div>

        {updates.length === 0 ? (
          <div className={style.blockValueMuted}>No updates available.</div>
        ) : (
          <ul className={style.updatesList}>
            {updates.map((u, idx) => (
              <li key={`${u.date}-${idx}`} className={style.updateItem}>
                <div className={style.updateTop}>
                  <span className={style.updateStatus}>{u.status}</span>
                  <span className={style.updateDate}>{formatDate(u.date)}</span>
                </div>
                <div className={style.updateMsg}>{u.message}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function parseRmaNumber(rma) {
  const m = String(rma || "").match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

function createNextRma(existingRequests) {
  const maxNum = (existingRequests || []).reduce((max, r) => {
    const n = parseRmaNumber(r?.rma);
    return n > max ? n : max;
  }, 0);

  const next = maxNum + 1;
  return `RMA-${String(next).padStart(5, "0")}`;
}

function loadInitialRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return Array.isArray(requestsData) ? requestsData : [];
}

export default function CustomerViewRequestApp() {
  const [requests, setRequests] = useState(() => loadInitialRequests());

  // persist in localStorage (mock "database")
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch {
      // ignore
    }
  }, [requests]);

  const [tab, setTab] = useState("track"); // "list" | "new" | "track"

  // Track RMA
  const [rma, setRma] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackErrorMsg, setTrackErrorMsg] = useState("");
  const [trackInfoMsg, setTrackInfoMsg] = useState("");
  const [request, setRequest] = useState(null);

  // New Return Request (mock)
  const [newErrorMsg, setNewErrorMsg] = useState("");
  const [newInfoMsg, setNewInfoMsg] = useState("");
  const [newForm, setNewForm] = useState({
    productName: "",
    productModel: "",
    serialNumber: "",
    purchaseDate: "",
    reasonForReturn: "",
    issueDescription: "",
  });

  const clearTrackMessages = () => {
    setTrackErrorMsg("");
    setTrackInfoMsg("");
  };

  const clearNewMessages = () => {
    setNewErrorMsg("");
    setNewInfoMsg("");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const query = normalizeRma(rma);
    clearTrackMessages();
    setRequest(null);

    if (!query) {
      setTrackErrorMsg("Please enter an RMA number.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const found = requests.find((x) => normalizeRma(x.rma) === query);

      if (!found) {
        setTrackErrorMsg("No request found for this RMA number.");
      } else {
        setRequest(found);
        setTrackInfoMsg("Request loaded successfully.");
      }

      setLoading(false);
    }, 200);
  };

  const handleClear = () => {
    setRma("");
    setLoading(false);
    clearTrackMessages();
    setRequest(null);
  };

  const openTrack = () => {
    setTab("track");
    clearNewMessages();
  };

  const openList = () => {
    setTab("list");
    clearTrackMessages();
    clearNewMessages();
  };

  const openNew = () => {
    setTab("new");
    clearTrackMessages();
    clearNewMessages();
  };

  const handlePickFromList = (req) => {
    setRequest(req);
    setRma(req.rma);
    clearTrackMessages();
    setTrackInfoMsg("Request loaded successfully.");
    setTab("track");
  };

  const isNewFormValid = useMemo(() => {
    return (
      newForm.productName.trim() &&
      newForm.productModel.trim() &&
      newForm.serialNumber.trim() &&
      newForm.purchaseDate.trim() &&
      newForm.reasonForReturn.trim() &&
      newForm.issueDescription.trim()
    );
  }, [newForm]);

  const resetNewForm = () => {
    setNewForm({
      productName: "",
      productModel: "",
      serialNumber: "",
      purchaseDate: "",
      reasonForReturn: "",
      issueDescription: "",
    });
  };

  const handleNewSubmit = (e) => {
    e.preventDefault();
    clearNewMessages();

    if (!isNewFormValid) {
      setNewErrorMsg("Please fill in all required fields.");
      return;
    }

    const newRma = createNextRma(requests);
    const nowIso = new Date().toISOString();

    const newReq = {
      rma: newRma,
      type: "Return",
      status: "Submitted",
      createdAt: nowIso,

      // optional (we don't require login)
      customer: {
        fullName: "Guest",
        email: "",
      },

      // mapping to existing schema (brand+model used in cards)
      product: {
        category: "Product",
        brand: newForm.productName.trim(),
        model: newForm.productModel.trim(),
        serialNumber: newForm.serialNumber.trim(),
      },

      purchaseDate: newForm.purchaseDate, // ISO (from input type="date")
      reasonForReturn: newForm.reasonForReturn,
      issueDescription: newForm.issueDescription.trim(),

      updates: [
        {
          date: nowIso,
          status: "Submitted",
          message: "Request submitted successfully.",
        },
      ],
    };

    setRequests((prev) => [newReq, ...prev]);

    // UX: jump to Track and show status immediately
    setRequest(newReq);
    setRma(newReq.rma);
    setTab("track");

    clearTrackMessages();
    setTrackInfoMsg(`Request submitted successfully. Your RMA is ${newReq.rma}.`);

    resetNewForm();
  };

  const handleCancelNew = () => {
    resetNewForm();
    clearNewMessages();
    setNewInfoMsg("Form cleared.");
  };

  return (
    <div className={style.page}>
      <header className={style.portalHeader}>
        <div>
          <h1 className={style.portalTitle}>Customer Portal</h1>
          <p className={style.portalSubtitle}>Track the progress of your return requests</p>
        </div>

        <div className={style.portalActions}>
          <button
            className={`${style.tabBtn} ${tab === "list" ? style.tabBtnActive : ""}`}
            onClick={openList}
            type="button"
          >
            View My Returns
          </button>

          <button
            className={`${style.tabBtn} ${tab === "new" ? style.tabBtnActive : ""}`}
            onClick={openNew}
            type="button"
          >
            New Return Request
          </button>

          <button
            className={`${style.tabBtn} ${tab === "track" ? style.tabBtnActive : ""}`}
            onClick={openTrack}
            type="button"
          >
            Track RMA
          </button>
        </div>
      </header>

      {tab === "track" && (
        <>
          <div className={style.searchCard}>
            <h2 className={style.sectionTitle}>View Request</h2>

            <form className={style.form} onSubmit={handleSearch}>
              <label className={style.label}>
                RMA Number
                <input
                  className={style.input}
                  type="text"
                  placeholder="e.g. RMA-10001"
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

            {trackErrorMsg && <div className={style.alertError}>{trackErrorMsg}</div>}
            {trackInfoMsg && <div className={style.alertOk}>{trackInfoMsg}</div>}
          </div>

          <RequestDetails request={request} />
        </>
      )}

      {tab === "list" && (
        <div className={style.listWrap}>
          <h2 className={style.sectionTitle}>My RMA Requests</h2>

          <div className={style.cardsGrid}>
            {requests.map((req) => (
              <button
                key={req.rma}
                type="button"
                className={style.requestCard}
                onClick={() => handlePickFromList(req)}
              >
                <div className={style.cardTop}>
                  <div className={style.cardTitle}>
                    {req.product?.brand} {req.product?.model}
                  </div>
                  <span className={style.badgeSmall}>{req.status}</span>
                </div>

                <div className={style.cardMeta}>
                  <div>
                    <span className={style.metaLabel}>RMA ID:</span> {req.rma}
                  </div>
                  <div>
                    <span className={style.metaLabel}>Submitted:</span> {formatDate(req.createdAt)}
                  </div>
                </div>

                <div className={style.cardIssue}>
                  <span className={style.metaLabel}>Issue:</span> {req.issueDescription}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "new" && (
        <div className={style.newWrap}>
          <h2 className={style.sectionTitle}>New Return Request</h2>
          <p className={style.sectionSubtitle}>Fill out the form below to submit a return request</p>

          <form className={style.newForm} onSubmit={handleNewSubmit}>
            <div className={style.newGrid}>
              <label className={style.label}>
                Product Name <span aria-hidden="true">*</span>
                <input
                  className={style.input}
                  placeholder="e.g., LED Smart TV"
                  value={newForm.productName}
                  onChange={(e) => setNewForm((p) => ({ ...p, productName: e.target.value }))}
                />
              </label>

              <label className={style.label}>
                Product Model <span aria-hidden="true">*</span>
                <input
                  className={style.input}
                  placeholder="e.g., SMT-5500X"
                  value={newForm.productModel}
                  onChange={(e) => setNewForm((p) => ({ ...p, productModel: e.target.value }))}
                />
              </label>

              <label className={style.label}>
                Serial Number <span aria-hidden="true">*</span>
                <input
                  className={style.input}
                  placeholder="e.g., SN123456789"
                  value={newForm.serialNumber}
                  onChange={(e) => setNewForm((p) => ({ ...p, serialNumber: e.target.value }))}
                />
              </label>

              <label className={style.label}>
                Purchase Date <span aria-hidden="true">*</span>
                <input
                  className={style.input}
                  type="date"
                  value={newForm.purchaseDate}
                  onChange={(e) => setNewForm((p) => ({ ...p, purchaseDate: e.target.value }))}
                />
              </label>

              <label className={style.label}>
                Reason for Return <span aria-hidden="true">*</span>
                <select
                  className={style.input}
                  value={newForm.reasonForReturn}
                  onChange={(e) =>
                    setNewForm((p) => ({ ...p, reasonForReturn: e.target.value }))
                  }
                >
                  <option value="">Select a reason</option>
                  <option value="Defective product">Defective product</option>
                  <option value="Wrong item received">Wrong item received</option>
                  <option value="Damaged on arrival">Damaged on arrival</option>
                  <option value="Performance issues">Performance issues</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className={style.label}>
                Issue Description <span aria-hidden="true">*</span>
                <textarea
                  className={style.input}
                  rows={3}
                  placeholder="Please describe the issue in detail..."
                  value={newForm.issueDescription}
                  onChange={(e) =>
                    setNewForm((p) => ({ ...p, issueDescription: e.target.value }))
                  }
                />
              </label>
            </div>

            <div className={style.actions}>
              <button className={style.primaryBtn} type="submit">
                Submit Request
              </button>
              <button className={style.secondaryBtn} type="button" onClick={handleCancelNew}>
                Cancel
              </button>
            </div>

            {newErrorMsg && <div className={style.alertError}>{newErrorMsg}</div>}
            {newInfoMsg && <div className={style.alertOk}>{newInfoMsg}</div>}
          </form>
        </div>
      )}
    </div>
  );
}
