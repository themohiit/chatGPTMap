console.log("Observer started");
const messageStore = new Map()
let currentConversationId = null;


function getConversationId() {
  const match = window.location.pathname.match(/\/c\/([^/]+)/);
  return match ? match[1] : null;
}



function createToggleBar(){
    if(document.getElementById("toggle-bar")) return;
    const btn = document.createElement("button");
    btn.innerText="≡"
    btn.id = "toggle-bar";
    btn.style.position = "fixed";
    btn.style.top="12px";
    btn.style.right ="18px";
    btn.style.background ="#0c0c0cff";
    btn.style.color="white";
    btn.style.border="none";
    btn.style.zIndex ="10000";
    btn.style.padding = "8px 15px";
    btn.style.fontSize ="16px";
    btn.style.borderRadius="12px";
    btn.style.cursor="pointer";
    btn.addEventListener("mouseenter", () => btn.style.opacity = "1");
    btn.addEventListener("mouseleave", () => btn.style.opacity = "0.2");

    document.body.appendChild(btn);
}

function sidebar(){
    if(document.getElementById("sidebar")) return
    const bar = document.createElement("div");
    bar.id="sidebar";
    bar.style.position ="fixed";
    bar.style.top ="57px";
    bar.style.right ="-320px";
    bar.style.background ="#0c0c0cff";
    bar.style.color="white";
    bar.style.border="none";
    bar.style.borderRadius ="10px";
    bar.style.width = "320px";
    bar.style.height = "300px";
    bar.style.opacity= "1";
    bar.style.zIndex="9999";
    bar.style.padding = "12px";
    bar.style.overflowY = "auto";
    bar.style.overflowX = "hidden";
    bar.style.transition = "right 0.3s ease";
    bar.style.fontFamily = "system-ui, sans-serif";
    bar.innerHTML = `<h4 style="margin-bottom:10px;">Chat Map</h4>`
    bar.addEventListener("mouseenter", () => bar.style.opacity = "1");
    bar.addEventListener("mouseleave", () => bar.style.opacity = "0.2");
    bar.style.scrollbarWidth = "none";    
    bar.style.msOverflowStyle = "none"; 
    document.body.appendChild(bar);
}

function extractMessages() {


    const conversationId = getConversationId();

    
    if (conversationId !== currentConversationId) {
        console.log("Chat changed. Resetting state.");

        currentConversationId = conversationId;
        messageStore.clear();

   
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.innerHTML = `<h4 style="margin-bottom:10px;">Chat Map</h4>`;
    }
  }
    let hasNewMessage = false;
    const articles = document.querySelectorAll('article[data-turn="user"]');
    
    articles.forEach((article,index)=>{
        if(!article.dataset.serialNo){
            article.dataset.serialNo=`message:${index}`
        }
        const id = article.dataset.serialNo;

        const text = article.innerText
        .replace(/^You said:\s*/i, "")
        .replace(/\s*\n\s*/g, " ")
        .trim();

        if(!messageStore.has(id)){
            messageStore.set(id,{
                id,
                text,
                element:article
            })
            hasNewMessage = true;
        }
  })
  console.log("stored messages:",[...messageStore.values()])
  if(hasNewMessage){
    renderMessage();
    hasNewMessage = false;
  }

}

function renderMessage() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  sidebar.innerHTML = `<h4 style="margin-bottom:10px;">Chat Map</h4>`;

  messageStore.forEach(msg => {
    const item = document.createElement("div");

    // ✅ ALWAYS set full text
    item.innerText = msg.text;

    item.style.padding = "6px";
    item.style.marginBottom = "6px";
    item.style.cursor = "pointer";
    item.style.borderRadius = "6px";
    item.style.background = "#393a3fff";
    item.style.maxHeight="57px";
    /* ✅ 2-line ellipsis (correct way) */
    item.style.display = "-webkit-box";
    item.style.webkitLineClamp = "2";
    item.style.webkitBoxOrient = "vertical";
    item.style.overflow = "hidden";
    item.style.lineHeight = "1.5";
    item.style.maxWidth = "100%";

    /* Optional UX polish */
    item.title = msg.text;

    item.addEventListener("click", () => {
      msg.element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

    sidebar.appendChild(item);
  });
}




const observer = new MutationObserver(() => {
  extractMessages();
  
});
createToggleBar();
sidebar();
let sidebarOpen = false;

document.getElementById("toggle-bar").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");

  if (!sidebar) return;

  sidebarOpen = !sidebarOpen;
  sidebar.style.right = sidebarOpen ? "18px" : "-320px";
});


observer.observe(document.body, {
  childList: true,
  subtree: true
});
