import React from "react";
import {nanoid} from "nanoid";

export default function Quiz(){
    
    const [questions, setQuestions] = React.useState([]);

    React.useEffect(() => {
        async function getQuestions(){
            const result = await fetch("https://opentdb.com/api.php?amount=50&category=9&type=multiple");
            const data = await result.json();
            
            if(data.response_code != 0){
                console.log("API call error!");
                return;
            }
            
            setQuestions(data.results);
        }
        getQuestions();
    },[])

    function shuffleAnswers(answers) {
        for (let i = answers.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = answers[i];
            answers[i] = answers[j];
            answers[j] = temp;
        }
    }

    const handleChange = (event) => {
        console.log(event.target.id);
    }

    const mapQuestions = questions.map(q =>{
        const htmlText = {
            __html: q.question
        }
        const correctAnswer = q.correct_answer
        const answers = [...q.incorrect_answers, correctAnswer]; 
        shuffleAnswers(answers);

        const answerId = 0;
        for (let i = 0; i < answers; ++i){
            if(correctAnswer = answers[i]){
                answerId = i;
                break;
            }
        }

        return (
            <div key = {nanoid()}>
                <h2 className = "question" dangerouslySetInnerHTML={htmlText}/>
                <form action="" className = "form">
                    <input 
                        type="radio"
                        id = "1" 
                        name = {q.question}
                        onChange = {handleChange}
                    />
                    <label htmlFor={q.question} dangerouslySetInnerHTML={{__html: answers[0]}}></label>
                    
                    <input 
                        type="radio"
                        id = "2"
                        name = {q.question}
                        onChange = {handleChange}
                    />
                    <label htmlFor={q.question} dangerouslySetInnerHTML={{__html: answers[1]}}></label>
                    
                    <input 
                        type="radio" 
                        id = "3"
                        name = {q.question}
                        onChange = {handleChange}
                    />
                    <label htmlFor={q.question} dangerouslySetInnerHTML={{__html: answers[2]}}></label>
                    
                    <input 
                        type="radio" 
                        id = "4"
                        name = {q.question}
                        onChange = {handleChange}
                    />
                    <label htmlFor={q.question} dangerouslySetInnerHTML={{__html: answers[3]}}></label>
                </form>
            </div>
        )
    });

    
    return (
        <div>
            {mapQuestions}
        </div>
    );
}