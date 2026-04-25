import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCheckIcon, ChevronLeft, Headphones, Inspect, PanelRightOpen, Timer } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { getInviteRecords } from "../services/authService";
import GameLoader from "./LoaderComponet";

export default function InviteRecord() {
  const navigate = useNavigate();

  const [showTimeSheet, setShowTimeSheet] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Today");
  const [apiDataRec, setapiDataRec] = useState(null);

  const [loading, setloading] = useState(false);


  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const timeOptions = ["Today", "Yesterday", "7 Days", "15 Days"];

  // ✅ Format date to YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleApplyFilter = () => {
    const start = formatDate(dateRange[0].startDate);
    const end = formatDate(dateRange[0].endDate);

    setSelectedTime(`${start} - ${end}`);
    setShowCalendar(false);
    fetchbonusData(start, end);
  };

  const fetchbonusData = async (startDate, endDate) => {
    try {
      setloading(true);
      const payload = {
        from_date: startDate || null,
        to_date: endDate || null,
      };
      const res = await getInviteRecords(payload);
      if (res?.success) {
        setapiDataRec(res);
      }
    } catch (err) {
      console.error(err);
    }
    finally {
      setloading(false);
    }
  };

  // ✅ Initial load (no filter)
  useEffect(() => {
    fetchbonusData();
  }, []);

  if (loading) {
    return <GameLoader />
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ChevronLeft />
        </button>
        Invitation record
        <Headphones
          style={styles.iconRight}
          size={18}
          onClick={() => navigate("/CustomerSupport")}
        />
      </div>
      <div style={styles.filters}>
        <button style={styles.filterBtn} onClick={() => setShowCalendar(true)}>
          {selectedTime} ▾
        </button>
      </div>
      {apiDataRec?.data?.length > 0 ? (
        <div style={{ padding: 12 }}>
          {apiDataRec.data.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles?.phone}>{item.username}</div>
                  <div style={styles?.email}>{item.phone}</div>
                </div>
                <div
                  style={{
                    ...styles.statusBadge,
                    background: item.is_verified ? "#dcfce7" : "#fee2e2",
                    color: item.is_verified ? "#16a34a" : "#dc2626",
                  }}
                >
                  {item.is_verified ? <CheckCheckIcon /> : <Timer />}
                </div>
              </div>

              <div style={styles.divider} />
              {/* <p>{JSON.stringify(item,null,)}</p> */}

              <div style={styles.cardBody}>
                <div>
                  <div style={styles.labelSmall}>email</div>
                  <div style={styles.wallet}>{item?.email}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={styles.labelSmall}>Joined</div>
                  <div style={styles.date}>
                    {new Date(item?.joined_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📭</div>
          <p style={styles.emptyText}>No matching invitation record</p>
        </div>
      )}

      {/* Calendar */}
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
              editableDateInputs
              onChange={(item) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
            />

            <button style={styles.applyBtn} onClick={handleApplyFilter}>
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

  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#7c3aed",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
  },

  phone: {
    fontSize: 14,
    fontWeight: 600,
  },
  email: {
    fontSize: 12,
    color: "#777",
  },
  statusBadge: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 20,
    fontWeight: 500,
  },
  divider: {
    height: 1,
    background: "#eee",
    margin: "10px 0",
  },

  cardBody: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  labelSmall: {
    fontSize: 11,
    color: "#888",
  },

  wallet: {
    color: "#16a34a",
    fontWeight: 700,
    fontSize: 15,
  },

  date: {
    fontWeight: 500,
    fontSize: "15px",
    fontFamily: ""
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 10,
  },

  emptyText: {
    color: "#888",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "flex-end",
  },

  calendarSheet: {
    background: "#fff",
    width: "100%",
    maxWidth: 430,
    margin: "0 auto",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    height: "65vh",
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