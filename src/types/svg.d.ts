// SVG as React component
declare module "*.svg?component" {
  import * as React from "react";
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}

// SVG as static URL (string path)
declare module "*.svg" {
  const src: string;
  export default src;
}
