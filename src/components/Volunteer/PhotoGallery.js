import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text from '@codeday/topo/Atom/Text';
import Image from '@codeday/topo/Atom/Image';
import { useQuery } from '../../query';

export default function PhotoGallery(props) {
  const { cms } = useQuery();
  const volunteerPhotoGallery = cms?.volunteerPhotoGallery?.items || [];

  return (
    <Grid
      templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(5, 1fr)' }}
      gap={8}
      {...props}
    >
      {volunteerPhotoGallery.map((vol, i) => (
        <Box
          d={{
            base: i >= 4*2 ? 'none' : 'block',
            md: i >= 3*3 ? 'none' : 'block',
            lg: i >= 3*3 ? 'none' : 'block',
            xl: i >= 3*5 ? 'none' : 'block',
          }}
        >
          <Image src={vol.photo.url} rounded="sm" alt="" />
          <Text fontSize="xs" mb={0} color="current.textLight">
            {vol.event.title}{vol.region?.name && ', '}{vol.region.name}
          </Text>
        </Box>
      ))}
    </Grid>
  )
}
