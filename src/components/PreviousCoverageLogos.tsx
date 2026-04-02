import React from 'react';
import { Link, Image } from '@codeday/topo/Atom';
import StaticContent from './StaticContent';
import { dedupeFirstByKey } from '../utils/arr';
import { useQuery } from '../query';

interface PreviousCoverageLogosProps {
  num?: number;
  [key: string]: any;
}

export default function PreviousCoverageLogos({ num = 5, ...props }: PreviousCoverageLogosProps) {
  const { cms: { coverageLogos } } = useQuery();
  const pubs = dedupeFirstByKey(coverageLogos.items
    .filter((pub: any) => pub.publicationLogo), 'publicationName').slice(0, num);

  return (
    <StaticContent>
      {
        pubs.map((pub: any) => (
          <Link href={pub.url} target="_blank" rel="noopener" key={pub.url}>
            <Image src={pub.publicationLogo.url} alt={pub.publicationName} display="inline-block" {...props} />
          </Link>
        ))
      }
    </StaticContent>
  );
}
