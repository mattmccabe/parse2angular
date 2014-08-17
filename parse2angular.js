module.exports = function(grunt) {
	

	grunt.registerMultiTask('parse2angular', 'Create an Angular Service for a Parse.com Backend Object', function() {
	    // Merge task-specific and/or target-specific options with these defaults.
	    var options = this.options({
	    	prototypeBeginKey :'/*parse2angular:prototype*/',
	    	prototypeEndKey: '/*parse2angular:end*/'
	    });

	    this.files.forEach(function(f) {
	    	grunt.log.warn(JSON.stringify(f));
		    var serviceInfo = f.src.filter(function(filepath) {
		      	// Warn on and remove invalid source files (if nonull was set).
		      	if (!grunt.file.exists(filepath) || filepath.indexOf('.json') === -1) {
		          grunt.log.warn('Source file "' + filepath + '" not found, or is not a json file');
		          return false;
		        } else {
		          return true;
		        }
	    	}).map(function(filepath) {
		        // Read file source. 
		        var model = JSON.parse(grunt.file.read(filepath));
		        var parseName = model.parseObject;
		        var parseProps = model.parseProps;
		        var angularModule = model.angularModule;

		        var parseDef = '\tvar ' + parseName + ' = Parse.Object.extend("' + parseName + '", {}, {});\n';
		        var serviceHeader = 'angular.module("' + angularModule + '").factory("' + parseName + '", function() {\n';

		        var serviceFooter = '\treturn ' + parseName + ';\n});';
		        var prototypeDef = "";
		        var fileName = filepath.substring(filepath.lastIndexOf('/')+1);
		        fileName = fileName.substring(0, fileName.lastIndexOf('.json'));

		        parseProps.forEach(function(prop) {
		        	prototypeDef += '\tObject.defineProperty(' + parseName + '.prototype, "' + prop + '",';
		        	prototypeDef += '\n\t\tget: function() {\n\t\t\treturn this.get("'+ prop + '");\n\t\t},';
		        	prototypeDef += '\n\t\tset: function(val) {\n\t\t\treturn this.set("'+ prop + '", val);\n\t\t}\n\t});\n';
		        	
		        });

		        

		        var result =  {
		        	parseDef : parseDef,
		        	prototypeDef : prototypeDef,
		        	serviceHeader : serviceHeader,
		        	serviceFooter : serviceFooter,
		        	outputFileName : fileName
		        };
		 
		        return result;
		    }).forEach(function(serviceInfo){
		    	var outputFile = options.outputDir + serviceInfo.outputFileName + '.js';
			    if(!grunt.file.exists(outputFile))
			    {
			    	var output = serviceInfo.serviceHeader + '\n' + serviceInfo.parseDef + '\n' + options.prototypeBeginKey + '\n' + serviceInfo.prototypeDef + '\n' + options.prototypeEndKey + '\n' + serviceInfo.serviceFooter;
			    	grunt.file.write(outputFile, output);
			    }
			    else
			    {
			    	//Just rewrite the prototype
			    	var output = grunt.file.read(outputFile);
			    	var newOutput = output.substring(0, output.indexOf(options.prototypeBeginKey) + options.prototypeBeginKey.length + 1);
			    	newOutput += '\n' + serviceInfo.prototypeDef + '\n';
			    	newOutput += output.substring(output.indexOf(options.prototypeEndKey));
					grunt.file.write(outputFile, newOutput);
			    }	
		    });
		});
	});
};