// @ts-nocheck


class Imagex{
    constructor(w, h, pxarr){
        this.pixels = [...pxarr.slice()];
        this.width = w;
        this.height = h;
    }
}

class MyImage{
    constructor(image){
        this.pixelVector = image.pixels
        this.pixels = []
        this.width = image.width
        this.height = image.height

        this.darkest = 255
        this.lightest = 0
        this.colorRegions = []
        this.letters = []
        this.arrangeArray()
        this.reduce()
    }
    arrangeArray(){
        let ops = 0
        for (let i = 0; i < this.height; i++) {
            this.pixels.push([])
            for (let j = 0; j < this.width; j++) {
                this.pixels[i].push(this.pixelVector[0])
                this.pixelVector.shift();
                
            }
            
        }
    }
    initLuminosity(){
        let colorRegions = {}
        this.forEachPixel((x,y,value)=>{
            if(!colorRegions[value]){colorRegions[value]=1} else {colorRegions[value]++}
            return false;
        })

        let colors = Object.keys(colorRegions)
        let range1 = parseInt(colors[0])
        let range2 = parseInt(colors[Math.round(colors.length/1.8)])

        this.forEachPixel((x,y,value)=>{

            if(value>range1&&value<range2){return 0} else {return 255}
            return false;
        })
        
    }
    reduceRows(){
        
        let firstOne = false;
        for (let i = 0; i < this.pixels.length; i++) {
            const e = this.pixels[i];
            let foundAny = false;
            for (let j = 0; j < this.pixels[i].length; j++) {
                const element = this.pixels[i][j];
                
                if(element==0){
                    foundAny = true;
                    break;
                }
                
            }
            if(!foundAny){
                
                for (let j = 0; j < this.pixels[i].length; j++) {
                    this.pixels[i][j] = 120
                }
            } else {
                if(!firstOne){
                    this.firstRow = i;
                    firstOne = true;
                }
                this.lastRow = i
            }
        }
    }
    reduceColumns(){
        let lastOne = false;
        for (let i = 0; i < this.width; i++) {
            let foundAny = false;
            let foundIndex = 0
            for (let j = 0; j < this.height; j++) {
                const element = this.pixels[j][i];
                if(element==0){
                    foundAny = true;
                    foundIndex = i
                    break;
                }
                
            }
            if(!foundAny){
                
                for (let j = 0; j < this.height; j++) {
                    this.pixels[j][i] = 120
                }
                
            } 
            if(lastOne==false&&lastOne!=foundAny){
                this.letters.push({
                    x1:i,
                    y1:this.firstRow,
                    x2:0,
                    y2:this.lastRow,
                    data:[]
                   
                })

            }

            if(lastOne==true&&lastOne!=foundAny){
                this.letters[this.letters.length-1].x2 = i-1

            }
            lastOne = foundAny
        }
    }
    initLetters(){
        this.letters.forEach(e=>{
            for (let i = e.y1; i < e.y2; i++) {
                let tempo = []
                let whiteReductor = false;
                for (let j = e.x1; j < e.x2; j++) {
                    if(this.pixels[i][j]==0){whiteReductor = true;}
                    tempo.push(this.pixels[i][j])
                }
                if(whiteReductor) e.data.push(tempo)
            }
            e.w = e.data[0].length
            e.h = e.data.length
            
        })
    }
    initBarriers(){
        this.forEachRow()
    }
    checkPoints(letter,digit){
        let digitReference = resizeArray(numbers[digit].data,letter.h,letter.w)

        let points = 0
        let max = 0
        for (let i = 0; i < letter.data.length; i++) {
            for (let j = 0; j < letter.data[i].length; j++) {
                const e = letter.data[i][j];
                if(e==0){max++}
                if(Math.abs(e-digitReference[i][j])<100&&e==0){
                    points+=1
                    // letter.data[i][j]='red'
                }
                if(e==255 && digitReference[i][j]<100){
                    points-=1
                }
            }
            
        }
        return points
    }
    reduce(){
        this.print(3)
        this.initLuminosity()
        this.reduceRows()
        this.reduceColumns()
        this.initLetters()
        this.letters.forEach((letter,i)=>{
            
            i++
            let pos = {x:i*50+20,y:20}
            
            let maxPoints = 0
            let maxDigit = -1
            for (let h = 0; h <= 9; h++) {
                let digitReference = resizeArray(numbers[h].data,letter.h,letter.w)

                let points = 0
                let max = 0
                for (let i = 0; i < letter.data.length; i++) {
                    for (let j = 0; j < letter.data[i].length; j++) {
                        const e = letter.data[i][j];
                        if(e==0){max++}
                        if(Math.abs(e-digitReference[i][j])<100&&e==0){
                            points+=1
                            // letter.data[i][j]='red'
                        }else if(e==255 && digitReference[i][j]<50){
                            points-=1
                        }
                    }
                    
                }
                points = points*max
                if(points>maxPoints){
                    maxPoints = points;
                    maxDigit = h
                }
                
            }
            
            // this.printShape(letter.data,2,pos.x,pos.y)
            text(`${maxDigit}`,letter.x1*3,letter.y1*3)
            push()
            stroke('red')
            noFill()
            rectMode(CORNERS)
            rect(letter.x1*3,letter.y1*3,letter.x2*3,letter.y2*3)
            
            pop()
        })
        
        // console.log(,)        
    }
    print(scale){
        push()
        noStroke()
        this.forEachPixel((x,y,value)=>{
            fill(value)
            rect(x*scale,y*scale,scale,scale)
            return false;
        })
        pop()
    }
    printShape(dataArray,scale,posX,posY){
        push()
        noStroke()
        let h = dataArray.length
        let w = dataArray[0].length
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                fill(dataArray[i][j])
                rect(posX+j*scale,posY+i*scale,scale,scale)
                
            }
            
        }
        noFill()
        stroke('red')
        // rect(posX,posY,scale*w,h*scale)
        pop()
        
    }
    forEachPixel(callback = (x,y,value)=>{}){
        for (let i = 0; i < this.pixels.length; i++) {
            for (let j = 0; j < this.pixels[i].length; j++) {
                let cb = callback(j,i,this.pixels[i][j])
                if(cb!==false){this.pixels[i][j]=cb}
            }
            
        }
    }

}

function ocr(imageParameter){
    console.time()
    imageParameter = new MyImage(imageParameter)
    console.timeEnd
}


