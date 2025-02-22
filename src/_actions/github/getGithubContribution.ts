/**
 * GitHub APIからコントリビューションデータを取得し、必要な情報だけを抽出する
 * @param {string} username GitHubのユーザー名
 * @param {string} token GitHubのPersonal Access Token
 * @returns {Promise<Contribution[]>} 加工されたコントリビューションデータ
 */
export interface ContributionDay {
	contributionCount: number;
	date: string;
}

export interface ContributionWeek {
	contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
	totalContributions: number;
	weeks: ContributionWeek[];
}

export interface ContributionsCollection {
	contributionCalendar: ContributionCalendar;
}

export interface User {
	contributionsCollection: ContributionsCollection;
}

export interface Data {
	user: User;
}

export interface Contribution {
	data: Data;
}

export const getGithubContribution = async (
	username: string,
	token: string,
): Promise<ContributionDay[]> => {
	const query = `
    query($userName:String!) {
      user(login: $userName){
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
    `;

	const variables = { userName: username };

	try {
		const response = await fetch("https://api.github.com/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ query, variables }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: Contribution = await response.json();

		// contributionDaysの配列を抽出
		const contributionDays =
			data.data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
				(week) => week.contributionDays,
			);

		return contributionDays;
	} catch (error) {
		console.error("Error fetching contribution data:", error);
		throw error;
	}
};
