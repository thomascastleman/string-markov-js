
var fs = require('fs');

// format an ngram for entry into hashmap
function key(gram) {
	return gram.join('^');
}

// format string for training
function trimAndFormat(string, lineBreaks) {
	if (lineBreaks) {
		// replace all excess newlines with single, replace repeated spaces with single space
		var s = string.replace(/\n+/g, ' \n ').replace(/[^\S\n]+/g, ' ');
	} else {
		// remove newlines, reduce spaces
		var s = string.replace(/\n+/g, ' ').replace(/\s+/g, ' ');
	}

	// remove all delimiter char, split into words
	s = s.replace('^', '').split(' ');

	// remove possible empty words
	if (s[0] == '') {
		s.shift();
	}
	if (s.slice(-1)[0] == '') {
		s.pop();
	}

	return s;
}

// dataset constructor for exports
exports.newDataSet = function() {
	return new DataSet();
}

// object to training and markov generation
function DataSet() {
	this.data = {};			// map of ngrams to their possibilities
	this.capitalized = [];	// list of all capitalized ngrams
	this.fullCorpus = "";

	// train on a string using a given ngram size
	this.trainOnString = function(string, ngram, preserveLineBreaks) {
		// if valid ngram
		if (ngram > 0) {
			// populate full corpus
			this.fullCorpus += '\n' + string;

			var words = trimAndFormat(string, preserveLineBreaks);
			var sub;

			// for every possible ngram in text
			for (var i = 0; i < words.length; i++) {
				if (i < words.length - ngram) {
					// get ngram subarray and word following
					sub = words.slice(i, i + ngram);
					next = words[i + ngram];
				} else {
					// wrap around to start of training text for continuity
					sub = words.slice(i, words.length);
					sub.push.apply(sub, words.slice(0, ngram - sub.length));
					next = words[ngram - (words.length - i)];
				}

				// convert to indexable format
				sub = key(sub);

				// add ngram linked to next word in hashmap
				if (this.data[sub]) {
					this.data[sub].push(next);
				} else {
					this.data[sub] = [next];
				}

				// keep track of all capitalized ngrams
				if (sub[0].match(/[A-Z]/g) && this.capitalized.indexOf(sub) == -1) {
					this.capitalized.push(sub);
				}
			}
		}
	}

	// read in a file and train using a given ngram size
	this.trainOnFile = function(filename, ngram, preserveLineBreaks, callback) {
		var self = this;

		// if single file given
		if (typeof filename === 'string' || filename instanceof String) {
			// read given file
			fs.readFile('./' + filename, 'UTF8', function(err, data) {
				if (err) throw err;

				// train on file content string
				self.trainOnString(data, ngram, preserveLineBreaks);
				callback();
			});

		// if array of filenames given
		} else if (filename instanceof Array) {
			var fullData = "";
			var completed = 0;

			// read each file
			for (var i = 0; i < filename.length; i++) {
				fs.readFile('./' + filename[i], 'UTF8', function(err, data) {
					if (err) throw err;

					completed++;		// increment number of files read
					fullData += '\n' + data;	// add file contents

					// if all files read
					if (completed == filename.length) {
						// train on full string and callback
						self.trainOnString(fullData, ngram, preserveLineBreaks);
						callback();
					}
				});
			}
		}
	}

	// generate a given amount of words based on
	this.generate = function(size, capitalize) {
		// start text with a random ngram chain from hashmap
		var randKey = capitalize && this.capitalized.length > 0 ? this.capitalized : Object.keys(this.data);
		var markovText = randKey[Math.floor(Math.random() * randKey.length)].split('^');
		var ngram = markovText.length;

		if (size >= ngram) {
			// for length requested
			for (var i = 0; i < size - ngram; i++) {
				// extract the last n words from current generated text
				var lastNGram = key(markovText.slice(markovText.length - ngram, markovText.length));

				// get all possible following words
				var possibilities = this.data[lastNGram];

				// apply a random possible next word
				var next = possibilities[Math.floor(Math.random() * possibilities.length)];
				markovText.push(next);
			}

			// join result with spaces
			return markovText.join(' ');
		} else {
			return undefined;
		}
	}

	// check if a string is fully original from the training corpus
	this.checkOriginality = function(string) {
		return this.fullCorpus.indexOf(string) == -1 ? true : false;
	}

	// reset any training data
	this.clearData = function() {
		this.data = {};
		this.capitalized = [];
		this.fullCorpus = "";
	}

	// get all possible words following a given ngram
	this.getPossibilities = function(gram) {
		return this.data[key(gram)];
	}

	// manually add new ngram, word pair to dataset
	this.updateGram = function(gram, next) {
		var k = key(gram);
		if (this.data[k]) {
			this.data[k].push(next);
		} else {
			this.data[k] = [next];
		}
	}
}