document.addEventListener('DOMContentLoaded', () => {
    // TODO: también podemos obtener el tamaño de la cuadrícula del usuario
    const GRID_WIDTH = 10
    const GRID_HEIGHT = 20
    const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT
  
    // No es necesario escribir 200 divs
    const grid = createGrid();
    let squares = Array.from(grid.querySelectorAll('div'))
    const startBtn = document.querySelector('.button')
    const hamburgerBtn = document.querySelector('.toggler')
    const menu = document.querySelector('.menu')
    const span = document.getElementsByClassName('close')[0]
    const scoreDisplay = document.querySelector('.score-display')
    const linesDisplay = document.querySelector('.lines-score')
    let currentIndex = 0
    let currentRotation = 0
    const width = 10
    let score = 0
    let lines = 0
    let timerId
    let nextRandom = 0
    const colors = [
      'url(images/blue_block.png)',
      'url(images/pink_block.png)',
      'url(images/purple_block.png)',
      'url(images/peach_block.png)',
      'url(images/yellow_block.png)'
    ]
  
  
    function createGrid() {
      // Principal grid
      let grid = document.querySelector(".grid")
      for (let i = 0; i < GRID_SIZE; i++) {
        let gridElement = document.createElement("div")
        grid.appendChild(gridElement)
      }
  
      // Base de grid
      for (let i = 0; i < GRID_WIDTH; i++) {
        let gridElement = document.createElement("div")
        gridElement.setAttribute("class", "block3")
        grid.appendChild(gridElement)
      }
  
      let previousGrid = document.querySelector(".previous-grid")
      // Dado que 16 es el tamaño máximo de cuadrícula en el que
      // pueden caber todos los Tetrominoes, creamos uno aquí
      for (let i = 0; i < 16; i++) {
        let gridElement = document.createElement("div")
        previousGrid.appendChild(gridElement);
      }
      return grid;
    }
  
  
    //Assignado valores para el teclado
    function control(e) {
      if (e.keyCode === 39)
        moveright()
      else if (e.keyCode === 38)
        rotate()
      else if (e.keyCode === 37)
        moveleft()
      else if (e.keyCode === 40)
        moveDown()
    }
  
    //El comportamiento clásico es acelerar el bloque si se mantiene 
    //presionado el botón de abajo para hacerlo
    document.addEventListener('keydown', control)
  
    //El Tetrominoes
    //Las diferentes figuras que lanza esto
    const lTetromino = [
      [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
      [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
      [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
      [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
    ]
  
    const zTetromino = [
      [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
      [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
      [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
      [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
    ]
  
    const tTetromino = [
      [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
      [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
      [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
      [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
    ]
  
    const oTetromino = [
      [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
      [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
      [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
      [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
    ]
  
    const iTetromino = [
      [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
      [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
      [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
      [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
    ]
  //Array de figuras
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
  
    //Seleccion Random de las figuras
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]
  
  
    //Movimiento hacia abajo de las fihuras
    let currentPosition = 4
    //Dibuja la figura
    function draw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.add('block')
        squares[currentPosition + index].style.backgroundImage = colors[random]
      })
    }
  
    //Borra la figura
    function undraw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.remove('block')
        squares[currentPosition + index].style.backgroundImage = 'none'
      })
    }
  
    //Mover hacia abajo en bucle
    function moveDown() {
      undraw()
      currentPosition = currentPosition += width
      draw()
      freeze()
    }
  //Boton iniciar
    startBtn.addEventListener('click', () => {
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        displayShape()
      }
    })
  
    //Moverse a la izquierda y evitar colisiones con formas que se mueven a la izquierda
    function moveright() {
      undraw()
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
      if (!isAtRightEdge) currentPosition += 1
      if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
        currentPosition -= 1
      }
      draw()
    }
  
    //Moverse a la derecha y evitar colisiones con formas que se mueven a la derecha
    function moveleft() {
      undraw()
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
      if (!isAtLeftEdge) currentPosition -= 1
      if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
        currentPosition += 1
      }
      draw()
    }
  
    //Congelar la forma
    function freeze() {
      // Si el bloque se ha asentado
      if (current.some(index => squares[currentPosition + index + width].classList.contains('block3') || squares[currentPosition + index + width].classList.contains('block2'))) {
        // Hacer eso el block2
        current.forEach(index => squares[index + currentPosition].classList.add('block2'))
        // Empezar una nueva linea fallida
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
      }
    }
    freeze()
  
    //Girar la figura
    function rotate() {
      undraw()
      currentRotation++
      if (currentRotation === current.length) {
        currentRotation = 0
      }
      current = theTetrominoes[random][currentRotation]
      draw()
    }
  
    //Fin del juego
    function gameOver() {
      if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
      }
    }
  
    //Mostrar la siguiente figura en el scoreDisplay
    const displayWidth = 4
    const displaySquares = document.querySelectorAll('.previous-grid div')
    let displayIndex = 0
  
    const smallTetrominoes = [
      [1, displayWidth + 1, displayWidth * 2 + 1, 2], /* lTetromino */
      [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], /* zTetromino */
      [1, displayWidth, displayWidth + 1, displayWidth + 2], /* tTetromino */
      [0, 1, displayWidth, displayWidth + 1], /* oTetromino */
      [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] /* iTetromino */
    ]
  //Display para mostrar las figuras
    function displayShape() {
      displaySquares.forEach(square => {
        square.classList.remove('block')
        square.style.backgroundImage = 'none'
      })
      smallTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('block')
        displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandom]
      })
    }
  
    //Guardar resultado score
    function addScore() {
      for (currentIndex = 0; currentIndex < GRID_SIZE; currentIndex += GRID_WIDTH) {
        const row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9]
        if (row.every(index => squares[index].classList.contains('block2'))) {
          score += 10
          lines += 1
          scoreDisplay.innerHTML = score
          linesDisplay.innerHTML = lines
          row.forEach(index => {
            squares[index].style.backgroundImage = 'none'
            squares[index].classList.remove('block2') || squares[index].classList.remove('block')
  
          })
          //array
          const squaresRemoved = squares.splice(currentIndex, width)
          squares = squaresRemoved.concat(squares)
          squares.forEach(cell => grid.appendChild(cell))
        }
      }
    }
  
    //Estilos de eventListeners
    hamburgerBtn.addEventListener('click', () => {
      menu.style.display = 'flex'
    })
    span.addEventListener('click', () => {
      menu.style.display = 'none'
    })
  
  })
  /*
    Temas vistos
• querySelector(): Devuelve el primer elemento del documento (utilizando un recorrido primero en profundidad pre ordenado de los nodos del documento) que coincida con el grupo especificado de selectores.
  • addEventListener(): Registra un evento a un objeto en específico.
  • Array.from(): Crea una nueva instancia de Array a partir de un objeto iterable.
  • getElementsByClassName(): Retorna un objecto similar a un array de los elementos hijos que tengan todos los nombres de clase indicados.
  • Math.floor(): Devuelve el máximo entero menor o igual a un número.
  • Math.random(): Retorna un punto flotante, un número pseudo-aleatorio dentro del rango [0, 1).
  • forEach(): Ejecuta la función indicada una vez por cada elemento del array.
  • setInterval(): Ejecuta una función o un fragmento de código de forma repetitiva cada vez que termina el periodo de tiempo determinado. Devuelve un ID de proceso.
  • clearInterval(): Cancela una acción reiterativa que se inició mediante una llamada a setInterval
  • some(): Comprueba si al menos un elemento del array cumple con la condición implementada por la función proporcionada.
  • style.backgroundImage: Agregar una imagen de fondo en el HTML.
  • splice(): cambia el contenido de un array eliminando elementos existentes y/o agregando nuevos elementos.
  • concat(): Se usa para unir dos o más arrays. Este método no cambia los arrays existentes, sino que devuelve un nuevo array.
  • appendChild(): Agrega un nuevo nodo al final de la lista de un elemento hijo de un elemento padre especificado.

  
  
  */