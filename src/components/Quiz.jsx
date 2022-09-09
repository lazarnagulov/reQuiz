import React from "react";
import {nanoid} from "nanoid";

export default function Quiz(){
    
    const [questions, setQuestions] = React.useState([]);
    const [form, setForm] = React.useState([]);

    React.useEffect(() => {
        async function getQuestions(){
            const result = await fetch("https://opentdb.com/api.php?amount=5&category=9&type=multiple");
            const data = await result.json();
            
            if(data.response_code != 0){
                console.log("API call error!");
                return;
            }

            let formData = [];
            data.results.forEach(q => {
                const correctAnswer = q.correct_answer;
                let answer = [...q.incorrect_answers, correctAnswer];
                shuffleAnswers(answer);
                q.incorrect_answers = answer;

                let answerID = 0;
                for(let i = 0; i < 4; ++i){
                    if(answer[i] === correctAnswer){
                        answerID = i;
                        break;
                    }
                }
                
                formData.push({
                    answer: -1,
                    correctAnswer: answerID
                });
                })

                setQuestions(() => data.results.map(q => ({
                    question: q.question,
                    answers: q.incorrect_answers
                })));
                setForm(formData);
            }

        getQuestions();
    },[])

    console.log(questions);
    console.log(form);

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

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const mapQuestions = questions.map((q,index) =>{
        const htmlText = {
            __html: q.question
        }

        return (
            <div key = {nanoid()}>
                <h2 className = "question" dangerouslySetInnerHTML={htmlText}/>
                <input 
                    type="radio"
                    id = {0} 
                    name = {q.question}
                    onChange = {handleChange}
                />
                {/* <label htmlFor={q.question} dangerouslySetInnerHTML={{__html: answers[0]}}></label> */}
                
                <input 
                    type="radio"
                    id = {1}
                    name = {q.question}
                    onChange = {handleChange}
                />
                {/* <label htmlFor={q.question} dangerouslySetInnerHTML={{__html: answers[1]}}></label> */}
                
                <input 
                    type="radio" 
                    id = {2}
                    name = {q.question}
                    onChange = {handleChange}
                />
                {/* <label htmlFor={q.question} dangerouslySetInnerHTML={{__html: answers[2]}}></label> */}
                
                <input 
                    type="radio" 
                    id = {3}
                    name = {q.question}
                    onChange = {handleChange}
                />
                {/* <label htmlFor={q.question} dangerouslySetInnerHTML={{__html: answers[3]}}></label> */}
            </div>
        )
    });


    return (
        <form action="" onSubmit={handleSubmit} className = "form">{mapQuestions}</form>
    );
}