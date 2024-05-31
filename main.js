let get = document.querySelector.bind(document);
const playButton = get("#play");
const resetButton = get("#reset");
playButton.onclick = ()=>{
    
    isPlaying = !isPlaying
    playButton.innerText = isPlaying ? "stop simulation":'play simulation'
}

let isPlaying = false;
const fps = 60;
const regolatore = 60 / fps;
var mouse = {
    down: false,
    x: 0,
    y: 0
}
let x = 0, y = 0;
const canvas = get("#canvas");
console.log(canvas)
const c = canvas.getContext("2d");
console.log("hi")
canvas.width = 800;
canvas.height = 800;
let centerX = Math.floor(canvas.width / 2);
let centerY = Math.floor(canvas.height / 2);

class Atom {
    constructor(x, y, id){
        this.id = id;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.acceleration = {
            x: 0,
            y: 0
        }
        this.position = {
            x: x,
            y: y
        }
        this.radius = 10;
        this.clicked = false;
        this.color = "blue";
    
    }
    click() {
        this.color = "rgb(20,20,140)",
        this.clicked = true
    }
    unclick() {
        this.color = "blue",
        this.clicked = false
    }
    draw(){
        //console.log(this.position)
        if (!this.clicked && isPlaying) {
            //if(this.x console.log(this.v)
            //console.log({speed: this.velocity.x * 60})
            this.velocity.x += this.acceleration.x * regolatore;
            this.velocity.y += this.acceleration.y * regolatore;
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            
            //console.log({velocity: this.v, accelleration: this.a})
           // console.log(this.v)
        }
        c.fillStyle= this.color;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fill();
        c.beginPath();
        let x = this.acceleration.x * 10000
        let y = this.acceleration.y*10000
        c.moveTo(this.position.x, this.position.y)
        c.lineTo(this.position.x +x , this.position.y +y)
        c.strokeStyle = "white";
        c.lineWidth = 3;
        c.stroke()
        
    }
    
}

// class MagneticCamp {
//     constructor(x, y, radius, power){
//         this.x = x;
//         this.y = y;
//         this.radius = radius;
//         this.power = power;
//         this.color = "blue"
//         this.clicked = false
//     }
//     click(){
//         this.color = "red",
//         this.clicked = true
//     }
//     unclick(){
//         this.color = "blue",
//         this.clicked = false
//     }
//     draw(){
//         c.fillStyle = "rgb(200,200,255,0.2)";
//         c.strokeStyle = this.color;
//         c.beginPath();
//         c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
//         c.lineWidth = 4;
//         c.stroke();
//         c.fill();
//         c.fillStyle = "blue"
//         c.fillRect(this.x -1, this.y-1,2,2)
//     }
// }

// let camp = new MagneticCamp(300,300,150, 10)
// let camp1 = new MagneticCamp(600, 700, 150, 5)
// let camp2 = new MagneticCamp(0, 700, 150, 10)
// let camp3 = new MagneticCamp(800, 0, 150, 5)
// const camps = [camp, camp1, camp2, camp3];
let player = new Atom();

let electrons = [new Atom(400, 600, getId()), new Atom(200, 300, getId()), new Atom(500, 100, getId())];
resetButton.onclick = () => {
    isPlaying = false;
    electrons = [new Atom(400, 600, getId()), new Atom(200, 300, getId()), new Atom(500, 100, getId())];
    drawElectronBoxes();

}
function getId() {
    return (Math.random() * 1000).toFixed(0) + Date.now();
}
let campIsClicked = (electron, mouse) =>{
    const offset = electron.radius/2;
    return (
        mouse.x > electron.position.x - offset &&
        mouse.x < electron.position.x + offset &&
        mouse.y > electron.position.y - offset &&
        mouse.y < electron.position.y + offset
    )
}
get("#add-electron").onclick = () =>{
    const electronId = getId();
    electrons.push(new Atom(canvas.height/2, canvas.width/2, electronId));
    get("#electron-boxes").appendChild(ElectronBox(electronId, electrons.length - 1))
}
window.addEventListener("mousedown", (e)=>{
    
    mouse.down = true;

    mouse.x = e.clientX - canvas.offsetLeft;
    mouse.y = e.clientY - canvas.offsetTop;
    if(mouse.x >= player.x - player.radius/2 &&
        mouse.x <= player.x + player.radius/2 &&
        mouse.y >= player.y - player.radius/2 &&
        mouse.y <= player.y + player.radius/2){
            player.clicked = true;
            player.v = {
                x: 0,
                y: 0
            }
        }
    for(const electron of electrons){
        if (campIsClicked(electron, mouse)) electron.click();
    }
    
   
})
function drawLine(){

}
window.addEventListener("mouseup", (e) =>{
    mouse.down = false;
    player.clicked = false;
    electrons.map(camp => camp.unclick());
    //console.log(camps)
})
window.addEventListener("mousemove", (e)=>{
    if(!mouse.down) return;
   // console.log(mouse, player)
    mouse.x = e.clientX - canvas.offsetLeft;
    mouse.y = e.clientY - canvas.offsetTop;
    if(player.clicked){
        player.x = mouse.x - player.width /2;
        player.y = mouse.y - player.height/2;
        console.log(player)
    }
    let clickedElectrons = electrons.filter(electron => electron.clicked);
    //console.log({clickedCamps})
    let clickedElectron = clickedElectrons[0]
    //console.log({clickedCamp})
    if(clickedElectron){
        clickedElectron.position.x = mouse.x;
        clickedElectron.position.y = mouse.y;
        //console.log(player)
    }
    

})
// return true if the rectangle and circle are colliding
function rectCircleColliding(circle,rect){
    var distX = Math.abs(circle.x - rect.x-rect.width/2);
    var distY = Math.abs(circle.y - rect.y-rect.height/2);

    if (distX > (rect.width/2 + circle.radius)) { return false; }
    if (distY > (rect.height/2 + circle.radius)) { return false; }

    if (distX <= (rect.width/2)) { return true; } 
    if (distY <= (rect.height/2)) { return true; }

    var dx=distX-rect.width/2;
    var dy=distY-rect.height/2;
    return (dx*dx+dy*dy<=(circle.radius*circle.radius));
} 
const e = -1.6022 * Math.pow(10, -19);
const mE = 9.11 * Math.pow(10, -31);
const k0 = 8.99 * Math.pow(10, 9);
const tuttoInsieme = (k0 * Math.pow(e, 2)) / mE;
let acc = (r) => tuttoInsieme/(r*r);

