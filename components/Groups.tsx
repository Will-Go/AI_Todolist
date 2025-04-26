"use client";

import React, { FormEvent, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";

import Group from "./Group";

export interface Group {
  id: number;
  name: string;
}

interface GroupsProps {
  groups: Group[];
  selectedGroupId: number | null;
  setSelectedGroupId: (id: number | null) => void;
  newGroupName: string;
  setNewGroupName: (val: string) => void;
  handleAddGroup: (e: FormEvent) => void;
  onUpdateGroup: (id: number, newName: string) => void;
  onDeleteGroup: (id: number) => void;
  groupsLoading: boolean;
}

export default function Groups({
  groups,
  selectedGroupId,
  setSelectedGroupId,
  newGroupName,
  setNewGroupName,
  handleAddGroup,
  onUpdateGroup,
  onDeleteGroup,
  groupsLoading,
}: GroupsProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`transition-all duration-300 bg-zinc-800/80 border border-zinc-700 rounded-2xl p-4 shadow-lg flex flex-col h-full overflow-y-auto overflow-x-hidden ${
        collapsed
          ? "w-16 min-w-[4rem] max-w-16 p-2!"
          : "w-64 min-w-[16rem] max-w-64"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        {!collapsed && (
          <h2
            className={`text-xl font-semibold text-zinc-100 transition-opacity duration-200`}
          >
            Groups
          </h2>
        )}
        <button
          aria-label={collapsed ? "Expand groups" : "Collapse groups"}
          onClick={() => setCollapsed((c) => !c)}
          className=" p-2 rounded text-white! hover:bg-zinc-700 transition items-center"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      {!collapsed && (
        <form onSubmit={handleAddGroup} className="my-4">
          <div className="relative ">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Create new group..."
              className="w-full bg-zinc-700 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-full pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
            />
            <button
              type="submit"
              disabled={!newGroupName.trim()}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/80 text-primary-foreground p-2 rounded-full disabled:opacity-50 transition"
            >
              <Plus size={18} />
            </button>
          </div>
        </form>
      )}

      <div
        className={`flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 overflow-x-hidden ${
          collapsed ? "pt-4" : ""
        }`}
      >
        {groupsLoading ? (
          <div className="flex items-center justify-center h- py-6">
            <Loader2
              className="inline-block w-8 h-8 text-white rounded-full animate-spin"
              aria-label="Loading groups"
            />
          </div>
        ) : (
          groups.map((g) => (
            <Group
              key={g.id}
              id={g.id}
              name={g.name}
              selected={selectedGroupId === g.id}
              collapsed={collapsed}
              onSelect={setSelectedGroupId}
              onEdit={onUpdateGroup}
              onDelete={onDeleteGroup}
            />
          ))
        )}
      </div>
    </aside>
  );
}
