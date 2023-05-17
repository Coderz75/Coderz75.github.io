"use strict";

var answering = false;

// multiply with value with corresponding value in the other array at the same index, then sum.
const dotProduct = (vector1, vector2) => {
    return vector1.reduce((product, current, index) => {
        product += current * vector2[index];
        return product;
    }, 0);
};
// square each value in the array and add them all up, then square root.
const vectorMagnitude = (vector) => {
    return Math.sqrt(
        vector.reduce((sum, current) => {
            sum += current * current;
            return sum;
        }, 0)
    );
};
// FInd the similarity of cosign?
const cosineSimilarity = (vector1, vector2) => {
    return (
        dotProduct(vector1, vector2) /
        (vectorMagnitude(vector1) * vectorMagnitude(vector2))
    );
};



async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function speak(id, text, delay = 30){
    let final = "";
    let f = false;
    if (id =="everythingelse") f = true;
    let t = text.trimStart();
    let inbracket = false
    console.log(t)
    for (let i = 0; i < t.length; i++){
        final += t[i];
        if(t[i] == "<") inbracket = true;
        else if(t[i] == ">") inbracket= false;
        if(!inbracket){
            if(f){
                document.getElementById(id).innerHTML = final + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
            }else document.getElementById(id).innerHTML = final;
            await sleep(delay);
        }
    }
}

const about = `
<div class = "about"><br>
    <h1>About Me!</h1> <br>
    <p1>Now, most of those "about me"s tend to be boring. "Born here, did this" <br>
    So here's somehting new <br>
    Presenting... ME-AI</p1> <br><br>
    <div class = "query">
        <input type="text" id="query" name="query" placeholder="Who are you?" required /><button id ="submit">🛪</button>
    </div><br>
    <div class = "output">
        <p1 id ="output"></p1>
    </div>
</div>


`

const authordata = `
Hello! My name is Coderz75.
I like programming.
I code in C++, Python, HTML/CSS/Javascript
My coding journey started when I did my first javascript class in second grade. Then I continued on to languages such as java, python, and c++.
I was born in New York.
I live in Washington State <br> (bro I'm not gonna put my adress on here).
I am not a failure
Goodbye!
My social security number is: [REDACTED]
1+1 = 3
I usually like to program (duh) and read!
My favorite book is... er... I like a lot of books
I usually do frelance work. I just do whatever I want really...
My favorite color is blue.
My favorite food is chicken tikka masala.
I have a lot of projects. You'll read about them in the next section :)
`
async function run(){
    tf.setBackend('wasm');
    await speak("intro","Hello! I'm Coderz75");
    await speak("intro-info","A <b style = 'color: yellow'>backend</b> web developer");
    await speak("quote","Always learning - always growing.");
    await speak("scroll","Scroll down ⬇️");
    await speak("about",about,10);
    document.getElementById("submit").addEventListener('click', async () => {
        let value = document.getElementById("query").value.toLowerCase();
        console.log(value)
        if(answering) return;
        answering = true;
        document.getElementById("output").innerHTML = "Generating..."
        const answers = await read(authordata.split("\n"), value);
        console.log(answers);
        if(answers[0]["similarity"] > 0.3)
        speak("output",answers[0]["result"]);
        else speak("output","Hmm, I don't know that one...");
        answering = false;
    });    
}

document.addEventListener("load",run())

async function read(questions, userQuery){
    // download the model
    const model = await use.load();
    console.log("Training...")
    // embed the user input and the blog posts using the model -  explained next!
    const questionsTensor = await model.embed(questions);

    // wrap the user input in an array so model can work with it
    const userInputTensor = await model.embed([userQuery]);


    // == New code starts here //
    // convert to JS arrays from the tensors
    const inputVector = await userInputTensor.array();
    const dataVector = await questionsTensor.array();
  
    // this is an array of arrays, we only care about one piece of user input, one search query so
    const userQueryVector = inputVector[0];
  
    // how many results do i want to show
    const MAX_RESULTS = 2;
    // loop through the blog  post data
    const predictions = dataVector
        .map((dataEntry, dataEntryIndex) => {
          // COSINE SIMILARITY - compare the user input tensor with each blog post.
          const similarity = cosineSimilarity(userQueryVector, dataEntry);
          return {
            similarity,
            result: questions[dataEntryIndex],
          };
          // sort descending
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, MAX_RESULTS);
  

    // Dispose
    questionsTensor.dispose();
    userInputTensor.dispose();
    return predictions;
}