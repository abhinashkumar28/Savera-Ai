import { ListTodo, Calendar, User, AlertCircle } from "lucide-react";
import { tasks } from "../data/mockData";

const priorityColors = {
  High: "bg-savera-danger/10 text-savera-danger",
  Medium: "bg-savera-amber/10 text-savera-amber",
  Low: "bg-savera-text-dim/10 text-savera-text-dim",
};

const statusColors = {
  Open: "bg-savera-info/10 text-savera-info",
  "In Progress": "bg-savera-amber/10 text-savera-amber",
  Completed: "bg-savera-success/10 text-savera-success",
};

export default function TasksPage() {
  const openTasks = tasks.filter(t => t.status === "Open");
  const inProgressTasks = tasks.filter(t => t.status === "In Progress");
  const completedTasks = tasks.filter(t => t.status === "Completed");

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-bold text-white">Corrective Actions & Tasks</h2>
        <p className="text-sm text-savera-text-dim mt-1">
          Track tasks created from anomaly alerts • Assign, monitor, and verify savings
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-savera-border bg-savera-card p-4 text-center">
          <p className="text-2xl font-bold text-savera-info">{openTasks.length}</p>
          <p className="text-xs text-savera-text-dim mt-1">Open</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4 text-center">
          <p className="text-2xl font-bold text-savera-amber">{inProgressTasks.length}</p>
          <p className="text-xs text-savera-text-dim mt-1">In Progress</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4 text-center">
          <p className="text-2xl font-bold text-savera-success">{completedTasks.length}</p>
          <p className="text-xs text-savera-text-dim mt-1">Completed</p>
        </div>
      </div>

      {/* Task columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Open */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-savera-info" />
            <h3 className="text-sm font-semibold text-white">Open</h3>
            <span className="text-xs text-savera-text-dim">({openTasks.length})</span>
          </div>
          <div className="space-y-3">
            {openTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-savera-amber" />
            <h3 className="text-sm font-semibold text-white">In Progress</h3>
            <span className="text-xs text-savera-text-dim">({inProgressTasks.length})</span>
          </div>
          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Completed */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-savera-success" />
            <h3 className="text-sm font-semibold text-white">Completed</h3>
            <span className="text-xs text-savera-text-dim">({completedTasks.length})</span>
          </div>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>

      {/* Savings verification note */}
      <div className="rounded-xl border border-savera-border bg-savera-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-4 w-4 text-savera-info" />
          <h3 className="text-sm font-semibold text-white">Savings Verification</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-savera-border p-3">
            <span className="text-xs text-savera-text-dim">Estimated Savings (all recommendations)</span>
            <p className="text-lg font-bold text-white mt-1">32.5 kWh/day • ₹260/day</p>
            <p className="text-xs text-savera-text-dim mt-1">Based on anomaly deviations</p>
          </div>
          <div className="rounded-lg border border-savera-success/20 bg-savera-success/5 p-3">
            <span className="text-xs text-savera-text-dim">Verified Savings (post-action)</span>
            <p className="text-lg font-bold text-savera-success mt-1">4.0 kWh/day • ₹32/day</p>
            <p className="text-xs text-savera-text-dim mt-1">From 1 completed task with readings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: typeof tasks[0] }) {
  return (
    <div className="rounded-lg border border-savera-border bg-savera-card p-4 hover:border-savera-amber/20 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-white leading-snug">{task.title}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-savera-text-dim">
          <User className="h-3 w-3" />
          <span>{task.assignee}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-savera-text-dim">
          <Calendar className="h-3 w-3" />
          <span>Due: {task.dueDate}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-savera-text-dim">
          <ListTodo className="h-3 w-3" />
          <span>{task.buildingName}</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-savera-border flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status]}`}>
          {task.status}
        </span>
        {task.status !== "Completed" && (
          <button className="text-xs text-savera-amber hover:text-savera-amber-light transition-colors">
            Update →
          </button>
        )}
      </div>
    </div>
  );
}
