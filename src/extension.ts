import * as vscode from 'vscode';

function generateOrthodoxClass(className: string): string {
    return (
`#ifndef ${className.toUpperCase()}_HPP
# define ${className.toUpperCase()}_HPP

# include <iostream>

class ${className}
{
public:
    // Default Constructor
    ${className}();
    
    // Copy Constructor
    ${className}(const ${className}& other);
    
    // Copy Assignment Operator
    ${className}& operator=(const ${className}& other);
    
    // Destructor
    ~${className}();
};

#endif
`);
}

function generateOrthodoxClassCpp(className: string): string {
    return `#include "${className}.hpp"

// Default Constructor
${className}::${className}() {
    std::cout << "${className} default constructor called" << std::endl;
}

// Copy Constructor
${className}::${className}(const ${className}& other) {
    std::cout << "${className} copy constructor called" << std::endl;
    *this = other;
}

// Copy Assignment Operator
${className}& ${className}::operator=(const ${className}& other) {
    std::cout << "${className} copy assignment operator called" << std::endl;
    if (this != &other) {
        // Copy attributes here
    }
    return *this;
}

// Destructor
${className}::~${className}() {
    std::cout << "${className} destructor called" << std::endl;
}
`;
}


async function createFileInFolder(fileName : string) {
	if (vscode.workspace.workspaceFolders === undefined 
		|| vscode.workspace.workspaceFolders?.length === 0) {
		vscode.window.showErrorMessage('No open folder!');
		return ;
	}
    const folderUri = vscode.window.activeTextEditor 
		? vscode.Uri.joinPath(vscode.window.activeTextEditor.document.uri, "..")
		: vscode.workspace.workspaceFolders[0].uri;
    const hppFileUri = vscode.Uri.joinPath(folderUri, fileName + ".hpp");
	const cppFileUri = vscode.Uri.joinPath(folderUri, fileName + ".cpp");
	const hppContent = Buffer.from(generateOrthodoxClass(fileName));
	const cppContent = Buffer.from(generateOrthodoxClassCpp(fileName));

    try {
        await vscode.workspace.fs.writeFile(hppFileUri, hppContent);
		await vscode.workspace.fs.writeFile(cppFileUri, cppContent);
    } catch (error : any) {
        vscode.window.showErrorMessage('Error creating the file: ' + error);
    }
}


export function activate(context: vscode.ExtensionContext) {

	let options : vscode.InputBoxOptions = {
		placeHolder : "Insert the class name"
	};
	const disposable = vscode.commands.registerCommand('42-orthodox-generator-cpp.generateClass', () => {
		vscode.window.showInputBox(options).then((fileName)=>{
			if (fileName === undefined || fileName.length === 0) {
				vscode.window.showInformationMessage('No name provided!');
			} else {
				createFileInFolder(fileName);
			}
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
