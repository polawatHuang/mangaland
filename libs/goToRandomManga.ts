export async function goToRandomManga(
  router: { push: (path: string) => void } | null
): Promise<void> {
  if (!router) return;

  try {
    let mangas: { slug: string }[] = [];

    // ✅ Check if cached mangas exist in localStorage
    const cachedMangas = localStorage.getItem("cachedMangas");

    if (cachedMangas) {
      try {
        mangas = JSON.parse(cachedMangas) as { slug: string }[];
      } catch (parseError) {
        console.error("Error parsing cachedMangas:", parseError);
        localStorage.removeItem("cachedMangas"); // Remove invalid cache
      }
    }

    // ✅ If no cached data or invalid data, fetch from API
    if (!Array.isArray(mangas) || mangas.length === 0) {
      const response = await fetch("/api/mangas");
      if (!response.ok) {
        throw new Error("Failed to fetch mangas");
      }
      mangas = (await response.json()) as { slug: string }[];

      // ✅ Validate API response
      if (!Array.isArray(mangas) || mangas.length === 0) {
        throw new Error("API returned empty or invalid data");
      }

      // ✅ Cache the data for future use
      localStorage.setItem("cachedMangas", JSON.stringify(mangas));
    }

    // ✅ Ensure mangas exist
    if (!Array.isArray(mangas) || mangas.length === 0) {
      console.warn("No mangas available");
      return;
    }

    // ✅ Pick a random manga
    const randomIndex = Math.floor(Math.random() * mangas.length);
    const randomManga = mangas[randomIndex];

    // ✅ Ensure the selected manga has a valid slug
    if (!randomManga || !randomManga.slug) {
      console.warn("Selected random manga is invalid:", randomManga);
      return;
    }

    // ✅ Navigate to the selected manga's page
    router.push("/" + randomManga.slug);
  } catch (error) {
    console.error("Error fetching mangas:", error);
  }
}
