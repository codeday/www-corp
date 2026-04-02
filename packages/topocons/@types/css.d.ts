// pretend like any css property is valid :)
import type * as CSS from 'csstype';

declare module 'csstype' {
  interface Properties {
    [index: string]: any;
  }
}
