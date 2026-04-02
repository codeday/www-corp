import { withDefaultVariant } from "@chakra-ui/react";

export const extensions: ReturnType<typeof withDefaultVariant>[] = [
  withDefaultVariant({
    variant: 'underline',
    components: ['Link'],
  }),
]