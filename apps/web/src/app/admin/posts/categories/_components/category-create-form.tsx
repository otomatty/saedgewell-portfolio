"use client";

import { useState } from "react";
import { createBlogCategory } from "../../../../../_actions/blog";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";

const CategoryCreateForm = () => {
	const [name, setName] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await createBlogCategory(name);
		setName("");
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="name">カテゴリー名</Label>
				<Input
					id="name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<Button type="submit">作成</Button>
		</form>
	);
};

export default CategoryCreateForm;
