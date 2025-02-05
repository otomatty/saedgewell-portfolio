import { Slash } from "lucide-react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AdminBreadcrumbProps {
	items: {
		id: number;
		href?: string;
		label: string;
		current?: boolean;
	}[];
}

export function AdminBreadcrumb({ items }: AdminBreadcrumbProps) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem key={items[0].id}>
					{items[0].current ? (
						<BreadcrumbPage>{items[0].label}</BreadcrumbPage>
					) : (
						<BreadcrumbLink href={items[0].href}>
							{items[0].label}
						</BreadcrumbLink>
					)}
				</BreadcrumbItem>
				{items.length > 1 && <BreadcrumbSeparator />}
				{items.length > 1 && (
					<BreadcrumbItem key={items[1].id}>
						{items[1].current ? (
							<BreadcrumbPage>{items[1].label}</BreadcrumbPage>
						) : (
							<BreadcrumbLink href={items[1].href}>
								{items[1].label}
							</BreadcrumbLink>
						)}
					</BreadcrumbItem>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
