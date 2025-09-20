let prompt=document.querySelector("#prompt");
let chatContainer=document.querySelector(".chat-container");
let submitbtn=document.querySelector("#submit");

const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDGrwAmW3ExCh452_SqojpvTp-jKw8J_J8";
let user={
    data:null,
}

async function generateResponse(aiChatBox) {

    let text = aiChatBox.querySelector(".ai-chat-area")

    let RequestOption={
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
                "contents": [
                    {"parts":[{"text": user.data}

                    ]
                  }]
                 
        })
    }
    try{
        let response=await fetch(Api_Url,RequestOption)
        let data=await response.json()
        console.log(data);
        let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
        console.log(apiResponse);
        text.innerText=apiResponse
    }
    catch(error){
        console.log(error);
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
    }



   
    
}



function createChatBox(html,classes){
    let div=document.createElement("div");
    div.innerHTML=html;
    div.classList.add(classes);
    return div;
}




function handlechatResponse(message){
    user.data=message;
    let html=`<img src="USERIMAGE.jpg" alt="userImage" id="userImage" width="8%">
            <div class="user-chat-area">
            ${user.data}
            </div>`
            prompt.value="";
            let userChatBox=createChatBox(html,"user-chat-box")
            chatContainer.appendChild(userChatBox);

            chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
            setTimeout(()=>{
                    let html=` <img src="AI BOT.jpg" alt="AI-Image" id="aiImage" width="8%">
            <div class="ai-chat-area">
            <img src="lo.webp" alt="" class="load" width="50px">
            </div>`
            let aiChatBox=createChatBox(html,"ai-chat-box");
            chatContainer.appendChild(aiChatBox);
            generateResponse(aiChatBox);
            },600)
}

prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
        handlechatResponse(prompt.value); 
    }
});
submitbtn.addEventListener("click",()=>{
    handlechatResponse(prompt.value);
})