"use client";

import React, { FormEvent, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Group from "./Group";

import useQueryParams from "@/lib/hooks/useQueryParams";

export interface Group {
  id: number;
  name: string;
}

interface GroupsProps {
  onGroupNameChange: (name: string) => void;
}

export default function Groups({ onGroupNameChange }: GroupsProps) {
  const { user, loading: userLoading } = useAuth();
  const {
    queryParams: { groupId },
    addQueries,
    deleteQueries,
  } = useQueryParams(["groupId"]);
  const queryClient = useQueryClient();
  const [collapsed, setCollapsed] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  // Fetch groups
  const { data: groups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ["groups", user?.id],
    enabled: !!user?.id,

    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("id, name")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  // Create group
  const createGroupMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("groups")
        .insert({ name, user_id: user?.id })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (group) => {
      toast.success("Group created successfully");
      queryClient.invalidateQueries({ queryKey: ["groups", user?.id] });
      addQueries({ groupId: group.id.toString() });
      setNewGroupName("");
    },
  });

  // Delete group
  const deleteGroupMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("groups")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: (id) => {
      toast.success("Group deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["groups", user?.id] });
      if (groupId === id.toString()) deleteQueries("groupId");
    },
  });

  // Rename group
  const renameGroupMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const { data, error } = await supabase
        .from("groups")
        .update({ name })
        .eq("id", id)
        .eq("user_id", user?.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Group renamed successfully");
      queryClient.invalidateQueries({ queryKey: ["groups", user?.id] });
    },
  });

  // Handlers
  const handleAddGroup = (e: FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    createGroupMutation.mutate(newGroupName.trim());
  };

  const handleRenameGroup = (id: number, newName: string) => {
    if (newName?.trim())
      renameGroupMutation.mutate({ id, name: newName.trim() });
  };

  const handleDeleteGroup = (id: number) => {
    deleteGroupMutation.mutate(id);
  };

  const handleSelectGroup = (g: Group) => {
    if (groupId !== g.id.toString()) {
      onGroupNameChange(g.name);
      addQueries({ groupId: g.id.toString() });
    } else {
      deleteQueries("groupId");
    }
  };

  // (removed duplicate collapsed/setCollapsed)

  return (
    <aside
      className={`sticky top-4 self-start transition-all duration-300 bg-zinc-800/80 border border-zinc-700 rounded-2xl p-4 shadow-lg flex flex-col h-full overflow-y-auto overflow-x-hidden ${
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
        {groupsLoading || userLoading ? (
          <div className="flex flex-col gap-2 py-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-10 w-full rounded-xl bg-zinc-700/70"
              />
            ))}
          </div>
        ) : (
          groups.map((g: Group) => (
            <Group
              key={g.id}
              id={g.id}
              name={g.name}
              selected={groupId === g.id.toString()}
              collapsed={collapsed}
              onSelect={() => handleSelectGroup(g)}
              onEdit={handleRenameGroup}
              onDelete={handleDeleteGroup}
            />
          ))
        )}
      </div>
    </aside>
  );
}
