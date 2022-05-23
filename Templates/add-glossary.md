
<%*
new_title = tp.file.selection()
new_folder = "99_glossary"

await tp.file.create_new(
	template = "Templates/word",
	filename = new_title,
	open_new = false,
	folder = new_folder
);
%>