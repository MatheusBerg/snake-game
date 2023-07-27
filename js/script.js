window.onload = function(){

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const score = document.querySelector(".score-value1")
    const finalScore = document.querySelector(".score-value2")
    const menu = document.querySelector(".menu-screen")
    const buttonPlay = document.querySelector(".btn-play")

    const audio = new Audio("../assets/audio.mp3")

    const size = 25

    const randomNumber = (min, max) => {
        return Math.round(Math.random() * (max - min) + min)
    }

    const randomPosition = () => {
        const number = randomNumber(0, canvas.width - size)
        return Math.round(number / 25) * 25
    }

    const randomColor = () => {
        const red = randomNumber(0, 255)
        const green = randomNumber(0, 255)
        const blue = randomNumber(0, 255)
        return `rgb(${red}, ${green}, ${blue})`
    }

    const food = {
        x: randomPosition(0, canvas.width - size),
        y: randomPosition(0, canvas.width - size),
        color: "orange"
        //color: randomColor()
    }

    let snake = [
        {x: 250, y: 250},
        {x: 275, y: 250}                
    ]

    let direction
    let loopId

    const incrementScore = () => {
        score.innerText = parseInt(score.innerText) + 1
    }
    
    const drawSnake = () => {
        ctx.fillStyle = "red"
        
        snake.forEach((position, index) => {
            
            if (index == snake.length - 1) {
                ctx.fillStyle = "blue"
            }
            
            ctx.fillRect(position.x, position.y, size, size)
        })
    }

    const drawFood = () => {
        const { x, y, color } = food

        ctx.shadowColor = color
        ctx.shadowBlur = 15
        ctx.fillStyle = color
        ctx.fillRect(x, y, size, size)
        ctx.shadowBlur = 0
    }
    
    const moveSnake = () => {
        if (!direction) return

        const head = snake[snake.length - 1]

        
        if (direction == "right") {
            snake.push({ x: head.x + size, y: head.y})
        }
        if (direction == "left") {
            snake.push({ x: head.x - size, y: head.y})
        }
        if (direction == "up") {
            snake.push({ x: head.x, y: head.y - size})
        }
        if (direction == "down") {
            snake.push({ x: head.x, y: head.y + size})
        }
        
        snake.shift()
    }
    
    const drawGrid = () => {
        ctx.lineWidth = 0.25
        ctx.strokeStyle = "white"

        for (let i = 25; i < canvas.width; i += 25) {
            ctx.beginPath()
            ctx.lineTo(i, 0)
            ctx.lineTo(i, 600)    
            ctx.stroke()

            ctx.beginPath()
            ctx.lineTo(0, i)
            ctx.lineTo(600, i)    
            ctx.stroke()
        }

    }

    const snakeHasEaten = () => {
        const head = snake[snake.length - 1]

        if (head.x == food.x && head.y == food.y) {
            snake.push(head)
            audio.play()
            incrementScore()

            let x = randomPosition()
            let y = randomPosition()

            while (snake.find((position) => position.x == x && position.y == y)) {
                x = randomPosition()
                y = randomPosition()
            }

            food.x = x
            food.y = y
            food.color = randomColor()
        }
    }

    const gameOver = () => {
        const head = snake[snake.length -1]
        const neckIndex = snake.length -2
        const canvasLimit = canvas.width - size

        const collisionWalls = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit
        
        const collisionBody = snake.find((position, index) => {
            return index < neckIndex && position.x == head.x && position.y == head.y
        })

        if (collisionWalls || collisionBody) {
            newGame()
        }

    }

    const newGame = () => {
        direction = undefined

        menu.style.display = "flex"
        finalScore.innerText = score.innerText
        canvas.style.filter = "blur(5px)"
    }

    const gameLoop = () => {
        clearInterval(loopId)

        ctx.clearRect(0, 0, 600, 600)
        drawGrid()
        drawFood()
        moveSnake()
        drawSnake()
        snakeHasEaten()
        gameOver()

        loopId = setTimeout(() => {
            gameLoop()
        }, 150)
    }
    
    gameLoop()

    document.addEventListener("keydown", ({key}) => {
        if (key == "ArrowRight" && direction != "left" ) {
            direction = "right"
        }
        if (key == "ArrowLeft" && direction != "right" ) {
            direction = "left"
        }
        if (key == "ArrowUp" && direction != "down" ) {
            direction = "up"
        }
        if (key == "ArrowDown" && direction != "up" ) {
            direction = "down"
        }
    })

    buttonPlay.addEventListener("click", () => {
        score.innerText = "0"
        menu.style.display = "none"
        canvas.style.filter = "none"

        snake = [{x: 250, y: 250}, {x: 275, y: 250}]
    })
}