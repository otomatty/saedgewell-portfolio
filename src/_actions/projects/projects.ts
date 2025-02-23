"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ProjectInput } from "./types";

export async function getProjects() {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("projects")
			.select("*")
			.order("last_activity_at", { ascending: false });

		if (error) throw error;
		return { data, error: null };
	} catch (error) {
		console.error("Error fetching projects:", error);
		return { data: null, error };
	}
}

export async function getProjectById(id: string) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("projects")
			.select("*")
			.eq("id", id)
			.single();

		if (error) throw error;
		return { data, error: null };
	} catch (error) {
		console.error("Error fetching project:", error);
		return { data: null, error };
	}
}

export async function createProject(input: ProjectInput) {
	try {
		const supabase = await createClient();
		const { data: user } = await supabase.auth.getUser();

		if (!user.user) throw new Error("User not found");

		const { data, error } = await supabase
			.from("projects")
			.insert({
				name: input.name,
				description: input.description,
				emoji: input.emoji,
				user_id: user.user.id,
			})
			.select()
			.single();

		if (error) throw error;
		revalidatePath("/admin/projects");
		return { data, error: null };
	} catch (error) {
		console.error("Error creating project:", error);
		return { data: null, error };
	}
}

export async function updateProject(id: string, input: Partial<ProjectInput>) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("projects")
			.update({
				name: input.name,
				description: input.description,
				emoji: input.emoji,
				updated_at: new Date().toISOString(),
			})
			.eq("id", id)
			.select()
			.single();

		if (error) throw error;
		revalidatePath(`/admin/projects/${id}`);
		return { data, error: null };
	} catch (error) {
		console.error("Error updating project:", error);
		return { data: null, error };
	}
}

export async function deleteProject(id: string) {
	try {
		const supabase = await createClient();
		const { error } = await supabase.from("projects").delete().eq("id", id);

		if (error) throw error;
		revalidatePath("/admin/projects");
		return { error: null };
	} catch (error) {
		console.error("Error deleting project:", error);
		return { error };
	}
}
