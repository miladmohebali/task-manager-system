import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/TaskForm.module.css";

const TaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/tasks",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onTaskCreated(response.data); // ارسال تسک جدید به لیست تسک‌ها
      setFormData({ title: "", description: "", status: "pending" }); // پاک کردن فرم
    } catch (err) {
      setError("خطا در ایجاد تسک! لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <div className={styles.container}>
      <h3>افزودن تسک جدید</h3>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          name="title"
          placeholder="عنوان تسک"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          className={styles.input}
          name="description"
          placeholder="توضیحات"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <button className={styles.button} type="submit">
          افزودن تسک
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
