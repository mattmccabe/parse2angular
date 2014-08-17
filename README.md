parse2angular
===========
A grunt task that provides a quick way to create a JavaScript class using Parse.Object.extend that is bindable in Angular.

The task will take the 'files' specified in the tasks' config and for each json file will create an angular factory in the specified output directory as specified in the config.

Use
---
* Include the parse2angular.js as a grunt task
* configure the task in grunt.initConfig
    parse2angular: {
      files: ['<%= yeoman.app %>/parse-models/{,*/}*.json'],
      options: { outputDir: '<%= yeoman.app %>/scripts/services/' }
    }
* JSON file syntax/example (this is the format expected in the json file to provide details to the task on what needs to generated in the angular factory)
    {
		"angularModule":"myModuleName",
		"parseObject":"",
		"parseProps":["prop1", "prop2", "prop3"]
	}
* run the task

Notes
-----
* The task will create files if they have not been created
* For factories that have already been generated the task will only recreate all of the getters/setters
* Task uses the json file name as the angular factory file name
