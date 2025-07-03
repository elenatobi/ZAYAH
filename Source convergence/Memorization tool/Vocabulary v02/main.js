var keys = Object.keys(vocabulary);
var corrects = [];
var errors = [];

function getWord(keys, vocabulary) {
    var index = Math.floor(keys.length * Math.random())
    var key = keys[index];
    var value = vocabulary[key];
    return [key, value, keys.splice(index, 1)];
}

var items = getWord(keys, vocabulary);
var completed = false;

const textInput = document.getElementById('textInput');
const question = document.getElementById("question");
const result = document.getElementById("result");

question.innerHTML = items[1];
textInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    if (! completed) {
        var input = textInput.value;
        if (input == items[0]) {
            result.innerHTML = "CORRECT! [" + items[0] + "] " + items[1];
            corrects.push(items[0]);
        } else {
            result.innerHTML = "ERROR";
            var errorItem = {"expect": items[0], "input": input, "definition": items[1]};
            errors.push(errorItem);
        }
        items = getWord(keys, vocabulary);
        if (items[0] != undefined) {
            question.innerHTML = items[1];
        } else {
            question.innerHTML = "TEST IS COMPLETED";
            completed = true;
            console.log(corrects);
            console.log(errors);
        }
        textInput.value = "";
    }
  }
});