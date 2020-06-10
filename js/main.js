document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  const gameSpeed = 1000
  let score = 0
  const colors = [
    'blueviolet',
    'pink',
    'fuchsia',
    'mediumorchid',
    'slateblue'
  ]

  // The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = Math.floor(Math.random() * 4)
  let currentRotationForMiniGrid = currentRotation

  // randomly select a Tetromino and it first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length)

  let current = theTetrominoes[random][currentRotation]

  // Draw the Tetromino
  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  // Undraw the Tetromino
  function undraw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  // Assignfunction to keyCodes
  function control (e) {
    if (e.keyCode === 37 || e.keyCode === 65) {
      moveLeft()
    } else if (e.keyCode === 32) {
      rotate()
    } else if (e.keyCode === 39 || e.keyCode === 68) {
      moveRight()
    } else if (e.keyCode === 40 || e.keyCode === 83) {
      moveDown()
    }
  }

  // Move down function
  function moveDown () {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  // Freeze function
  function freeze () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      // undraw()
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      // Start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      currentRotation = Math.floor(Math.random() * 4)
      currentRotationForMiniGrid = currentRotation
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
      undraw()
      draw()
    }
  }

  // Move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft () {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!isAtLeftEdge) currentPosition -= 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition += 1

    draw()
  }

  // Move the tetromino right, unless is at the edge or there is a blockage
  function moveRight () {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if (!isAtRightEdge) currentPosition += 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition -= 1

    draw()
  }

  // Rotate the tetromino
  function rotate () {
    undraw()

    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    const oneStepToRightEdge = current.some(index => (currentPosition + index) % width === width - 2)

    if (current[3] === width * 3 + 1 && oneStepToRightEdge) currentPosition -= 1
    else if (isAtRightEdge && current[1] !== 1) {
      if (current[3] === width * 3 + 1) currentPosition -= 2
      else currentPosition -= 1
    } else if (isAtLeftEdge && current[1] !== 1) {
      if (current[3] === width * 3 + 1) currentPosition += 1
      else currentPosition += 1
    }
    currentRotation++

    // if current rotation get to 4 make it go back to 0
    if (currentRotation === current.length) currentRotation = 0

    current = theTetrominoes[random][currentRotation]
    draw()
  }

  // show up-next tetromino in mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  // the Tetromino
  const upNextTetrominoes = [
    // lTetromino
    [
      [1, displayWidth + 1, displayWidth * 2 + 1, 2],
      [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth * 2 + 2],
      [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2],
      [displayWidth, displayWidth * 2, displayWidth * 2 + 1, displayWidth * 2 + 2]
    ],
    // zlTetromino
    [
      [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
      [displayWidth + 1, displayWidth + 2, displayWidth * 2, displayWidth * 2 + 1],
      [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
      [displayWidth + 1, displayWidth + 2, displayWidth * 2, displayWidth * 2 + 1]
    ],
    // tlTetromino
    [
      [1, displayWidth, displayWidth + 1, displayWidth + 2],
      [1, displayWidth + 1, displayWidth + 2, displayWidth * 2 + 1],
      [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth * 2 + 1],
      [1, displayWidth, displayWidth + 1, displayWidth * 2 + 1]
    ],
    // olTetromino
    [
      [0, 1, displayWidth, displayWidth + 1],
      [0, 1, displayWidth, displayWidth + 1],
      [0, 1, displayWidth, displayWidth + 1],
      [0, 1, displayWidth, displayWidth + 1]
    ],
    // ilTetromino
    [
      [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
      [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth + 3],
      [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
      [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth + 3]
    ]
  ]

  // diasplay the shape in the mini-grid display
  function displayShape () {
    // remove any trace of a tetromino from the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino-mini')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom][currentRotationForMiniGrid].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino-mini')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  // add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
      document.removeEventListener('keyup', control)
    } else {
      draw()
      timerId = setInterval(moveDown, gameSpeed)
      document.addEventListener('keyup', control)
    }
  })

  // add score
  function addScore () {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 1
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.append(cell))
      }
    }
  }

  // game over
  function gameOver () {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'End'
      clearInterval(timerId)
      document.removeEventListener('keyup', control)
    }
  }
})
