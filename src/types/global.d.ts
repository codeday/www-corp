declare module '*.gql' {
  import { DocumentNode } from 'graphql';
  const content: any;
  export = content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
