"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TaskInput } from "./types";

export async function getTasks(projectId: string) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("tasks")
			.select(`
        *,
        project_milestones (
          id,
          title
        )
      `)
			.eq("project_id", projectId)
			.order("priority", { ascending: true })
			.order("created_at", { ascending: false });

		if (error) throw error;
		return { data, error: null };
	} catch (error) {
		console.error("Error fetching tasks:", error);
		return { data: null, error };
	}
}

export async function createTask(input: TaskInput) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("tasks")
			.insert({
				project_id: input.projectId,
				milestone_id: input.milestoneId,
				title: input.title,
				description: input.description,
				status: input.status,
				priority: input.priority,
				due_date: input.dueDate?.toISOString(),
			})
			.select()
			.single();

		if (error) throw error;
		revalidatePath(`/admin/projects/${input.projectId}`);
		return { data, error: null };
	} catch (error) {
		console.error("Error creating task:", error);
		return { data: null, error };
	}
}

export async function updateTask(id: string, input: Partial<TaskInput>) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("tasks")
			.update({
				milestone_id: input.milestoneId,
				title: input.title,
				description: input.description,
				status: input.status,
				priority: input.priority,
				due_date: input.dueDate?.toISOString(),
				updated_at: new Date().toISOString(),
			})
			.eq("id", id)
			.select()
			.single();

		if (error) throw error;
		revalidatePath(`/admin/projects/${input.projectId}`);
		return { data, error: null };
	} catch (error) {
		console.error("Error updating task:", error);
		return { data: null, error };
	}
}

export async function deleteTask(id: string, projectId: string) {
	try {
		const supabase = await createClient();
		const { error } = await supabase.from("tasks").delete().eq("id", id);

		if (error) throw error;
		revalidatePath(`/admin/projects/${projectId}`);
		return { error: null };
	} catch (error) {
		console.error("Error deleting task:", error);
		return { error };
	}
}
