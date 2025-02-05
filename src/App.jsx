import React from "react"
import { languages } from './languages'
import './App.css'
import clsx from 'clsx'
import { getFarewellText } from "./utils"
import { getRandomWord } from "./utils"
import ReactConfetti from "react-confetti"
export default function AssemblyEndgame() {

  //state values
  const [currentWord, setCurrentWord] = React.useState(()=>getRandomWord()) //lazy state initialization so that the state doesn't change on each render
  const [guessedLetters, setGuessedLetters] = React.useState([])
  const [lostLanguageMessage, setLostLanguageMessage] = React.useState("")
  //derived values
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameOver = isGameLost || isGameWon
  //static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split('')


  React.useEffect(() => {
    if (wrongGuessCount > 0) {
      setLostLanguageMessage(getFarewellText(languages[wrongGuessCount - 1].name))
    }
  }, [wrongGuessCount])


  function handleClick(letter) {
    setGuessedLetters(prevLetters =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    )
  }

  function newGame(){
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
    setLostLanguageMessage("")
  }

  const languagesElArray = languages.map((lang, index) => {
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    return (
      <span
        className={clsx("chip", {
          "lost": index < wrongGuessCount
        })}
        style={styles}
        key={lang.name}
      >
        {lang.name}
      </span>
    )
  })

  const letters = currentWord.split('')
    .map((letter, index) => {

      const isGuessed = guessedLetters.includes(letter)
      return (
        <span className="letter" key={index}>{isGuessed && letter.toUpperCase()}</span>
      )
    })

  const keyboard = alphabet.map((letter, index) => {

    const isCorrect = currentWord.includes(letter) && guessedLetters.includes(letter)
    const isIncorrect = !currentWord.includes(letter) && guessedLetters.includes(letter)

    return <button key={index}
      disabled={isGameOver}
      aria-disabled={guessedLetters.includes(letter)}
      aria-label={`Letter ${letter}`}
      className={
        clsx({
          "correct": isCorrect,
          "incorrect": isIncorrect
        })
      }
      onClick={() => handleClick(letter)}
    >
      {letter.toUpperCase()}
    </button>
  })


  const revealWord = currentWord.split("").map((letter, index) => {
    return(
      <span key={index} className={`letter ${!guessedLetters.includes(letter) ? "reveal" : ""}`}>
        {letter.toUpperCase()}
      </span>
    )
  })

  function renderGameStatus() {
    if (wrongGuessCount < 1) {
      return null
    }
    if (lostLanguageMessage) {
      return (
        <>
          <p>{lostLanguageMessage}</p>
        </>
      )
    }
    else if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    }
    else {
      return (
        <>
          <h2>Game Over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      )
    }
  }
  
  
  return (
    <main>
      {
        isGameWon && <ReactConfetti />
      }

      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within 8 attempts to keep the
          programming world safe from Assembly!</p>
      </header>


      <section
        aria-live="polite"
        role="status"
        className={clsx("game-status", {
          "lost": isGameLost,
          "won": isGameWon,
          "message": lostLanguageMessage
        })}>

        {renderGameStatus()}

      </section>


      <section className="languages">

        {languagesElArray}

      </section>



      <section className="word-section">

        {isGameOver ? revealWord : letters}

      </section>



      <section className="keyboard">

        {keyboard}

      </section>

      {isGameOver && <button className="new-game" onClick={newGame}>New Game</button>}

    </main>
  )
}
