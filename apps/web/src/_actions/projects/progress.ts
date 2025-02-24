"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ProgressLogInput } from "./types";

export async function getProgressLogs(projectId: string) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("project_progress_logs")
			.select(`
        *,
        project_milestones (
          id,
          title
        ),
        tasks (
          id,
          title
        )
      `)
			.eq("project_id", projectId)
			.order("created_at", { ascending: false });

		if (error) throw error;
		return { data, error: null };
	} catch (error) {
		console.error("Error fetching progress logs:", error);
		return { data: null, error };
	}
}

export async function createProgressLog(input: ProgressLogInput) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("project_progress_logs")
			.insert({
				project_id: input.projectId,
				milestone_id: input.milestoneId,
				task_id: input.taskId,
				log_type: input.logType,
				description: input.description,
				hours_spent: input.hoursSpent,
			})
			.select()
			.single();

		if (error) throw error;
		revalidatePath(`/admin/projects/${input.projectId}`);
		return { data, error: null };
	} catch (error) {
		console.error("Error creating progress log:", error);
		return { data: null, error };
	}
}

export async function deleteProgressLog(id: string, projectId: string) {
	try {
		const supabase = await createClient();
		const { error } = await supabase
			.from("project_progress_logs")
			.delete()
			.eq("id", id);

		if (error) throw error;
		revalidatePath(`/admin/projects/${projectId}`);
		return { error: null };
	} catch (error) {
		console.error("Error deleting progress log:", error);
		return { error };
	}
}
