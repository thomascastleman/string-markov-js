
var fs = require('fs');

// format an ngram for entry into hashmap
function key(gram) {
	return gram.join('^');

}

// format string for training
function trimAndFormat(string) {
	// replace all excess newlines with spaces, replace repeated spaces with single space, remove delimiter, split into words
	var s = string.replace(/\n+/g, ' ').replace(/\s+/g, ' ').replace('^', '').split(' ');
	
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
	this.data = {};

	// train on a string using a given ngram size
	this.trainOnString = function(string, ngram) {
		var words = trimAndFormat(string);
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
		}
	}

	// read in a file and train using a given ngram size
	this.trainOnFile = function(filename, ngram, callback) {
		var self = this;

		// read given file
		fs.readFile('./' + filename, 'UTF8', function(err, data) {
			if (err) throw err;

			// train on file content string
			self.trainOnString(data, ngram);
			callback();
		});
	}

	// generate a given amount of words based on 
	this.generate = function(size) {
		// start text with a random ngram chain from hashmap
		var randKey = Object.keys(this.data);
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

	// reset any training data
	this.clearData = function() {
		this.data = {};
	}
}



// ----------------------------

var markov = exports;

var corpus1 = markov.newDataSet();

corpus1.trainOnFile('test.txt', 2, function() {
	console.log(corpus1.data);
});


