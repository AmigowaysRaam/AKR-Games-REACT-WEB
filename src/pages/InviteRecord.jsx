import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Headphones } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function InviteRecord() {
  const navigate = useNavigate();

  const [showTimeSheet, setShowTimeSheet] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [selectedTime, setSelectedTime] = useState("Today");

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const timeOptions = ["Today", "Yesterday", "7 Days", "15 Days"];

  const handleApplyFilter = () => {
    setSelectedTime(
      `${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`
    );
    setShowCalendar(false);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ChevronLeft />
        </button>
        Invitation record
        <Headphones style={styles.iconRight} size={18}  onClick={() => navigate('/CustomerSupport')} />
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <button style={styles.filterBtn}>Recharge ▾</button>

        {/* 🔥 Filter opens calendar */}
        <button
          style={styles.filterBtn}
          onClick={() => setShowCalendar(true)}
        >
          Filter ▾
        </button>

        <button
          style={styles.filterBtn}
          onClick={() => setShowTimeSheet(true)}
        >
          {selectedTime} ▾
        </button>
      </div>

      {/* Empty State */}
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>📭</div>
        <p style={styles.emptyText}>
          No matching invitation record
        </p>

        <button style={styles.inviteBtn}>Invite</button>
      </div>

      {/* ⏱ TIME SHEET */}
      {showTimeSheet && (
        <div style={styles.overlay} onClick={() => setShowTimeSheet(false)}>
          <div
            style={styles.sheet}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.sheetHeader}>
              Select a time
              <span
                style={styles.close}
                onClick={() => setShowTimeSheet(false)}
              >
                ✕
              </span>
            </div>

            {timeOptions.map((item) => (
              <div
                key={item}
                style={styles.sheetItem}
                onClick={() => {
                  setSelectedTime(item);
                  setShowTimeSheet(false);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
      {showCalendar && (
        <div style={styles.overlay} onClick={() => setShowCalendar(false)}>
          <div
            style={styles.calendarSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.sheetHeader}>
              Select Date Range
              <span
                style={styles.close}
                onClick={() => setShowCalendar(false)}
              >
                ✕
              </span>
            </div>

            <DateRange
              editableDateInputs={true}
              onChange={(item) =>
                setDateRange([item.selection])
              }
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
            />

            <button
              style={styles.applyBtn}
              onClick={handleApplyFilter}
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    background: "#f4f6fb",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },

  header: {
    background: "#fff",
    padding: "14px",
    textAlign: "center",
    fontWeight: 600,
    position: "relative",
    borderBottom: "1px solid #eee",
  },

  backBtn: {
    position: "absolute",
    left: 10,
    top: 10,
    border: "none",
    background: "none",
    cursor: "pointer",
  },

  iconRight: {
    position: "absolute",
    right: 12,
    top: 14,
  },

  filters: {
    display: "flex",
    gap: 10,
    padding: 12,
    background: "#fff",
  },

  filterBtn: {
    padding: "6px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#f9fafb",
    fontSize: 12,
    cursor: "pointer",
  },

  emptyContainer: {
    textAlign: "center",
    marginTop: 80,
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 10,
  },

  emptyText: {
    color: "#888",
    marginBottom: 20,
  },

  inviteBtn: {
    background: "linear-gradient(90deg,#7c3aed,#a855f7)",
    border: "none",
    color: "#fff",
    padding: "12px 40px",
    borderRadius: 25,
    fontWeight: 600,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "flex-end",
  },

  sheet: {
    background: "#fff",
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: 16,
    width: "100%", maxWidth: 430, display: "flex",
    margin: "0 auto",
    flexDirection: "column",
  }, calendarSheet: {
    background: "#fff",
    width: "100%",
    maxWidth: 430, margin: "0 auto", bordErTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    height: "65vh",
    display: "flex",
    flexDirection: "column",
  },

  sheetHeader: {
    fontWeight: 600,
    marginBottom: 10,
    position: "relative",
  },

  close: {
    position: "absolute",
    right: 0,
    cursor: "pointer",
  },

  sheetItem: {
    padding: "12px 0",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },

  applyBtn: {
    width: "100%",
    marginTop: 10,
    padding: 12,
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
  },
};