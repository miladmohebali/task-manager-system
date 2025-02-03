const Task = require("../models/Task");
const User = require("../models/User");

exports.getTasksSummary = async (req, res) => {
  const { startDate, endDate, status, userId } = req.query;

  const filter = {};

  // فیلتر براساس تاریخ
  if (startDate) filter.createdAt = { $gte: new Date(startDate) };
  if (endDate)
    filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };

  // فیلتر براساس وضعیت
  if (status) filter.status = status;

  // فیلتر براساس کاربر
  if (userId) filter.assignee = userId;

  try {
    // محاسبه تعداد کل تسک‌ها و وضعیت‌ها
    const totalTasks = await Task.countDocuments(filter);
    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "completed",
    });
    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "pending",
    });
    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "in-progress",
    });

    // محاسبه درصد تکمیل
    const completionPercentage =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // خلاصه تسک‌های هر کاربر
    const userTaskSummary = await User.aggregate([
      {
        $match: { role: "user" }, // فقط کاربران عادی را انتخاب می‌کند
      },
      {
        $lookup: {
          from: "tasks", // نام کالکشن تسک‌ها
          localField: "_id",
          foreignField: "assignee",
          as: "userTasks",
        },
      },
      {
        $project: {
          username: 1,
          completedTasks: {
            $size: {
              $filter: {
                input: "$userTasks",
                as: "task",
                cond: { $eq: ["$$task.status", "completed"] },
              },
            },
          },
          pendingTasks: {
            $size: {
              $filter: {
                input: "$userTasks",
                as: "task",
                cond: { $eq: ["$$task.status", "pending"] },
              },
            },
          },
          inProgressTasks: {
            $size: {
              $filter: {
                input: "$userTasks",
                as: "task",
                cond: { $eq: ["$$task.status", "in-progress"] },
              },
            },
          },
        },
      },
    ]);

    // پاسخ به کلاینت
    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      completionPercentage,
      userTaskSummary,
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating report", error });
  }
};
