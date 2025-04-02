export const getTopics = async () => {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/topics`, {
			cache: "no-store",
		});

		if (!res.ok) {
			throw new Error("Failed to fetch topics");
		}

		return res.json();
	} catch (error) {}
};
