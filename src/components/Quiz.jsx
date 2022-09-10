import React from "react";
import { nanoid } from "nanoid";

export default function Quiz() {

    const [questions, setQuestions] = React.useState([]);
    const [form, setForm] = React.useState([]);
    const [running, setRunning] = React.useState(true);

    React.useEffect(() => {
        if(!running) return;
        async function getQuestions() {
            const result = await fetch("https://opentdb.com/api.php?amount=5&category=9&type=multiple");
            const data = await result.json();

            if (data.response_code != 0) {
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
                for (let i = 0; i < 4; ++i) {
                    if (answer[i] === correctAnswer) {
                        answerID = i;
                        break;
                    }
                }

                formData.push({
                    question: q.question,
                    answer: -1,
                    correctAnswer: answerID
                });
            });

            setQuestions(() => data.results.map(q => ({
                question: q.question,
                answers: q.incorrect_answers
            })));
            setForm(formData);
        }

        getQuestions();
    }, [running])

    function shuffleAnswers(answers) {
        for (let i = answers.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = answers[i];
            answers[i] = answers[j];
            answers[j] = temp;
        }
    }

    const handleChange = (event) => {
        if(!running) return;
        const { value, name } = event.target;

        setForm(prevForm => {
            let newForm = [];
            prevForm.forEach(item => {
                item.question === name ? 
                newForm.push({
                    ...item,
                    answer: parseInt(value)
                }):
                newForm.push({
                    ...item,
                }); 
            });
            return newForm;
        })
    }
    
    function countAnswers(){
        let correctAnswers = 0;
        form.forEach(q => {
            if (q.answer === q.correctAnswer)
                ++correctAnswers;
        })
        return correctAnswers;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setRunning(false);
    }

    const reset = () => {
        setRunning(true);
    }

    const mapQuestions = questions.map((q, index) => {
        const htmlText = {
            __html: q.question
        }

        return (
            <div key={nanoid()} className = "answers-button"> 
                <h2 className="question" dangerouslySetInnerHTML={htmlText} />
                <input
                    type = "radio"
                    id = {q.answers[0]}
                    name = {q.question}
                    onChange={handleChange}
                    value = {0}
                    checked = {form[index].answer == 0}
                />
                <label htmlFor={q.answers[0]} dangerouslySetInnerHTML={{__html: q.answers[0]}}></label>
               
                <input
                    type="radio"
                    id={q.answers[1]}
                    name={q.question}
                    onChange={handleChange}
                    value = {1}
                    checked = {form[index].answer == 1}
                />
                <label htmlFor={q.answers[1]} dangerouslySetInnerHTML={{__html: q.answers[1]}} ></label>

                <input
                    type="radio"
                    id={q.answers[2]}
                    name={q.question}
                    value = {2}
                    onChange={handleChange}
                    checked = {form[index].answer == 2}
                />
                <label htmlFor={q.answers[2]} dangerouslySetInnerHTML={{__html: q.answers[2]}}></label>

                <input
                    type="radio"
                    id={q.answers[3]}
                    value = {3}
                    name={q.question}
                    onChange={handleChange}
                    checked = {form[index].answer == 3}
                />
                <label htmlFor={q.answers[3]} dangerouslySetInnerHTML={{__html: q.answers[3]}}></label>
            </div>
        );
    });

    return (
        <form action="" onSubmit={handleSubmit} className="form">
            {mapQuestions}
            {!running ? 
                <div className = "reset">
                    <p>You scored {countAnswers()} / {questions.length} correct answers!</p>
                    <button className="reset-button" onClick = {reset}>Reset</button>
                </div> :
                <button className = "submit-button">Submit</button>
            }
        </form>
    );
}