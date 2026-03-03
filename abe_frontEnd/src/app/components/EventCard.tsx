import { Calendar, Clock, MapPin, Users, Eye, Info, CheckSquare, Square, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export interface PlanningTask {
  id: string;
  label: string;
  completed: boolean;
}

export function EventCard({ 
  title, 
  date, 
  time, 
  location, 
  rsvps, 
  capacity, 
  status, 
  views, 
  scheduledPost, 
  notes,
  tasks,
  onTaskToggle,
  onTaskAdd,
  onTaskDelete,
  onClick
}: { 
  title: string; 
  date: string; 
  time: string; 
  location: string; 
  rsvps?: number; 
  capacity?: number; 
  status: 'live' | 'scheduled' | 'draft'; 
  views?: number;
  scheduledPost?: string;
  notes?: string;
  tasks?: PlanningTask[];
  onTaskToggle?: (eventTitle: string, taskId: string) => void;
  onTaskAdd?: (eventTitle: string, taskLabel: string) => void;
  onTaskDelete?: (eventTitle: string, taskId: string) => void;
  onClick?: () => void;
}) {
  const [newTaskLabel, setNewTaskLabel] = useState("");

  const statusColors = {
    live: 'bg-green-100 text-green-700 border-green-200',
    scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
    draft: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const statusLabels = {
    live: 'Published',
    scheduled: 'Scheduled',
    draft: 'Draft'
  };

  // Calculate planning progress for draft events
  const planningProgress = tasks && tasks.length > 0
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  const handleAddTask = () => {
    if (newTaskLabel.trim() && onTaskAdd) {
      onTaskAdd(title, newTaskLabel.trim());
      setNewTaskLabel("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg p-4 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:border-[#4b2e83]' : 'hover:shadow-md'
      }`}
      onClick={(e) => {
        if (onClick) {
          console.log('EventCard clicked:', title);
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>

      {status === 'live' && rsvps !== undefined && capacity !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-[#4b2e83]" />
              <span className="text-gray-700">
                <strong>{rsvps}</strong> / {capacity} RSVPs
              </span>
            </div>
            {views && (
              <div className="flex items-center gap-2 text-gray-600">
                <Eye size={14} />
                <span>{views} views</span>
              </div>
            )}
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#4b2e83] h-2 rounded-full transition-all" 
              style={{ width: `${(rsvps / capacity) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {status === 'scheduled' && scheduledPost && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Clock size={14} />
            <span>Scheduled to post: <strong>{scheduledPost}</strong></span>
          </div>
        </div>
      )}

      {status === 'draft' && notes && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Info size={14} className="mt-0.5 flex-shrink-0" />
            <span>{notes}</span>
          </div>
        </div>
      )}

      {tasks && tasks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-2 text-sm group">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskToggle && onTaskToggle(title, task.id);
                  }}
                  className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                >
                  {task.completed ? (
                    <CheckSquare size={16} className="text-green-600" />
                  ) : (
                    <Square size={16} className="text-gray-400" />
                  )}
                </button>
                <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {task.label}
                </span>
                {onTaskDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskDelete(title, task.id);
                    }}
                    className="p-0.5 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete task"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {status === 'draft' && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Planning Progress</span>
                <span className="font-semibold text-[#4b2e83]">{planningProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    planningProgress === 100 ? 'bg-green-600' : 'bg-[#b7a57a]'
                  }`}
                  style={{ width: `${planningProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {status === 'draft' && (
        <div className="mt-3 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTaskLabel}
              onChange={(e) => setNewTaskLabel(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new planning task..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b2e83] focus:border-transparent"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddTask();
              }}
              disabled={!newTaskLabel.trim()}
              className="px-4 py-2 bg-[#4b2e83] text-white text-sm rounded-md hover:bg-[#3b2366] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}