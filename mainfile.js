var finder = require('findit')(process.argv[2] || '\.'); //required to get the base dir path from command line
var path = require('path')
           , cmd = require('commander')
           , chalk = require('chalk');


var lower_case = /^([a-z]+|[^a-z0-9][a-z]+)$/             //regex for filename validation
	, lower_case_with_hyphen = ''
	, lower_case_with_underscore = ''
	, camel_case = ''
	, upper_case = '/[A-Z]/';
	//, exclude = ['node_modules', 'bower_component', '.git', '.svn', '.hg'];

cmd
	//.version(pkg.version)
	//.description(pkg.description)
	.usage('[--path][--custom-regex][--exclude][--use-gitignore]')
	.option('-c, --custom-regex', 'format type to check.', upper_case)
	//.option('-i, --use-gitignore', 'don\'t use ".gitignore"', true)
	//.option('-x, --exclude', 'files or Folder to exclude. ', exclude)
	.option('-p, --path <folder path>', 'folder path to run a filename check', process.cwd())
	.parse(process.argv);


var validateFileNames = {
    
    Folders: [],
	Files: [],
	files_with_error: [],
	folders_with_error: [], 

 readAllDirs: finder.on('directory', function (dir, stat, stop) {
     
    var base = path.basename(dir);
   
   // if (base === '.git' || base === 'node_modules') stop()  //** Manually filter the dirs **//
   
     
     if(!validateFileNames.isLowerCase(base))
           validateFileNames.folders_with_error.push(base);
     
         validateFileNames.Folders.push(base);
         
}),

//** read the files name for validation **//
 
readAllFiles: finder.on('file', function (file, stat) {
   var basefile = path.basename(file);
   if(!validateFileNames.isLowerCase(basefile))
         validateFileNames.files_with_error.push(basefile);
    
     validateFileNames.Files.push(file);
       
}),

    
statLink: finder.on('link', function (link, stat) {
   // console.log(link);
}),
  
//** logging at the end of traversal **//
endOfFile: finder.on('end',function (link,stat)
          {
   validateFileNames.displayResults();
   console.log("Done"); 
}),  

    
 displayResults: function () {
                console.log(process.argv[2]);
                console.log("====================================");
				console.log(chalk.blue('Total Folders Scanned:'), chalk.white(validateFileNames.Folders.length));
				console.log(chalk.blue('Total Files Scanned:'), chalk.white(validateFileNames.Files.length));
				console.log("====================================");
				console.log(chalk.red('Folders (lower case violation):'), chalk.red(validateFileNames.folders_with_error.length));
				console.log(chalk.red('Files (lower case violation):'), chalk.red(validateFileNames.files_with_error.length));
				console.log("====================================");
	},
	
    //** checking **//
    isLowerCase: function (stringToCheck) {
		return lower_case.test(stringToCheck);
	}
    
};


// if (cmd.path) {
// 	// console.log("Path: " + cmd.path);
// //	validateFileNames.readAllFiles(cmd.path);
// }

