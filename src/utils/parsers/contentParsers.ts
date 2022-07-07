const playlistTrackParser = (items: any[]) => {
  if (!items || !Array.isArray(items)) return [];

  const result = [];

  for (const item of items) {
    const track = {
      id: item.track.id,
      name: item.track.name,
      cover: item.track.album.images[0].url,
      artists: item.track.artists.map((artist: any) => artist.name).join(', '),
    };
    result.push(track);
  }

  return result;
};

export {playlistTrackParser};
