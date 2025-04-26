import React, { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/checkbox";
import Tooltip from "./Tooltip";
import { GripVerticalIcon, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export interface Todo {
  id: number;
  task: string;
  created_at?: string;
  modified_at?: string;
  is_done?: boolean;
  is_edited?: boolean;
  done_at?: string;
}

export interface TodoItemProps extends Todo {
  loading: boolean;
  isEditing: boolean;
  editingTask: string;
  onEdit: (todo: { id: number; task: string }) => void;
  onEditChange: (value: string) => void;
  onSave: (id: number) => void;
  onCancel: () => void;
  onToggleDone: (todo: Todo) => void;
  onDelete: (id: number) => Promise<number>;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  task,
  created_at,
  modified_at,
  done_at,
  is_done,
  is_edited,
  loading,
  isEditing,
  editingTask,
  onEdit,
  onEditChange,
  onSave,
  onCancel,
  onToggleDone,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(id);
    setIsDeleting(false);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col bg-zinc-800 border animate-fade-in border-zinc-600 shadow-sm mb-3 p-4 rounded-lg transition-colors duration-300 ease-in-out  hover:bg-zinc-700",
        is_done ? "opacity-60" : "",
        isDeleting && "animate-pulse-fast"
      )}
    >
      <div className="flex items-center justify-between ">
        {isEditing ? (
          <div className="flex items-center justify-between w-full">
            <input
              className="bg-zinc-900 border border-zinc-500 text-zinc-100 rounded px-2 py-1 mr-2 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
              value={editingTask}
              onChange={(e) => onEditChange(e.target.value)}
              disabled={loading}
            />
            <div>
              <button
                className="text-green-400 hover:text-green-300 font-medium mr-2"
                onClick={() => onSave(id)}
                disabled={loading || !editingTask.trim()}
              >
                Save
              </button>
              <button
                className="text-zinc-400 hover:text-zinc-300 font-medium"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <Tooltip
              side="left"
              content={isDragging ? "Dragging" : "Drag to sort"}
              sideOffset={10}
            >
              <button
                {...attributes}
                {...listeners}
                className="mr-3 p-1 cursor-grab! active:cursor-grabbing text-zinc-400 hover:text-zinc-200 transition-colors"
                aria-label="Drag todo"
              >
                <GripVerticalIcon size={20} />
              </button>
            </Tooltip>
            <Checkbox
              checked={!!is_done}
              onCheckedChange={() =>
                onToggleDone({
                  id,
                  task,
                  created_at,
                  modified_at,
                  is_done,
                  is_edited,
                })
              }
              className="mr-3"
              disabled={loading}
              aria-label="Mark todo as done"
            />
            <span
              className={`flex-1 ${
                is_done ? "line-through text-zinc-500" : "text-zinc-100"
              }`}
            >
              {task}
            </span>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="p-1.5 rounded-full hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/60"
                  aria-label="Open menu"
                  disabled={loading}
                  type="button"
                >
                  <MoreVertical size={18} className="text-zinc-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-36 p-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg"
              >
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-blue-500 hover:bg-zinc-700 rounded transition-all disabled:opacity-60"
                  onClick={() => onEdit({ id, task })}
                  disabled={loading || is_done}
                  type="button"
                >
                  <Pencil size={16} className="mr-2" /> Edit
                </button>
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-red-500 hover:bg-zinc-700 rounded transition-all disabled:opacity-60"
                  onClick={handleDelete}
                  disabled={loading || isDeleting}
                  type="button"
                >
                  <Trash2 size={16} className="mr-2" /> Delete
                </button>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>
      <div className="text-xs italic text-zinc-400 ml-2">
        {is_done && done_at
          ? `Done: ${new Date(done_at).toLocaleString()}`
          : ""}
        {is_done && done_at && " | "}
        {is_edited && modified_at
          ? `Modified: ${new Date(modified_at).toLocaleString()}`
          : ""}
      </div>
    </li>
  );
};

export default TodoItem;
