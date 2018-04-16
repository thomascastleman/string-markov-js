# string-markov-js
A nodejs package for probabilistically generating text using markov chains.

www.npmjs.com/package/string-markov-js

To install, enter the directory of your node package, and type
```
npm install string-markov-js
```

#### Including the module:
```javascript
var markov = require('string-markov-js');
```

## Creating new training data set
A data set can be trained and can generate text using its training texts. To initialize a new data set, use:
```javascript
var dataset = markov.newDataSet();
```
This way, many different datasets can be trained on different texts, and used concurrently.

## Training

#### From a string
```javascript
var string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";
var ngram = 2;
var preserveLineBreaks = true;

dataset.trainOnString(string, ngram, preserveLineBreaks);
```

#### From a file
```javascript
var filename = 'training.txt';
var ngram = 3;
var preserveLineBreaks = true;

dataset.trainOnFile(filename, ngram, preserveLineBreaks, function() {
	console.log("Training complete.");
});
```
Line breaks can be preserved to maintain a similar structure to the training corpus (e.g. in the case of poetry), or they can be removed. 

If you wish to train on a set of files, ```trainOnFile``` can also take in an array of filenames, as such:
```javascript
dataset.trainOnFile(['beemoviescript.txt', 'constitution.txt'], 3, true, function() {
	console.log("Training complete.");
});
```

#### Clearing data
If you wish to remove all training data from a given data set, call:
```javascript
dataset.clearData();
```

## Generating Text
```javascript
var startWithCapitalNGram = true;

// generate 100 words of text, beginning with an ngram that was capitalized in the training corpus
var text = dataset.generate(100, startWithCapitalNGram);
```
The capitalized option allows you to prevent starting the generated text in the middle of a sentence, if the training data is in such a format.

## Ensuring originality
To check whether or not a segment of generated text has accidentally copied the training corpus word-for-word, the ```checkOriginality``` function can be called:
```javascript
dataset.checkOriginality("Is this string in the training corpus?");
```

## Manually interacting with dataset
If you're looking for more direct interaction with a training set, you can use ```getPossibilities``` to get all the possible words that follow a given gram
```javascript
dataset.getPossibilities(['words', 'that', 'follow', 'this']);
```

Or if you want to manually add an entry to the dataset, you can use ```updateGram```
```javascript
dataset.updateGram(['manually', 'added'], 'ngram');
```
which will add a new ngram or update a previous one. 