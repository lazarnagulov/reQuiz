import React from "react";

export default function Quiz(){
    
    const [questions, setQuestions] = React.useState([]);

    React.useEffect(() => {
        async function getQuestions(){
            const result = await fetch("https://opentdb.com/api.php?amount=50&category=9&type=multiple");
            const data = await result.json();
            setQuestions(data);
        }
        getQuestions();
    },[])

    
    return (
        <h1>Started</h1>
    );
}