import React from "react";
import { nanoid } from "nanoid";

export default function Quiz() {

    const [questions, setQuestions] = React.useState([]);
    //TODO: Better id matching (current question -> name)
    //      Answers styling
    const [form, setForm] = React.useState([]);

    React.useEffect(() => {
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
            })

            setQuestions(() => data.results.map(q => ({
                question: q.question,
                answers: q.incorrect_answers
            })));
            setForm(formData);
        }

        getQuestions();
    }, [])

    function shuffleAnswers(answers) {
        for (let i = answers.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = answers[i];
            answers[i] = answers[j];
            answers[j] = temp;
        }
    }

    const handleChange = (event) => {
        const { id, name } = event.target;

        setForm(prevForm => {
            let newForm = [];
            prevForm.forEach(item => {
                item.question === name ? 
                newForm.push({
                    ...item,
                    answer: parseInt(id)
                }):
                newForm.push({
                    ...item,
                }) 
            })
            return newForm;
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        let correctAnswers = 0;
        form.forEach(q => {
            if (q.answer = q.correctAnswer)
                ++correctAnswers;
        })

        console.log(correctAnswers);
    }

    const mapQuestions = questions.map((q, index) => {
        const htmlText = {
            __html: q.question
        }

        return (
            <div key={nanoid()}>
                <h2 className="question" dangerouslySetInnerHTML={htmlText} />
                <input
                    type="radio"
                    id = {0}
                    name = {q.question}
                    onChange={handleChange}
                    checked = {form[index].answer == 0}
                />
                <label htmlFor={q.question} dangerouslySetInnerHTML={{__html: q.answers[0]}}></label>

                <input
                    type="radio"
                    id={1}
                    name={q.question}
                    onChange={handleChange}
                    checked = {form[index].answer == 1}
                />
                <label htmlFor={q.question} dangerouslySetInnerHTML={{__html: q.answers[1]}}></label>

                <input
                    type="radio"
                    id={2}
                    name={q.question}
                    onChange={handleChange}
                    checked = {form[index].answer == 2}
                />
                <label htmlFor={q.question} dangerouslySetInnerHTML={{__html: q.answers[2]}}></label>

                <input
                    type="radio"
                    id={3}
                    name={q.question}
                    onChange={handleChange}
                    checked = {form[index].answer == 3}
                />
                <label htmlFor={q.question} dangerouslySetInnerHTML={{__html: q.answers[3]}}></label>
            </div>
        )
    });

    return (
        <form action="" onSubmit={handleSubmit} className="form">
            {mapQuestions}
            <button>Submit</button>
        </form>
    );
}