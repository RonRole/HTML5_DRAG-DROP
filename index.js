const DEFAULT_FONT_COLOR = 'black'

let fever = false;

document.getElementById('fever').onclick = (e) => {
    fever = !fever
    document.body.style.backgroundColor = fever ? 'black' : 'white'

}

function* generateId(){
    var id = 0
    while(true) {
        yield id++
    }
}

const gen = generateId()

const handleOnDragstart = (e) => {
    e.currentTarget.style.color = 'red'
    e.currentTarget.style.border = '1px solid red'
    e.dataTransfer.setData('id', e.currentTarget.id)
}

const handleOnDragend = (e) => {
    e.currentTarget.style.color = DEFAULT_FONT_COLOR
    e.currentTarget.style.border = ''
    e.currentTarget.style.left = `${e.clientX}px`
    e.currentTarget.style.top = `${e.clientY}px`
}

const handleOnDragover = (e) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('id');
    console.log(e)
}

const handleOnDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('id');
    const overElement = document.getElementById(id)
    e.currentTarget.innerHTML += overElement.innerHTML;
    overElement.remove();
}

const Status = {
    OVER_WIDTH : "isOverWidth",
    UNDER_WIDTH : "isUnderWidth",
    OVER_HEIGHT : "isOverHeight",
    UNDER_HEIGHT : "isUnderHeight",
    DEFAULT : "DEFAULT"
}

const createWords = (text, defaultX=0, defaultY=0, defaultDegree) => {
    const sawai = document.createElement('span')
    sawai.degree = defaultDegree
    sawai.innerHTML = text
    sawai.className = 'word'
    sawai.id = gen.next().value;
    sawai.draggable = true
    sawai.dropzone = 'move'
    sawai.ondragstart = handleOnDragstart
    sawai.ondragend = handleOnDragend
    sawai.ondragover = handleOnDragover
    sawai.ondrop = handleOnDrop
    sawai.currentX = () => parseFloat(sawai.style.left.match(/-?[\.0-9]*/)[0]) || defaultX
    sawai.currentY = () => parseFloat(sawai.style.top.match(/-?[\.0-9]*/)[0]) || defaultY
    sawai.move = () => {
        const WIDTH = document.body.clientWidth
        const HEIGHT = document.body.clientHeight
        sawai.style.color = fever ? `rgb(${Math.random()*280},${Math.random()*280},${Math.random()*280})` : DEFAULT_FONT_COLOR
        getCurrentStatus = () => {
            if(sawai.currentX() < 0) {
                return 'isUnderWidth'
            }
            if(sawai.currentX()> WIDTH) {
                return 'isOverWidth'
            }
            if(sawai.currentY() < 0) {
                return 'isUnderHeight'
            }
            if(sawai.currentY()+sawai.clientHeight > HEIGHT) {
                return 'isOverHeight'
            }
            return 'default'
        }
        nextParameters = () => {
            const nextXMap = {
                isOverWidth : WIDTH,
                isUnderWidth : 0,
                default : sawai.currentX()
            }
            const nextYMap = {
                isOverHeight : HEIGHT - sawai.clientHeight,
                isUnderHeight : 0,
                default : sawai.currentY()
            }
            const nextDegreeMap = {
                isOverWidth :　180-sawai.degree,
                isUnderWidth : 180-sawai.degree,
                isOverHeight : -sawai.degree,
                isUnderHeight : -sawai.degree,
                default : sawai.degree
            }
            const currentStatus = getCurrentStatus()
            const nextX = nextXMap[currentStatus]
            const nextY = nextYMap[currentStatus]
            const nextDegree = nextDegreeMap[currentStatus]
            sawai.degree = nextDegreeMap[currentStatus]
            return {
                x : nextX,
                y : nextY,
                degree : nextDegree
            }
        }

        const {x,y,degree} = {...nextParameters()}
        
        const rad = degree * Math.PI / 180
        sawai.style.left = `${x + Math.cos(rad)}px`
        sawai.style.top = `${y + Math.sin(rad)}px`
    }
    return sawai
}

window.onload = () => {
    const form = document.getElementById('form')
    form.onsubmit = e => {
        e.preventDefault()
        const sawai = createWords(e.currentTarget.words.value, 0, 30, Math.random()*400)
        setInterval(sawai.move,10)
        document.getElementById('wordsArea').appendChild(sawai)
    }
}