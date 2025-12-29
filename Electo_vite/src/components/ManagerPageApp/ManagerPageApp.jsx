import { useMemo } from "react";
import style from "./ManagerPageApp.module.css";

import { FiTrendingUp } from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdOutlinePendingActions } from "react-icons/md";
import { RiCheckboxCircleLine } from "react-icons/ri";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from "recharts";

import StatCard from "./StatCard.jsx";
import ChartCard from "./ChartCard.jsx";
import RecentRmaTable from "./RecentRmaTable.jsx";

const mockStats = [
  { label: "Total RMAs", value: 85, trend: "+12%", icon: <BsBoxSeam /> },
  { label: "Pending Review", value: 12, trend: "+3", icon: <MdOutlinePendingActions /> },
  { label: "Completed", value: 45, trend: "+8%", icon: <RiCheckboxCircleLine /> },
  { label: "Avg Resolution Time", value: "4.5 days", trend: "Avg", icon: <AiOutlineClockCircle /> },
];

const mockMonthlyTrend = [
  { month: "Jul", completed: 40, total: 45 },
  { month: "Aug", completed: 48, total: 50 },
  { month: "Sep", completed: 44, total: 47 },
  { month: "Oct", completed: 56, total: 60 },
  { month: "Nov", completed: 52, total: 58 },
  { month: "Dec", completed: 28, total: 35 },
];

const mockStatusDist = [
  { name: "Completed", value: 53 },
  { name: "In Repair", value: 18 },
  { name: "Pending Review", value: 14 },
  { name: "Approved", value: 9 },
  { name: "Rejected", value: 6 },
];

const mockCategoryBars = [
  { category: "Audio Devices", value: 28 },
  { category: "Computing", value: 22 },
  { category: "Gaming", value: 18 },
  { category: "Mobile Devices", value: 12 },
];

const mockRecent = [
  { id: "RMA-2024-156", customer: "Sarah Johnson", product: "LED Smart TV", status: "pending" },
  { id: "RMA-2024-155", customer: "Mike Chen", product: "Wireless Headphones", status: "in-repair" },
  { id: "RMA-2024-154", customer: "Emma Davis", product: "Gaming Mouse", status: "approved" },
  { id: "RMA-2024-153", customer: "James Wilson", product: "Bluetooth Speaker", status: "completed" },
  { id: "RMA-2024-152", customer: "Lisa Anderson", product: "Laptop", status: "in-repair" },
];

// keep colors simple; your CSS can style labels if you want.
// recharts needs an array for pie segments.
const PIE_COLORS = ["#22c55e", "#f97316", "#facc15", "#3b82f6", "#ef4444"];

export default function ManagerPageApp() {
  const performance = useMemo(() => ([
    { title: "Resolution Rate", value: "94.1%", delta: "+2.3% from last month", accent: "green" },
    { title: "Customer Satisfaction", value: "4.6/5.0", delta: "+0.2 from last month", accent: "blue" },
    { title: "Avg Processing Time", value: "2.8 days", delta: "-0.5 days from last month", accent: "orange" },
  ]), []);

  return (
    <div className={style.container}>
      <header className={style.header}>
        <div className={style.headerIcon}><FiTrendingUp /></div>
        <div>
          <h1 className={style.title}>Manager Dashboard</h1>
          <p className={style.subtitle}>Analytics &amp; Insights</p>
        </div>
      </header>

      {/* KPI cards */}
      <section className={style.statsGrid}>
        {mockStats.map((s) => (
          <StatCard
            key={s.label}
            icon={s.icon}
            label={s.label}
            value={s.value}
            trend={s.trend}
          />
        ))}
      </section>

      {/* Charts row 1 */}
      <section className={style.grid2}>
        <ChartCard title="Monthly RMA Trend">
          <div className={style.chartWrap}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={mockMonthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" strokeWidth={2} dot />
                <Line type="monotone" dataKey="total" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
            <div className={style.legendHint}>
              <span>Completed</span>
              <span>Total Requests</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Status Distribution">
          <div className={style.chartWrap}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={mockStatusDist}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {mockStatusDist.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      {/* Charts row 2 */}
      <section className={style.grid2}>
        <ChartCard title="RMAs by Product Category">
          <div className={style.chartWrap}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockCategoryBars}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Recent RMA Requests">
          <RecentRmaTable rows={mockRecent} />
        </ChartCard>
      </section>

      {/* Performance metrics */}
      <section className={style.performanceCard}>
        <h2 className={style.performanceTitle}>Performance Metrics</h2>
        <div className={style.performanceGrid}>
          {performance.map((m) => (
            <div key={m.title} className={`${style.metric} ${style["accent_" + m.accent]}`}>
              <div className={style.metricTitle}>{m.title}</div>
              <div className={style.metricValue}>{m.value}</div>
              <div className={style.metricDelta}>{m.delta}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
