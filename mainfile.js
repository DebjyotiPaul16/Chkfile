#! /usr/bin/env node

var userArgs = process.argv.slice(2);
var searchPattern = userArgs[0];

var finder = require('findit')(searchPattern);

var path = require('path')
           ,byline = require('byline')
           , cmd = require('commander')
           , chalk = require('chalk')
           ,async = require("async")
           ,pkg = require(path.join(__dirname, '../package.json'))
            fs = require('fs');


var lower_case = /^([a-z]+|[^a-z0-9][a-z]+)$/
	, lower_case_with_hyphen = ''
	, lower_case_with_underscore = ''
	, camel_case = ''
        ,linedata=''
	, upper_case = '/[A-Z]/'
        ,file = fs.createWriteStream('array.txt')
        stream = fs.createReadStream('filename.txt');
	excludeArr =['node_modules', 'bower_component', '.git', '.svn', '.hg'];
    
   stream = byline.createStream(stream);

cmd
	.version(pkg.version)
	.description(pkg.description)
	.usage('[--path][--custom-regex][--exclude][--use-gitignore]')
	.option('-c, --custom-regex', 'format type to check.', upper_case)
	.option('-i, --use-gitignore', 'don\'t use ".gitignore"', true)//
	.option('-x, --exclude [names]', 'files or Folder to exclude. ')
	.option('-p, --path <folder path>', 'folder path to run a filename check',process.cwd())

	cmd.parse(process.argv);


var validateFileNames = {
    
    Folders: [],
	Files: [],
	files_with_error: [],
	folders_with_error: [], 
    
    
//readAllFiles: function (srcPath,excludeArr) {
     
    
excludeArr: stream.on('data', function(line) {
   
    lineData=line.toString();
    excludeArr.push(lineData);
}),
    
fileReadError:stream.on('end',function(){
//console.log("END");
}),


readAllDirs: finder.on('directory', function (dir, stat, stop) {
     
    var base = path.basename(dir);
    // console.log(base);
    if (excludeArr.indexOf(base)>-1) 
    {
        stop()
    }
    else
     {
     if(!validateFileNames.isLowerCase(base))
           validateFileNames.folders_with_error.push(base);
            
           validateFileNames.Folders.push(base);
      //  console.log(base);
 }
}),

readAllFiles:finder.on('file', function (file, stat) {
   var basefile = path.basename(file);
   if(!validateFileNames.isLowerCase(basefile))
         validateFileNames.files_with_error.push(basefile);
    
     validateFileNames.Files.push(file);
       
}),

    
// statLink:finder.on('link', function (link, stat) {
//    // console.log(link);
// }),
  
//**** Display log at the end of traversing ****//
  
endOfFile:finder.on('end',function (link,stat)
          {
               validateFileNames.displayResults();
               //**** Writing in text file ****//    
              async.eachSeries(validateFileNames.files_with_error, function (prime, callback) {
                   file.write(prime+'\n');
                   callback(); // Alternatively: callback(new Error());
           }, function (err) {
                              if (err) { throw err; }
                             });
}), 

  //**** Displaying the results ****//  
 displayResults: function () {
            
                console.log("====================================");
				console.log(chalk.blue('Total Folders Scanned:'), chalk.white(validateFileNames.Folders.length));
				console.log(chalk.blue('Total Files Scanned:'), chalk.white(validateFileNames.Files.length));
				console.log("====================================");
				console.log(chalk.red('Folders (lower case violation):'), chalk.red(validateFileNames.folders_with_error.length));
				console.log(chalk.red('Files (lower case violation):'), chalk.red(validateFileNames.files_with_error.length));
				console.log("====================================");
	},
    
    isLowerCase: function (stringToCheck) {
		return lower_case.test(stringToCheck);
	}
    
};



if (cmd.path) {
	// console.log("Path: "+cmd.path);
}
if (cmd.exclude) {
	// console.log('Exclude:',cmd.exclude.split(','));
   
}

