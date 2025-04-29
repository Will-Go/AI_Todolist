"use client";

import Tooltip from "./Tooltip";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmationDialog from "./ConfirmationDialog";
import Dialog from "./Dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

interface GroupProps {
  id: number;
  name: string;
  selected: boolean;
  collapsed: boolean;
  onSelect: (id: number) => void;
  onEdit: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
}

const Group: React.FC<GroupProps> = ({
  id,
  name,
  selected,
  collapsed,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleEdit = () => {
    setOpenEditDialog(false);
    onEdit(id, newName);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleDelete = () => {
    setOpenDialog(false);
    onDelete(id);
  };

  return (
    <div
      className={`flex items-center justify-between mb-2 ${
        collapsed ? "justify-center" : ""
      }`}
    >
      {collapsed ? (
        <Tooltip content={name} arrow={false} side="right" sideOffset={4}>
          <button
            className={`flex-1 text-center px-3 py-2 rounded-lg transition-colors duration-200 ${
              selected
                ? "bg-primary text-primary-foreground"
                : "text-zinc-200 hover:bg-zinc-700"
            } px-0 text-center truncate`}
            onClick={() => onSelect(id)}
            aria-label={name}
          >
            {name.charAt(0).toUpperCase()}
          </button>
        </Tooltip>
      ) : (
        <button
          className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
            selected
              ? "bg-primary text-primary-foreground"
              : "text-zinc-200 hover:bg-zinc-700"
          }`}
          onClick={() => onSelect(id)}
          title={name}
        >
          {name}
        </button>
      )}
      {!collapsed && (
        <div className="flex space-x-2 ml-2 ">
          <button
            onClick={() => setOpenEditDialog(true)}
            className="text-zinc-400 hover:text-accent transition-all duration-300 ease-in-out"
          >
            <Pencil size={16} />
          </button>
          <>
            <button
              onClick={() => setOpenDialog(true)}
              className="text-zinc-400 hover:text-red-500 transition-all duration-300 ease-in-out"
            >
              <Trash2 size={16} />
            </button>
            <ConfirmationDialog
              open={openDialog}
              onOpenChange={setOpenDialog}
              title="Delete Group?"
              content={`Deleting this group will remove all tasks inside "${name}". This action cannot be undone.`}
              cancelText="Cancel"
              confirmText="Delete"
              onCancel={() => setOpenDialog(false)}
              onConfirm={handleDelete}
              danger
            />
            <Dialog
              open={openEditDialog}
              onOpenChange={setOpenEditDialog}
              title="Edit Group Name"
            >
              <form onSubmit={handleEdit}>
                <Input
                  type="text"
                  value={newName}
                  className="text-white"
                  onChange={(e) => handleEditChange(e)}
                />
                <div className="flex gap-2 mt-4 justify-end">
                  <Button
                    type="button"
                    onClick={() => setOpenEditDialog(false)}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" variant={"secondary"}>
                    Save
                  </Button>
                </div>
              </form>
            </Dialog>
          </>
        </div>
      )}
    </div>
  );
};

export default Group;
