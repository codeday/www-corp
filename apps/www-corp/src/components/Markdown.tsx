import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkGFM from 'remark-gfm';
import { Heading, Text, List, ListItem, Box } from '@codeday/topo/Atom';
import rehypeRaw from 'rehype-raw';

const HEADING_SIZES = ['4xl', '3xl', 'xl', 'md', 'md', 'md'];
const adjustHeadingLevel = (baseHeadingLevel: number, level: number): number => {
  const newLevel = baseHeadingLevel + level - 1;
  if (newLevel > 6) return 6;
  if (newLevel < 1) return 1;
  return newLevel;
}

interface MarkdownProps {
  baseHeadingLevel?: number;
  allowHtml?: boolean;
  rehypePlugins?: any[];
  [key: string]: any;
}

const Markdown = ({ baseHeadingLevel, allowHtml, ...props }: MarkdownProps) => {
  function h(level: number) {
    return (props: any) => {
      const adjustedLevel = adjustHeadingLevel(baseHeadingLevel || 1, level);
      const m = Math.max((6 - adjustedLevel + 1), 2)
      return (
        <Heading
          as={`h${adjustedLevel}`}
          mb={m}
          mt={m}
          fontSize={HEADING_SIZES[adjustedLevel - 1]}
          {...props}
        />
      );
    }
  }

  const mdTheme = {
    h1: h(1),
    h2: h(2),
    h3: h(3),
    h4: h(4),
    h5: h(5),
    h6: h(6),
    tr: (props: any) => <Box as="tr" {...props} style={{ verticalAlign: 'top' }} />,
    p: (props: any) => <Text mb={4} {...props} />,
    ol: (props: any) => <List mb={6} styleType="decimal" {...props} />,
    ul: (props: any) => <List mb={6} styleType="disc" {...props} />,
    li: (props: any) => <ListItem mb={1} ml={4} pl={4} {...props} />,
  };
  return (
    <ReactMarkdown
      components={ChakraUIRenderer(mdTheme)}
      remarkPlugins={[RemarkGFM]}
      rehypePlugins={allowHtml ? [rehypeRaw, ...(props.rehypePlugins || [])] : (props.rehypePlugins || [])}
      {...props}
    />
  );
};

export default Markdown;
