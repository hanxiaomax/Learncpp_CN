# anyway this is a script for pichuli
# do not upload to git
import pathlib
import re

CONTENT_PATH = "content"
INDEX_REG = re.compile(r"^([0-9A-Z]+\-[0-9a-zA-Z]+)\-.*\.md$")
TITLE_REG = re.compile(r"(title:\s)[0-9]+\.[0-9a-zA-Z]+( \- .*)")
ALIAS_REG = re.compile(r"(alias:\s)[0-9]+\.[0-9a-zA-Z]+( \- .*)")

def rename_title_and_alias():
    content = pathlib.Path(CONTENT_PATH)
    for root, dir, files in content.walk():
        if len(dir) != 0:
            continue
        for file in files:
            mdfile = pathlib.Path(root, file)
            reg_result = INDEX_REG.findall(file)
            if len(reg_result) == 0:
                continue
            new_index = reg_result[0].replace("-", ".")
            try:
                with open(mdfile, "r+", encoding="utf-8") as f:
                    full_content = f.read()
                    modified_content = ALIAS_REG.sub(rf"\g<1>{new_index}\g<2>", TITLE_REG.sub(rf"\g<1>{new_index}\g<2>", full_content))
                    f.seek(0)
                    f.write(modified_content)
                    f.truncate()
            except IOError as e:
                print(e)
                continue

rename_title_and_alias()

