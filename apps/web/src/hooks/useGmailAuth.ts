"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { gmailAuthState } from "../store/gmail";
import { getGmailCredentials } from "../_actions/gmail";

export function useGmailAuth() {
	const [auth, setAuth] = useAtom(gmailAuthState);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const credentials = await getGmailCredentials();
				setAuth({
					isAuthenticated: !!credentials,
					isLoading: false,
					error: null,
				});
			} catch (error) {
				setAuth({
					isAuthenticated: false,
					isLoading: false,
					error: (error as Error).message,
				});
			}
		};

		checkAuth();
	}, [setAuth]);

	const startAuth = () => {
		window.location.href = "/api/auth/gmail";
	};

	return {
		...auth,
		startAuth,
	};
}
