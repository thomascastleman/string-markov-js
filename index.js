
// public hashmap from ngram arrays to all possible following words
exports.nextWord = {};

// remove data from hashmap, reset training
exports.clearTraining = function() {
	exports.nextWord = {};
}

// train on a string using a given ngram size
exports.trainOnString = function(string, ngram) {
	var words = trimAndFormat(string);
	var sub;

	// for every possible ngram in text
	for (var i = 0; i < words.length; i++) {
		if (i < words.length - ngram) {
			// get ngram subarray
			sub = words.slice(i, i + ngram);
			next = words[i + ngram];
		} else {
			// wrap around
			sub = words.slice(i, words.length);
			var ind = ngram - sub.length;
			sub.push.apply(sub, words.slice(0, ngram - sub.length));
			next = words[ind];
		}

		// add entry to hashmap
		if (exports.nextWord[sub]) {
			exports.nextWord[sub].push(next);
		} else {
			exports.nextWord[sub] = [next];
		}
	}
}

// read in a file and train using a given ngram size
exports.trainOnFile = function(filename, ngram) {

}

// generate a given amount of words based on 
exports.generate = function(size) {
	var key = Object.keys(exports.nextWord);
	var markovText = key[Math.floor(Math.random() * key.length)].split(',');
	var ngram = markovText.length;

	if (size >= ngram) {

		for (var i = 0; i < size - ngram; i++) {
			var lastNGram = markovText.slice(markovText.length - ngram, markovText.length);

			// get all possible following words
			var possibilities = exports.nextWord[lastNGram];

			// get random next word
			var next = possibilities[Math.floor(Math.random() * possibilities.length)];
			markovText.push(next);
		}

		return markovText.join(' ');
	} else {
		return undefined;
	}
}

// format string for training
function trimAndFormat(string) {
	// replace all excess newlines with spaces and then replace repeated spaces with single space, and split
	var s = string.replace(/\n+/g, ' ').replace(/\s+/g, ' ').split(' ');
	
	// remove possible empty words
	if (s[0] == '') {
		s.shift();
	}
	if (s.slice(-1)[0] == '') {
		s.pop();
	}

	return s;
}


var test = "\n \ncontent here are those and here are those other some words\n\n\n\n\n and here\n is another word\n\n\n ";

// console.log(trimAndFormat(test));

exports.trainOnString(test, 3);

var text = exports.generate(3);

console.log(text);