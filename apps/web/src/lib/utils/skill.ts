export const getLevelText = (level: number) => {
	switch (level) {
		case 1:
			return "基礎レベル";
		case 2:
			return "実務経験あり";
		case 3:
			return "実践的";
		case 4:
			return "熟練";
		case 5:
			return "エキスパート";
		default:
			return "不明";
	}
};
