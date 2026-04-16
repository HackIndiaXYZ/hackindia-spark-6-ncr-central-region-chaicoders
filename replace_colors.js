
import fs from "node:fs";
import path from "node:path";

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

walkDir("./src", function (filePath) {
  if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
    let content = fs.readFileSync(filePath, "utf8");
    const initial = content;
    
    // Replace purple with cyan for tailwind classes
    content = content.replace(/purple/g, "cyan");
    
    // Replace hardcoded background #050505 with #0f172a
    content = content.replace(/#050505/gi, "#0f172a");
    
    // Replace hardcoded foreground #EDEDED with #f8fafc
    content = content.replace(/#EDEDED/gi, "#f8fafc");
    
    // Replace rgb(138,43,226) with rgb(6,182,212) -> cyan
    // This handles instances like 138,43,226 or 138, 43, 226
    content = content.replace(/138,\s*43,\s*226/g, "6,182,212");
    
    // Replace #0a0a0a with #1e293b (Surface/Cards color)
    content = content.replace(/#0a0a0a/gi, "#1e293b");

    if (content !== initial) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log("Updated", filePath);
    }
  }
});

