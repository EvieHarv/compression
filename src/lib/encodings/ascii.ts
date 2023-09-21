/**
 * Simple function to convert a string into an ASCII representation of itself.
 */
const StringToASCII = (str: string): string => {
  let StringOut = "";
  for (let i = 0; i < str.length; i++) {
    StringOut += str.charCodeAt(i).toString(2).padStart(8, "0");
  }
  return StringOut;
};

export default StringToASCII;
