//Initial setup
let questionsContainer  = document.querySelector("main"),
    progressBar         = document.querySelector(".progress-bar"),
    imageFormat         = "webp",
    points = iterator   = 0;

//Image list and loading
const images = {};
philosophers.forEach(philosopher => images[philosopher.name] = `assets/${imageFormat}/${philosopher.head}.${imageFormat}`);

//Image preloading
for(let name in images){
    let image = new Image();
    image.src = images[name];
}

/**
 * Method to get a philosopher based on points
 * @param {int} points 
 * @returns {object} Philosopher within point range
 */
function getPhilosopher(points){
    //Search for a philosopher within the range
    return philosophers.find(philosopher =>
        points >= philosopher.min && points <= philosopher.max
    );
}

/**
 * Method to update the progress bar
 */
function updateProgressBar(){
    //Get the current progress and apply it to the container
    let progress = ((iterator) / questions.length) * 100;
    progressBar.style.width = progress + "%";
}

/**
 * Method to reset the form
 */
function reload(){
    //Sets points and iterator to 0, then reloads everything
    points = iterator = 0;
    generateQuestion();
    updateProgressBar();
}

/**
 * Method to generate a question
 * @param {int} opacity Initial opacity of the container
 * @param {int} milliseconds Animation duration
 */
function generateQuestion(opacity = 0, milliseconds = 400){
    //Sets the provided opacity
    questionsContainer.style.opacity = opacity;

    //Applies the animation after the specified milliseconds
    setTimeout(() => {
        //If the iterator goes out of the question range
        if(iterator >= questions.length){
            //Shows the container
            questionsContainer.style.opacity = 1;

            //Gets the philosopher and applies the corresponding text
            let philosopher = getPhilosopher(points);
            questionsContainer.innerHTML = `
                <img src="${images[philosopher.name]}" style="width:175px"/>
                <h1>Eres ${philosopher.name}</h1>
                <p>${philosopher.description}</p>
                <button style="width: auto;font-weight: bold;" onclick="reload()">↻ Repetir</button>
            `;
            
            //The progress bar reaches 100% and stops the method execution
            progressBar.style.width = "100%";
            return;
        }

        //Get the current question and set the title
        let currentQuestion = questions[iterator];
        questionsContainer.innerHTML = `<h2>${currentQuestion.question}</h2>`;

        //For each possible answer
        currentQuestion.answers.forEach(answer => {
            //Create a button and set its text
            let button = document.createElement("button");
            button.textContent = answer.value;

            //If the button is clicked
            button.onclick = () => {
                //Add points, increment iterator
                //Update progress bar and question
                points += answer.points;
                iterator++;
                updateProgressBar();
                generateQuestion();
            };
            
            //Add the button to the container
            questionsContainer.appendChild(button);
        });

        //Show the container
        questionsContainer.style.opacity = 1;
    }, milliseconds);
}

//First time load, without animation
generateQuestion(opacity = 1, milliseconds = 0);
updateProgressBar();

//On reload, an image may randomly appear in the corner
if(Math.random() <= 0.5) document.querySelector(".random-image").classList.add("animate");