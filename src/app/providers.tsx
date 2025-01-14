"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export function Providers({ children }: { children: React.ReactNode }) {
	const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
	if (!siteKey) {
		throw new Error("Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY");
	}

	return (
		<GoogleReCaptchaProvider
			reCaptchaKey={siteKey}
			scriptProps={{
				async: false,
				defer: false,
				appendTo: "head",
				nonce: undefined,
			}}
		>
			{children}
		</GoogleReCaptchaProvider>
	);
}
