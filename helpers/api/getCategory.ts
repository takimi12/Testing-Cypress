export const getCategories = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/category`, {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch categories");
        }

        return res.json();
    } catch (error) {}
};