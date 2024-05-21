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
async function speak(id, text, delay = 20){
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
const projects = 
{
    "Quran RSS":{
        "desc": "A complete RSS feed of the Holy Quran",
        "url": "https://coderz75.github.io/Full_Quran_rss/",
        "img": "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cXVyYW58ZW58MHx8MHx8fDA%3D"
    },
    "ScienceBuzzerBot":{
        "desc": "Simulate a science bowl round on discord! Featuring a point system, a large library of questions, and is completely centered around the ruled of national science bowl",
        "url": "https://github.com/Coderz75/SciencebBuzzerBot",
        "img": "https://cdn.discordapp.com/avatars/1047653068231147594/27fc2f40b80ceea663fd27b84add282a.webp?size=128"
    },
    "Immune-Quest":{
        "desc": "A project I made for my school hackathon (which I won best design in), you are a white blood cell in your hosts body tasked with defending it from infections",
        "url": "https://coderz75.github.io/IPC-Winter-Hackathon/",
        "img": "https://raw.githubusercontent.com/Coderz75/IPC-Winter-Hackathon/main/assets/Background.png"
    },
    "ScienceBowlBotAI":{
        "desc": "Essentially a little project to test out tensorflow AI. Uses AI to filter through the large catalog of national science bowl question and answer hundreds of possible science questions",
        "url": "https://coderz75.github.io/sciencebowlbotai/",
        "img": "https://cdn.discordapp.com/avatars/1047653068231147594/27fc2f40b80ceea663fd27b84add282a.webp?size=128"
    },
    "A-Lang":{
        "desc": "A coding language, purposely made to be very stupid and incomplete. This was made with the stereotype that asians are smart (however an improper stereotype) and essentially trys to put majority of the code on the coder.",
        "url": "https://coderz75.github.io/A-Lang/",
        "img": "https://coderz75.github.io/A-Lang/img/logo.jpg"   
    },
    "Runlang":{
        "desc":"Runlang is a feature rich coding language based on c++. It is cross compatible, plus has many extra features previously visible in the now archived slackerz c++ package",
        "url": "https://github.com/Coderz75/Runlang",
        "img": "https://raw.githubusercontent.com/Coderz75/Runlang/main/logo.jpg"
    },
    "Slackerz: A C++ package to make your life easier":{
        "desc": "Slackerz is a (now archived) package meant for c++. It incorporated many features, such a a custom string class, to smooth out some of the harder parts of c++",
        "url": "https://github.com/Coderz75/Slackerz-CPP-Package",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/800px-ISO_C%2B%2B_Logo.svg.png"
    },
    "Science-Moon-Model":{
        "desc": "A fun little project to test out the three.js library. Also meant to be a science project for my school",
        "url": "https://coderz75.github.io/Science-Moon-Model/",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/330px-FullMoon2010.jpg"
    }
}

const authordata = `
Hello! My name is Coderz75.
I like programming.
I code in C++, Python, HTML/CSS/Javascript
My coding journey started when I did my first javascript class in second grade. Then I continued on to languages such as java, python, and c++.
I was born in New York.
I live in Washington State <br> (bro I'm not gonna put my adress on here).
I am not a failure
I am not stupid
Goodbye!
My social security number is: [REDACTED]
I don't do math
I usually like to program (duh) and read!
My favorite book is... er... I like a lot of books
I usually do frelance work. I just do whatever I want really...
My favorite color is blue.
My favorite food is chicken tikka masala.
I have a lot of projects. You'll read about them in the next section :)
Cool Right?
`
async function run(){
    tf.setBackend('wasm');
    document.getElementById("about").innerHTML = about;
    
    let projects_page = `<br><h1 class = "projecttitle">Projects</h1>`;
    let alt = false;
    for (const key in projects) {
        let pos;
        if (alt){
            pos = "right"
        }else{
            pos = "left"
        }
        let e;
        if (!alt){
            e = "right"
        }else{
            e = "left"
        }
        let mything = `
        <div class = "projcont grad${e}" id = "${key.replace(" ","_")}">
            <img src = "${projects[key]["img"]}" class = "projectImg ${pos}">
            <div class = "textcont ${e}">
                <h1><a href = "${projects[key]["url"]}">${key}🔗</a></h1><br>
                <h5>${projects[key]["desc"]}</h5><br>
            </div>
        </div>
        <br>
        <br>
        <br>
        <br>
        `;
        alt = !alt
        projects_page+= mything
    }
    console.log(projects_page)
    document.getElementById("projects").innerHTML=projects_page
    await speak("intro","Hello! I'm Coderz75");
    await speak("intro-info","A <b style = 'color: yellow'>backend</b> web developer");
    await speak("quote","\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\"");
    await speak("scroll","Scroll down ⬇️");
    document.getElementById("submit").addEventListener('click', async () => {
        let value = document.getElementById("query").value.toLowerCase();
        console.log(value)
        if(answering) return;
        answering = true;
        document.getElementById("output").innerHTML = "Generating..."
        const answers = await read(authordata.split("\n"), value);
        console.log(answers);
        if(answers[0]["similarity"] > 0.3 && answers[0]["result"] != "") speak("output",answers[0]["result"]);
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
    const MAX_RESULTS = 4;
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