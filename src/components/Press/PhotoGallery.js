import React, { useState } from 'react';
import { Grid } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useQuery } from '../../query';
import Photo from './Photo';
import PhotoTagPicker from './PhotoTagPicker';
import shuffle from 'knuth-shuffle-seeded';

export default function PhotoGallery({seed, ...props}) {
  const [filter, setFilter] = useState(null);
  const { cms: { pressPhotos } } = useQuery();
  const photos = shuffle((pressPhotos?.items || []).map(m => m), seed);
  console.log(seed);

  return (
    <Content wide {...props}>
      <PhotoTagPicker mb={8} photos={photos} onChange={setFilter} />
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)'}} gap={4}>
        {photos.filter((photo) => !filter || photo.tags?.includes(filter)).map((photo) => (
          <Photo rounded={2} height={40} photo={photo} />
        ))}
      </Grid>
    </Content>
  );
}
