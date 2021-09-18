import Highlight, { defaultProps } from "prism-react-renderer";

import codeTheme from "../components/codeTheme";

export default function Code({ children, language }) {
  return (
    <div className="code">
      <Highlight
        {...defaultProps}
        theme={codeTheme}
        code={children}
        language={language}
        className="code"
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <div className={className} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </div>
        )}
      </Highlight>
      <style jsx>{`
        .code {
          padding-top: 16px;
          padding-bottom: 16px;
        }
      `}</style>
    </div>
  );
}
