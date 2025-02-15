import type { BlogCategory } from "@/types/blog";

interface CategoryListProps {
	categories: BlogCategory[];
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
	return (
		<ul>
			{categories.map((category) => (
				<li key={category.id}>{category.name}</li>
			))}
		</ul>
	);
};
