/*
 * Game Develop JS Platform
 * Copyright 2013 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the GNU Lesser General Public License.
 */

/**
 * Tools related to storage, for events generated code.
 *
 * @namespace gdjs.evtTools
 * @class storage
 * @static
 * @private
 */
gdjs.evtTools.storage = gdjs.evtTools.storage || {loadedFiles:new Hashtable()};

/**
 * Load into memory a JSON object stored in the local storage object
 * provided by the browser.
 * The JSON object is named GDJS_filename in the localStorage object.
 *
 * @method loadJSONFileFromStorage
 * @param filename {String} The name of the JSON object
 * @static
 * @private
 */
gdjs.evtTools.storage.loadJSONFileFromStorage = function(filename) {
	if ( gdjs.evtTools.storage.loadedFiles.containsKey(filename) )
		return; //Already loaded.

	var rawStr = localStorage.getItem("GDJS_"+filename);
	if ( rawStr !== null )
		gdjs.evtTools.storage.loadedFiles.put(filename, JSON.parse(rawStr));
	else
		gdjs.evtTools.storage.loadedFiles.put(filename, {});
};

/**
 * Unload from memory a JSON object, which is then stored in the local storage 
 * object provided by the browser.
 * The JSON object is named GDJS_filename in the localStorage object.
 *
 * @method loadJSONFileFromStorage
 * @param filename {String} The name of the JSON object
 * @static
 * @private
 */
gdjs.evtTools.storage.unloadJSONFile = function(filename) {
	if ( !gdjs.evtTools.storage.loadedFiles.containsKey(filename) )
		return; //Not loaded.

	var JSONobject = gdjs.evtTools.storage.loadedFiles.get(filename);
	try {
		localStorage.setItem("GDJS_"+filename, JSON.stringify(JSONobject));
	}
	catch(e) {
		//TODO: Handle storage error.
	}

	 gdjs.evtTools.storage.loadedFiles.remove(filename);
};

gdjs.evtTools.storage.clearJSONFile = function(filename) {
	var notPermanentlyLoaded = false;
	if ( !gdjs.evtTools.storage.loadedFiles.containsKey(filename) ) {
		notPermanentlyLoaded = true;
		gdjs.evtTools.storage.loadJSONFileFromStorage(filename);
	}
    
    var JSONobject = gdjs.evtTools.storage.loadedFiles.get(filename);
    for ( var p in JSONobject ) {
        if ( JSONobject.hasOwnProperty(p) )
            delete JSONobject[p];
    }
    
	if ( notPermanentlyLoaded ) gdjs.evtTools.storage.unloadJSONFile(filename);
	return true;
};

gdjs.evtTools.storage.elementExistsInJSONFile = function(filename, element) {
	var notPermanentlyLoaded = false;
	if ( !gdjs.evtTools.storage.loadedFiles.containsKey(filename) ) {
		notPermanentlyLoaded = true;
		gdjs.evtTools.storage.loadJSONFileFromStorage(filename);
	}

	var elemArray = element.split("/");
	var currentElem = gdjs.evtTools.storage.loadedFiles.get(filename);
	for (var i =0;i<elemArray.length;++i) {

		if ( !currentElem[elemArray[i]] ) {
			if ( !notPermanentlyLoaded ) gdjs.evtTools.storage.unloadJSONFile(filename);
			return false;
		}
		
		currentElem = currentElem[elemArray[i]];
	}

	if ( notPermanentlyLoaded ) gdjs.evtTools.storage.unloadJSONFile(filename);
	return true;
};

gdjs.evtTools.storage.deleteElementFromJSONFile = function(filename, element) {
	var notPermanentlyLoaded = false;
	if ( !gdjs.evtTools.storage.loadedFiles.containsKey(filename) ) {
		notPermanentlyLoaded = true;
		gdjs.evtTools.storage.loadJSONFileFromStorage(filename);
	}

	var elemArray = element.split("/");
	var currentElem = gdjs.evtTools.storage.loadedFiles.get(filename);
	for (var i =0;i<elemArray.length;++i) {

		if ( !currentElem[elemArray[i]] ) {
			if ( !notPermanentlyLoaded ) gdjs.evtTools.storage.unloadJSONFile(filename);
			return false;
		}
		
		if ( i == elemArray.length-1)
			delete currentElem[elemArray[i]];
		else
			currentElem = currentElem[elemArray[i]];
	}

	if ( notPermanentlyLoaded ) gdjs.evtTools.storage.unloadJSONFile(filename);
	return true;
};

