import React from 'react';
import PropTypes from 'prop-types';
import { Link, Image } from '@codeday/topo/Atom';
import StaticContent from './StaticContent';
import { dedupeFirstByKey } from '../utils/arr';
import { useQuery } from '../query';

export default function PreviousCoverageLogos({ num, ...props }) {
  const { cms: { coverageLogos } } = useQuery();
  const pubs = dedupeFirstByKey(coverageLogos.items
    .filter((pub) => pub.publicationLogo), 'publicationName').slice(0, num);

  return (
    <StaticContent>
      {
        pubs.map((pub) => (
          <Link href={pub.url} target="_blank" rel="noopener" key={pub.url}>
            <Image src={pub.publicationLogo.url} alt={pub.publicationName} d="inline-block" {...props} />
          </Link>
        ))
      }
    </StaticContent>
  );
}

PreviousCoverageLogos.propTypes = {
  num: PropTypes.number,
};
PreviousCoverageLogos.defaultProps = {
  num: 5,
};
