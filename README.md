# string-markov-js
A nodejs package for probabilistically generating text using markov chains.

www.npmjs.com/package/string-markov-js

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

dataset.trainOnString(string, ngram);
```

#### From a file
```javascript
var filename = 'training.txt';
var ngram = 3;

dataset.trainOnFile(filename, ngram, function() {
	console.log("Training complete.");
});
```

If you wish to train on a set of files, ```trainOnFile``` can also take in an array of filenames, as such:
```javascript
dataset.trainOnFile(['beemoviescript.txt', 'constitution.txt'], 3, function() {
	console.log("Training complete.");
});
```

#### Clearing data
If you wish to clear a given data set, call:
```javascript
dataset.clearData();
```

## Generating Text
```javascript
// generate 100 words of text
var text = dataset.generate(100);
```
