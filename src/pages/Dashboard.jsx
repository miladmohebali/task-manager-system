import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchReport();
  }, [statusFilter]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
        params: statusFilter ? { status: statusFilter } : {},
      });
      setTasks(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (err) {
      setError("خطا در دریافت تسک‌ها!");
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data); // ذخیره لیست کاربران عادی
    } catch (err) {
      console.error("خطا در دریافت کاربران:", err);
    }
  };

  const fetchReport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/reports/tasks-summary",
        {
          headers: {
            Authorization: `Bearer ${token}`, // ارسال توکن احراز هویت
          },
        }
      );
      setReport(response.data);
    } catch (error) {
      console.error("خطا در دریافت گزارش‌ها:", error);
    }
  };
  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]); // اضافه کردن تسک جدید به لیست
  };

  const assignTask = async (taskId, userId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/tasks/${taskId}/assign`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks(); // به‌روزرسانی لیست تسک‌ها
    } catch (err) {
      console.error("خطا در اختصاص تسک:", err);
    }
  };
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks(); // به‌روزرسانی لیست تسک‌ها
    } catch (err) {
      console.error("خطا در تغییر وضعیت تسک:", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // به‌روزرسانی لیست تسک‌ها
    } catch (err) {
      console.error("خطا در حذف تسک:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // حذف توکن
    navigate("/login"); // هدایت به صفحه ورود
  };

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  return (
    <div className={styles.container}>
      <h2>داشبورد مدیریت تسک‌ها</h2>
      <TaskForm onTaskCreated={handleTaskCreated} />
      <select
        onChange={(e) => setStatusFilter(e.target.value)}
        value={statusFilter}
      >
        <option value="">همه تسک‌ها</option>
        <option value="pending">در انتظار</option>
        <option value="in-progress">در حال انجام</option>
        <option value="completed">تکمیل‌شده</option>
      </select>
      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <li key={task._id} className={styles.taskItem}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>وضعیت: {task.status}</p>
            <p>
              اختصاص به:
              {task.assignee ? task.assignee.username : "بدون اختصاص"}
            </p>

            <button
              className={styles.button}
              onClick={() => updateTaskStatus(task._id, "in-progress")}
            >
              در حال انجام
            </button>
            <button
              className={styles.button}
              onClick={() => updateTaskStatus(task._id, "completed")}
            >
              تکمیل‌شده
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => deleteTask(task._id)}
            >
              حذف
            </button>
            <select onChange={(e) => assignTask(task._id, e.target.value)}>
              <option value="">انتخاب کاربر</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
      <h2>امتیازات کاربران</h2>
      <table>
        <thead>
          <tr>
            <th>نام کاربری</th>
            <th>امتیاز</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.assignee.username}</td>
              <td>{task.assignee.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>گزارش پروژه</h2>
      {report ? (
        <div>
          <p>کل تسک‌ها: {report.totalTasks}</p>
          <p>تسک‌های تکمیل‌شده: {report.completedTasks}</p>
          <p>تسک‌های در حال انجام: {report.inProgressTasks}</p>
          <p>تسک‌های در انتظار: {report.pendingTasks}</p>
          <p>درصد تکمیل پروژه: {report.completionPercentage.toFixed(2)}%</p>

          <h3>گزارش عملکرد کاربران</h3>
          <table>
            <thead>
              <tr>
                <th>نام کاربر</th>
                <th>تسک‌های تکمیل‌شده</th>
                <th>تسک‌های در انتظار</th>
                <th>تسک‌های در حال انجام</th>
              </tr>
            </thead>
            <tbody>
              {report.userTaskSummary.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.completedTasks}</td>
                  <td>{user.pendingTasks}</td>
                  <td>{user.inProgressTasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>در حال بارگیری...</p>
      )}
      <button onClick={handleLogout} className={styles.logoutButton}>
        خروج از حساب
      </button>
    </div>
  );
};

export default Dashboard;
