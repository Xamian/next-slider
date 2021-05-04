import styles from './game.module.scss'
import { useEffect, useState, MouseEvent, useRef } from 'react'

class Vector2d {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  eq = (other: Vector2d): boolean => other && other.x == this.x && other.y == this.y;
}
class Piece {
  startPos: Vector2d;
  hidden: boolean;
  currentPos: Vector2d;
  index: number;
  constructor(startPos: Vector2d, index: number) {
    this.startPos = startPos
    this.currentPos = startPos
    this.index = index
  }
}
export default function Game() {
  ///state
  const [pieces, setPieces] = useState<Piece[]>([])
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('')

  ///init
  useEffect(() => {
    const W = 3
    const H = 3
    const pieces = []
    let i = 0
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        pieces.push(new Piece(new Vector2d(x, y), i++))
      }
    }
    setPieces(pieces)
  }, [])

  /// event handlers
  const boardClickHandler = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as any as HTMLDivElement
    if (target.parentElement.classList.contains(styles.pieces)) {
      const index = target.dataset['pieceIndex']
      // if (index !== undefined)
      pieceClicked(pieces[index]);
    }
  }
  const pieceClicked = (piece: Piece) => {
    if (playing) {
      const hiddenPiece = pieces[pieces.length - 1]
      if (canSwap(piece, hiddenPiece)) {
        swap(piece, hiddenPiece)
        setPieces([...pieces])
        setScore(score + 1)
        checkWin()
      }
    }
  }
  const [playing, setPlaying] = useState(false)
  const checkWin = () => {
    if (isWin()) {
      const hiddenPiece = pieces[pieces.length - 1]
      hiddenPiece.hidden = false
      setMessage(`Player wins in ${score + 1} moves!`)
      setPlaying(false)
    }
  }
  const isWin = () => {
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      const cPos = piece.currentPos
      const sPos = piece.startPos
      if (cPos.x != sPos.x || cPos.y != sPos.y) {
        return false
      }
    }
    return true
  }
  const shuffleButtonClickHandler = () => {
    startGame();
  }
  const startGame = async () => {
    /// set score to 0
    setScore(0)

    setMessage('')

    /// hide the bottom right piece
    const hiddenPiece = pieces[pieces.length - 1]
    hiddenPiece.hidden = true

    /// shuffle pieces
    //shufflePieces(25)
    await betterShuffle()

    /// make sure the ui is updated
    setPieces([...pieces])

    setPlaying(true)
  }

  /**
   * 
   * @param iterations default: 5
   * @param mustTouchAll default: true
   */
  const betterShuffle = async (iterations: number = 5, mustTouchAll: boolean = true) => {
    const hiddenPiece = pieces[pieces.length - 1]
    let prevHidden: Vector2d
    const W = 3
    const H = 3
    for (let n = 0; n < iterations; n++) {
      let touched = {}
      do {
        const neighborPositions = []
        const pos = hiddenPiece.currentPos
        if (pos.x > 0) {
          let t = new Vector2d(pos.x - 1, pos.y)
          if (!t.eq(prevHidden))
            neighborPositions.push(t)
        }
        if (pos.y > 0) {
          let t = new Vector2d(pos.x, pos.y - 1)
          if (!t.eq(prevHidden))
            neighborPositions.push(t)
        }
        if (pos.x < W - 1) {
          let t = new Vector2d(pos.x + 1, pos.y)
          if (!t.eq(prevHidden))
            neighborPositions.push(t)

        }
        if (pos.y < H - 1) {
          let t = new Vector2d(pos.x, pos.y + 1)
          if (!t.eq(prevHidden))
            neighborPositions.push(t)

        }
        const selectedMove = neighborPositions[Math.floor(Math.random() * neighborPositions.length)]
        const piece = getPieceAtPos(selectedMove)
        prevHidden = hiddenPiece.currentPos
        swap(piece, hiddenPiece)
        touched[piece.index] = 1

      } while (mustTouchAll && Object.keys(touched).length + 1 < pieces.length)
        /// make sure the ui is updated
        setPieces([...pieces])
        await delay(200);
    }
  }
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const getPieceAtPos = (pos: Vector2d) => {
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      const cPos = piece.currentPos
      if (cPos.x == pos.x && cPos.y == pos.y)
        return piece
    }
  }

  const canSwap = (piece: Piece, hiddenPiece: Piece): boolean => {
    const pos1 = piece.currentPos
    const pos2 = hiddenPiece.currentPos
    return (pos1.x == pos2.x && Math.abs(pos1.y - pos2.y) == 1) || pos1.y == pos2.y && Math.abs(pos1.x - pos2.x) == 1
  }
  const swap = (piece: Piece, piece2: Piece) => {
    const temp = piece.currentPos
    piece.currentPos = piece2.currentPos
    piece2.currentPos = temp
  }

  const targetImage = 'url(images/thispersondoesnotexist.com/image1.jpg)'
  const pSize = new Vector2d(200, 200)
  const piecesAsDivs = pieces.map((piece, i) => {
    const sPos = piece.startPos;
    const cPos = piece.currentPos;
    return (
      <div key={i}
        data-piece-index={i}
        className={piece.hidden ? styles.hidden : ''}
        style={{
          // display: piece.hidden ? 'none' : 'block',
          left: (cPos.x - sPos.x) * pSize.x,
          top: (cPos.y - sPos.y) * pSize.y,
          backgroundImage: targetImage,
          width: '600px',
          height: '600px',
          clip: `rect(${sPos.y * pSize.y}px,
        ${(sPos.x + 1) * pSize.x}px,
        ${(sPos.y + 1) * pSize.y}px,
        ${sPos.x * pSize.x}px)`
        }}></div>
    );
  })
  return (
    <div className={styles.game}>
      <div className={styles.score}>{score}</div>
      <div className={styles.board} onClick={boardClickHandler}>
        <div className={styles.target} style={{ backgroundImage: targetImage }}></div>
        <div className={styles.pieces}>
          {piecesAsDivs}
        </div>
        <div className={styles.message}>{message}</div>
      </div>
      <button
        className={styles.shuffleButton}
        onClick={shuffleButtonClickHandler}>Shuffle</button>
    </div>
  )
}