// const Forza = (r) =>{
//     return (k0 * Math.pow(e, 2)) /Math.pow(r, 2);
// }
// const Acc = (f) =>{
//     return f/mE;
// }
const pitagora = (cateto1, cateto2) => Math.sqrt((Math.pow(cateto1, 2) + Math.pow(cateto2, 2)));
const Calc = (distanceX, distanceY) =>{
    let ipotenusa = pitagora(distanceX, distanceY);
    const vettoreAcc = acc(ipotenusa)

    return {
        x: vettoreAcc* distanceX/ipotenusa,
        y: vettoreAcc * distanceY / ipotenusa
    }
}

//console.log({F: F(1), ms: F(1)/mE})
let then = Date.now();

let count = 0;
function drawLines() {
    for (let x = 0; x < canvas.width ; x += 10) {
        for (let y = 0; y < canvas.height; y += 10) {
            const vettore = {
                x: 0,
                y: 0
            }
            let radians =0;
            camps.map(camp =>{
                const ipo = pitagora(camp.x-x, camp.y-y);
                radians = Math.asin(Math.abs(camp.y-y)/ipo) ;
                if(!radians) console.log(camp.y/ipo)
                console.log({deg: radians * 180/Math.PI, rad: radians})
            })
            c.save();
            let cx = x+ 5;
            let cy = y+5;
            c.translate(cx,cy);
            c.rotate(radians+1.75);
            c.translate(-cx, -cy)
            c.fillStyle = "rgba(20,200,20,0.5)";
            c.fillRect(x + 4, y + 2, 2, 4)
            c.restore();
        }
    }
}
function ElectronBox (id, number){
    const box = document.createElement("div");
    box.className = "electron-box";
    box.id = "electron-box" + id;
    box.innerHTML = `
    <h3>electron ${number}</h3>
    <p>speed</p>
    <p class="speed">x: 0, y: 0</p>
    <p>acceleration</p>
    <p class="acceleration"></p>
    <button onclick="deleteAtom(${id})">elimina</button>
    `
    return box
}
function deleteAtom(id) {
    let found = false;
    electrons = electrons.filter(atom =>{
        console.log(id, atom.id)
        if(atom.id== id){   
            removeElectronBox(id)
        }else{
            return atom
        }

    })
    renameBoxes();
}
function renameBoxes(){
    let elBoxes = document.querySelectorAll(".electron-box");
    electrons.map((electron, i)=>{
        let child = elBoxes[i].querySelector("h3");
        console.log(child, i)
        child.innerText = "electron " + i;
})
    
}
function removeElectronBox(id){
    let elBoxes = get("#electron-boxes");
    let child = elBoxes.querySelector("#electron-box" + id)
    elBoxes.removeChild(child)
}
function drawElectronBoxes(){
    get("#electron-boxes").innerHTML = "";
    electrons.forEach((electron, i) => {
        const electronBox = ElectronBox(electron.id, i);
        get("#electron-boxes").appendChild(electronBox)
    })
}
drawElectronBoxes()


function main() {
    //console.log("hi")
    let now = Date.now();
    let difference = now - then;
    //console.log(difference)
    //if (difference > 1000 / fps){
        
        c.clearRect(0,0, canvas.width, canvas.height)
        //drawLines()
        count++;
   
        //console.log(count)
        then = now;
        //if (isPlaying) {
        
        for(let i = 0; i<electrons.length; i++){
            let electron = electrons[i]
            let electronAccelleration = {
                x: 0,
                y: 0
            }
            for (let j = 0; j < electrons.length; j++) {
                if(j != i){
                    let otherElectron = electrons[j];
                    const distanceFromCenter = {
                        x: electron.position.x - otherElectron.position.x,
                        y: electron.position.y - otherElectron.position.y
                    }
                    const { x, y } = Calc(distanceFromCenter.x, distanceFromCenter.y);
                    
                    electronAccelleration.x += x //* versoX;
                    electronAccelleration.y += y //* versoY;
                }
            }
           // console.log("electron: " + i, electronAccelleration)
            electron.acceleration = electronAccelleration;
            // electron.velocity.x += electron.acceleration.x * regolatore;
            // electron.velocity.y += electron.acceleration.y * regolatore;
            let speed = get("#electron-box"+ electron.id).querySelector(".speed");

            speed.innerText = `x: ${electron.velocity.x.toPrecision(3)}, y: ${electron.velocity.y.toPrecision(3) }`
        }
    //}
    for(const electron of electrons){
        electron.draw()
    }
    requestAnimationFrame(main)
}
main()

// for(let camp of camps) {

//     const distanceFromCenter = {
//         x: electron.x - camp.x,
//         y: electron.y - camp.y
//     }
//     const { x, y } = Calc(distanceFromCenter.x, distanceFromCenter.y);

//     electronAccelleration.x += x //* versoX;
//     electronAccelleration.y += y //* versoY;

// }