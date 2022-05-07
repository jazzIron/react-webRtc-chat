declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.less' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.svg' {
  import React = require('react');
  // const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  // export default ReactComponent;
  const content: any;
  export default content;
}

declare module '*.json' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.gif' {
  const value: any;
  export = value;
}

declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.jpg' {
  const value: any;
  export = value;
}

declare module '*.jpeg' {
  const value: any;
  export = value;
}

declare module '*.woff';
declare module '*.otf';
