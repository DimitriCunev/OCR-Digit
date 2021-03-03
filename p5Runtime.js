// @ts-nocheck
let imgarr = []
let eight = []
function preload(){
    imgarr.push(loadImage('./testCases/ocr-demo4.png'))
    for (let i = 0; i < 10; i++) {
        imgarr.push(loadImage(`./testCases/digits/tile00${i}.jpg`))
        
    }
    
}

let numbers = []

function imageToPixels(img){

    let pa = []
    img.loadPixels()
    for (y = 0; y < img.height; y++) {
        for (x = 0; x < img.width; x++) {

          let index = (x + y * img.width) * 4;
          pa.push(img.pixels[index])

        }
      }
    return pa
}

function vectorToMap(data,w,h){
    let res = []
    for (let i = 0; i < h; i++) {
        let temp = []
        for (let j = 0; j < w; j++) {
            temp.push(data[0])
            data.shift()
        }
        res.push(temp)
    }
    return res
}


function resizeArray(array,scaleX,scaleY){
    let narr = []
    for (let i = 0; i < scaleX; i+=1) {
        narr.push([])
        for (let j = 0; j < scaleY; j+=1) {
            narr[narr.length-1].push(array[Math.round(i*(array.length)/scaleX)][Math.round(j*(array[0].length)/scaleY)])
                
        }
    }
    return narr
}

function setup(){

    createCanvas(1200, 500)
    background(255)



    img = imgarr[0]
    let pa = imageToPixels(img)

    for (let i = 0; i < 10; i++) {
        numbers.push({
            number:i,
            data:vectorToMap(imageToPixels(imgarr[i+1]),imgarr[i+1].width,imgarr[i+1].height)
        })
        
    }
    console.log(JSON.stringify(numbers))
    

    let imx = new Imagex(img.width, img.height,pa);
    
    ocr(imx)
}
function draw(){

}
