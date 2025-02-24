interface Episode {
  episode: number;
  created_date: string;
}

const filterEpisodes = (episodes: Episode[], input: string): Episode[] => {
  if (!input.trim()) return episodes; // Return all episodes if input is empty or just spaces

  // Check if input is a range (e.g., "1-12")
  const rangeMatch = input.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    const [, startStr, endStr] = rangeMatch;
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);

    if (!isNaN(start) && !isNaN(end)) {
      return episodes.filter((ep) => ep.episode >= start && ep.episode <= end);
    }
  }

  // Otherwise, return episodes that contain the input as a substring
  return episodes.filter((ep) => ep.episode.toString().includes(input));
};

export default filterEpisodes;
