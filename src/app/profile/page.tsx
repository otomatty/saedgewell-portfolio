import { PROFILE } from "@/data/profile";
import ProfileHeader from "./_components/ProfileHeader";
import CareerHistory from "./_components/CareerHistory";
import Education from "./_components/Education";
import Qualifications from "./_components/Qualifications";
import ContactForm from "./_components/ContactForm";

export default function ProfilePage() {
	return (
		<div className="min-h-screen py-20">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="space-y-8">
					<ProfileHeader profile={PROFILE} />
					<CareerHistory careerHistory={PROFILE.careerHistory} />
					<Education education={PROFILE.education} />
					<Qualifications qualifications={PROFILE.qualifications} />
					<ContactForm />
				</div>
			</div>
		</div>
	);
}
