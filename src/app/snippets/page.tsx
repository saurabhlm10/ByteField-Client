import CodeSnippets from "@/components/CodeSnippets";
import { sampleCode } from "@/components/code";

const obj = {
  name: "Big",
  code: sampleCode,
};

const page = () => {
  return (
    <CodeSnippets
      snippets={[
        { name: "Snippet 1", code: 'console.log("Hello, world!");' },
        { name: "Snippet 2", code: 'console.log("Goodbye, world!");' },
        obj,
      ]}
    />
  );
};

export default page;
