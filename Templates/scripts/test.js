async function create_code_example(tp) { 
	var title= await tp.file.title.selection()
	
	return `
    #glossary
    `
} 

module.exports = create_code_example