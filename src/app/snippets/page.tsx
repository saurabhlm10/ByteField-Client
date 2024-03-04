import CodeSnippets from "@/components/CodeSnippets";

const sampleCode = `
// Write your code here

var lengthOfLongestSubstring = function(s) {
   const charSet = new Set();

  let l = 0;

  let highestLength = 0;

  for (let r = 0; r < s.length; r++) {
    while (charSet.has(s[r])) {
      charSet.delete(s[l]);
      l += 1;
    }
    charSet.add(s[r]);
    highestLength = Math.max(highestLength, charSet.size);
  }

  return highestLength;
};

const s = 'pweddk'

console.log(lengthOfLongestSubstring('a'))
`;

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
