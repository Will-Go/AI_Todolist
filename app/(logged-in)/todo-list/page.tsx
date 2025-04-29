"use client";

import { supabase } from "@/lib/supabase/client";
import { useState, FormEvent, ChangeEvent, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TodoItem from "@/components/TodoItem";
import { useAuth } from "@/context/AuthContext"; // import useAuth
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { Toaster } from "@/components/ui/sonner";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Groups from "@/components/Groups";
import ChatInputLayout from "@/components/ChatInputLayout";
import { Todo } from "@/components/TodoItem";

//UITLS
import firstletterCap from "@/lib/utils/firstletterCap";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

export default function Page() {
  return (
    <Suspense>
      <TodoListPage />
    </Suspense>
  );
}

function TodoListPage() {
  const { user } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState("");
  const [groupName, setGroupName] = useState("");
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const selectedGroupId = groupId ? groupId : null;

  // Fetch todos belonging to this user
  const { data: todos = [], isLoading: loading } = useQuery({
    queryKey: ["todos", user?.id, selectedGroupId],
    enabled: !!user?.id && selectedGroupId != null,
    queryFn: async () => {
      if (!user?.id || selectedGroupId == null) return [];
      const { data, error } = await supabase
        .from("todos")
        .select(
          "id, task, created_at, modified_at, done_at, is_done, is_edited, position, group_id"
        )
        .eq("user_id", user.id)
        .eq("group_id", selectedGroupId)
        .order("position", { ascending: true });
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  // Mutations
  const {
    mutate: addTodoMutation,
    mutateAsync: addTodoAsync,
    isPending: isAddingTodo,
  } = useMutation({
    mutationFn: async ({
      task,
      newPosition,
    }: {
      task: string;
      newPosition?: number;
    }) => {
      if (!user?.id) throw new Error("No user");
      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            task,
            is_done: false,
            is_edited: false,
            position: newPosition ? newPosition : todos.length,
            user_id: user.id,
            group_id: selectedGroupId!,
          },
        ])
        .select();
      if (error) throw new Error(error.message);
      return data?.[0];
    },
    onSuccess: () => {
      toast.success("Todo added successfully");
      setNewTodo("");
    },

    onError: (error: unknown) =>
      setErrorMsg(error instanceof Error ? error.message : String(error)),
  });

  const updateTodoMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<Todo>;
    }) => {
      const { data, error } = await supabase
        .from("todos")
        .update(updates)
        .eq("id", id)
        .select();
      if (error) throw new Error(error.message);
      return data?.[0];
    },
    onSuccess: () => {
      toast.success("Todo updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["todos", user?.id, selectedGroupId],
      });
      setEditingId(null);
      setEditingTask("");
    },
    onError: (error: unknown) =>
      setErrorMsg(error instanceof Error ? error.message : String(error)),
  });

  const handleDeleteTodo = async (id: number) => {
    setErrorMsg("");
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) throw new Error(error.message);
    toast.success("Todo deleted successfully");
    queryClient.invalidateQueries({
      queryKey: ["todos", user?.id, selectedGroupId],
    });
    return id;
  };

  const addTodo = (e: FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setErrorMsg("");
    addTodoMutation({ task: newTodo });
    queryClient.invalidateQueries({
      queryKey: ["todos", user?.id, selectedGroupId],
    });
  };

  const toggleDone = (todo: Todo) => {
    setErrorMsg("");
    // Optimistically update the cache
    const prevTodos = queryClient.getQueryData<Todo[]>([
      "todos",
      user?.id,
      selectedGroupId,
    ]);
    const newIsDone = !todo.is_done;
    if (prevTodos) {
      queryClient.setQueryData(
        ["todos", user?.id, selectedGroupId],
        prevTodos.map((t) =>
          t.id === todo.id
            ? {
                ...t,
                is_done: newIsDone,
                done_at: new Date().toISOString(),
              }
            : t
        )
      );
    }
    updateTodoMutation.mutate(
      {
        id: todo.id,
        updates: {
          is_done: newIsDone,
          done_at: new Date().toISOString(),
        },
      },
      {
        onError: () => {
          // Roll back on error
          if (prevTodos) {
            queryClient.setQueryData(
              ["todos", user?.id, selectedGroupId],
              prevTodos
            );
          }
          setErrorMsg("Failed to update todo. Please try again.");
        },
      }
    );
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTask(todo.task);
  };

  const saveEdit = (id: number) => {
    setErrorMsg("");
    updateTodoMutation.mutate({
      id,
      updates: {
        task: editingTask,
        is_edited: true,
        modified_at: new Date().toISOString(),
      },
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTask("");
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const oldIndex = todos.findIndex((t) => t.id === active.id);
    const newIndex = todos.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(todos, oldIndex, newIndex);
    // Optimistically update UI
    queryClient.setQueryData(["todos", user?.id, selectedGroupId], reordered);

    // Calculate new position using Fractional Indexing
    let newPosition: number;
    if (newIndex === 0) {
      // Moved to start
      newPosition = reordered[1]?.position ? reordered[1].position - 1 : 0;
    } else if (newIndex === reordered.length - 1) {
      // Moved to end
      newPosition = reordered[reordered.length - 2]?.position
        ? reordered[reordered.length - 2].position + 1
        : reordered.length - 1;
    } else {
      // Between two todos
      const prev = reordered[newIndex - 1].position;
      const next = reordered[newIndex + 1].position;
      newPosition = (prev + next) / 2;
    }
    const movedTodo = reordered[newIndex];
    // Update only the moved todo's position in the DB
    const { error } = await supabase
      .from("todos")
      .update({ position: newPosition })
      .eq("id", movedTodo.id);
    if (error) console.error("update position failed", error);
    // Invalidate to refetch the correct order
    queryClient.invalidateQueries({
      queryKey: ["todos", user?.id, selectedGroupId],
    });
  };

  const handleAIresponse = async (message: string) => {
    const context = `Group_name: ${groupName}, Todos: ${todos
      ?.map((t) => t.task)
      .join(", ")}`;
    const res = await fetch(`/api/task-generator`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, context }),
    });
    const data = await res.json();

    const geminiResponse = data.message as string;

    if (!geminiResponse || geminiResponse.trim() === "NO VALID TOPIC") {
      toast.error("Invalid topic");
      return;
    }

    const tasks = geminiResponse
      .split(",")
      .map((task) => firstletterCap(task.trim()));
    const newPosition = todos.length;

    // Optimistic update: add todos to cache
    const prevTodos =
      queryClient.getQueryData(["todos", user?.id, selectedGroupId]) || [];
    const optimisticTodos = tasks.map((task, i) => ({
      id: `optimistic-${Date.now()}-${i}`,
      task,
      is_done: false,
      is_edited: false,
      position: newPosition + i,
      user_id: user?.id,
      group_id: selectedGroupId,
      created_at: new Date().toISOString(),
      modified_at: null,
      done_at: null,
    }));
    queryClient.setQueryData(
      ["todos", user?.id, selectedGroupId],
      [...todos, ...optimisticTodos]
    );

    try {
      for (const [i, task] of tasks.entries()) {
        await addTodoAsync({ task, newPosition: newPosition + i });
      }
    } catch {
      // Rollback on error
      queryClient.setQueryData(["todos", user?.id, selectedGroupId], prevTodos);
      toast.error("Failed to add todos. Please try again.");
      return;
    }
    // Refetch from server
    queryClient.invalidateQueries({
      queryKey: ["todos", user?.id, selectedGroupId],
    });
  };

  // groupName can be calculated from Groups component if needed
  return (
    <main className="flex-1 flex p-6 space-x-6">
      <Toaster position="top-right" duration={5000} />
      <Groups onGroupNameChange={setGroupName} />
      {/* Main content */}
      <section className="flex flex-col flex-1  mx-12">
        {!selectedGroupId ? (
          <div className="flex flex-1 items-center justify-center text-zinc-400 text-lg">
            Create or select a group to view todos.
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <h1 className="text-3xl font-bold text-zinc-100 mb-6">
              {groupName} Todos
            </h1>
            {errorMsg && (
              <div className="mb-4">
                <div className="bg-red-900/60 border border-red-700 text-red-100 px-4 py-2 rounded-lg shadow">
                  {errorMsg}
                </div>
              </div>
            )}
            <div className="max-w-[800px] w-full mx-auto">
              <ChatInputLayout onSend={handleAIresponse} />
              <form onSubmit={addTodo} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewTodo(e.target.value)
                  }
                  placeholder="Add a new todo..."
                  disabled={loading || isAddingTodo}
                  className="bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
                />
                <button
                  className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-semibold shadow hover:bg-primary/80 transition disabled:opacity-50"
                  type="submit"
                  disabled={loading || isAddingTodo}
                >
                  Add
                </button>
              </form>
            </div>

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext
                items={todos.map((todo) => todo.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="flex-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600">
                  {loading && (
                    <>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <li
                          key={"skeleton-" + i}
                          className="flex items-center justify-between gap-4 bg-zinc-800 border animate-fade-in border-zinc-600 shadow-sm mb-3 p-4 rounded-lg transition-colors duration-300 ease-in-out  hover:bg-zinc-700"
                        >
                          <Skeleton
                            style={{ transitionDelay: `${i * 100}ms` }}
                            className="w-5 h-5 rounded-full"
                          />
                          <Skeleton
                            style={{ transitionDelay: `${i * 100}ms` }}
                            className="flex-1 h-4"
                          />
                        </li>
                      ))}
                    </>
                  )}
                  {!loading && todos.length === 0 && (
                    <li className="text-zinc-500 text-center">
                      No todos in this group!
                    </li>
                  )}
                  {todos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      {...todo}
                      loading={loading}
                      isEditing={editingId === todo.id}
                      editingTask={editingTask}
                      onEdit={({ id, task }) => startEdit({ id, task })}
                      onEditChange={setEditingTask}
                      onSave={saveEdit}
                      onCancel={cancelEdit}
                      onToggleDone={toggleDone}
                      onDelete={handleDeleteTodo}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </section>
    </main>
  );
}
