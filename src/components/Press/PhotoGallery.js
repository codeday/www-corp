import React, { useState } from 'react';
import { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import { useQuery } from '../../query';
import Photo from './Photo';
import PhotoTagPicker from './PhotoTagPicker';

export default function PhotoGallery(props) {
  const [filter, setFilter] = useState(null);
  const { cms: { pressPhotos } } = useQuery();
  const photos = pressPhotos?.items || [];

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
