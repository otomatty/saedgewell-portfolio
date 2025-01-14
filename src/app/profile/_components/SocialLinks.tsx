import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";
import type { Profile } from "@/types";

type Props = {
	contacts: Profile["contacts"];
};

export default function SocialLinks({ contacts }: Props) {
	return (
		<div className="flex gap-4 justify-center md:justify-start mt-6">
			<Button variant="outline" size="icon" asChild>
				<a href={`mailto:${contacts.email}`} aria-label="メール">
					<Mail className="h-4 w-4" />
				</a>
			</Button>
			<Button variant="outline" size="icon" asChild>
				<a
					href={contacts.github}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="GitHub"
				>
					<Github className="h-4 w-4" />
				</a>
			</Button>
			<Button variant="outline" size="icon" asChild>
				<a
					href={contacts.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="LinkedIn"
				>
					<Linkedin className="h-4 w-4" />
				</a>
			</Button>
		</div>
	);
}
