const fs=require('fs')
const express=require('express')
const app=express();

const datenow=new Date().toString()

app.get('/',(req,res)=>{
    fs.writeFile('date.txt',datenow,((error,data)=>{
        if(error){
            res.send(error)
        }else{
            res.send(data)
        }
    }
       
    ))
})

app.listen(3004);