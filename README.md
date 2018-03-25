# string-markov-js
A nodejs package for probabilistically generating text using markov chains.

#### Including the module:
```javascript
var markov = require('string-markov-js');
```

## Training

#### From a string
```javascript
var string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";
var ngram = 2;

markov.trainOnString(string, ngram);
```

#### From a file
```javascript
var filename = 'training.txt';
var ngram = 3;

markov.trainOnFile(filename, ngram, function() {
	console.log("Training complete.");
});
```

#### Clearing data
If you wish to clear the data retrieved from the training process, call:
```javascript
markov.clearTraining();
```

## Generating Text
```javascript
// generate 100 words of text
var text = markov.generate(100);
```
