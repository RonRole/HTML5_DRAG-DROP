const addWordsEvent = (sawai) => {
    sawai.draggable = true
    sawai.dropzone = 'move'
    sawai.style.position = 'absolute'
    sawai.ondragstart = (e) => {
        e.currentTarget.style.color = 'red'
        e.currentTarget.style.border = '1px solid red'
        e.dataTransfer.setData('id', sawai.id)
        console.log(sawai.id)
    }
    sawai.ondragend = (e) => {
        e.currentTarget.style.color = 'red'
        sawai.style.left = `${e.clientX}px`
        sawai.style.top = `${e.clientY}px`
    }

    sawai.ondragover = e => {
        e.preventDefault()
    }
    
    sawai.ondrop = e => {
        e.preventDefault();
        const id = e.dataTransfer.getData('id');
        const overElement = document.getElementById(id)
        console.log(e.currentTarget.innerHTML);
        console.log(overElement.innerHTML);
        e.currentTarget.innerHTML += overElement.innerHTML;
        overElement.remove();
    }
}

function* generateId(){
    var id = 0
    while(true) {
        yield id++
    }
}

const gen = generateId()

window.onload = () => {

    const form = document.getElementById('form')
    form.onsubmit = e => {
        e.preventDefault()
        const div = document.createElement('span')
        const text = document.createTextNode(e.currentTarget.words.value)
        div.id = gen.next().value;
        addWordsEvent(div);
        div.appendChild(text);
        
        document.getElementById('wordsArea').appendChild(div)
    }
    
}