gdjs.evtTools.storage.writeNumberInJSONFile = function(filename, element, val) {
	var notPermanentlyLoaded = false;
	if ( !gdjs.evtTools.storage.loadedFiles.containsKey(filename) ) {
		notPermanentlyLoaded = true;
		gdjs.evtTools.storage.loadJSONFileFromStorage(filename);
	}

	var elemArray = element.split("/");
	var currentElem = gdjs.evtTools.storage.loadedFiles.get(filename);
	for (var i =0;i<elemArray.length;++i) {

		if ( !currentElem[elemArray[i]] ) currentElem[elemArray[i]] = {};
		
		if ( i == elemArray.length-1)
			currentElem[elemArray[i]].value = val;
		else
			currentElem = currentElem[elemArray[i]];
	}

	if ( notPermanentlyLoaded ) gdjs.evtTools.storage.unloadJSONFile(filename);
	return true;
};

gdjs.evtTools.storage.writeStringInJSONFile = function(filename, element, str) {
	var notPermanentlyLoaded = false;
	if ( !gdjs.evtTools.storage.loadedFiles.containsKey(filename) ) {
		notPermanentlyLoaded = true;
		gdjs.evtTools.storage.loadJSONFileFromStorage(filename);
	}

	var elemArray = element.split("/");
	var currentElem = gdjs.evtTools.storage.loadedFiles.get(filename);
	for (var i =0;i<elemArray.length;++i) {

		if ( !currentElem[elemArray[i]] ) currentElem[elemArray[i]] = {};
		
		if ( i == elemArray.length-1)
			currentElem[elemArray[i]].str = str;
		else
			currentElem = currentElem[elemArray[i]];
	}

	if ( notPermanentlyLoaded ) gdjs.evtTools.storage.unloadJSONFile(filename);
	return true;
};

gdjs.evtTools.storage.readNumberFromJSONFile = function(filename, element, runtimeScene, variable) {
	var notPermanentlyLoaded = false;
	if ( !gdjs.evtTools.storage.loadedFiles.containsKey(filename) ) {
		notPermanentlyLoaded = true;
		gdjs.evtTools.storage.loadJSONFileFromStorage(filename);
	}

	var elemArray = element.split("/");
	var currentElem = gdjs.evtTools.storage.loadedFiles.get(filename);
	for (var i =0;i<elemArray.length;++i) {

		if ( !currentElem[elemArray[i]] ) {
			if ( !notPermanentlyLoaded ) gdjs.evtTools.storage.unloadJSONFile(filename);
			return false;
		}
		
		if ( i == elemArray.length-1 && currentElem[elemArray[i]].value)
			variable.setNumber(currentElem[elemArray[i]].value);
		else
			currentElem = currentElem[elemArray[i]];
	}

	if ( notPermanentlyLoaded ) gdjs.evtTools.storage.unloadJSONFile(filename);
	return true;
};

gdjs.evtTools.storage.readStringFromJSONFile = function(filename, element, runtimeScene, variable) {
	var notPermanentlyLoaded = false;
	if ( !gdjs.evtTools.storage.loadedFiles.containsKey(filename) ) {
		notPermanentlyLoaded = true;
		gdjs.evtTools.storage.loadJSONFileFromStorage(filename);
	}

	var elemArray = element.split("/");
	var currentElem = gdjs.evtTools.storage.loadedFiles.get(filename);
	for (var i =0;i<elemArray.length;++i) {

		if ( !currentElem[elemArray[i]] ) {
			if ( !notPermanentlyLoaded ) gdjs.evtTools.storage.unloadJSONFile(filename);
			return false;
		}
		
		if ( i == elemArray.length-1 && currentElem[elemArray[i]].str)
			variable.setString(currentElem[elemArray[i]].str);
		else
			currentElem = currentElem[elemArray[i]];
	}

	if ( notPermanentlyLoaded ) gdjs.evtTools.storage.unloadJSONFile(filename);
	return true;
};
