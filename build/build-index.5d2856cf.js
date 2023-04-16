const fileSystem=null,VERSION_NUMBER="0.7.0-ALPHA";var debugConsole;function toggleSidebar(){let e=M.Sidenav.getInstance(document.getElementById("slide-out"));e.isOpen?e.close():e.open()}function debounce(e,t=300){let n;return(...o)=>{clearTimeout(n),n=setTimeout((()=>{e.apply(this,o)}),t)}}function initMenu(){M.Carousel.init(document.querySelectorAll(".carousel"),{numVisible:5,dist:-20,noWrap:!0,preventLoop:!0,enableTouch:!1,duration:30}),document.querySelectorAll(".carousel-item").forEach((e=>e.setAttribute("draggable",!1))),document.querySelectorAll(".left-menu-button").forEach((e=>e.onclick=()=>M.Carousel.getInstance(document.getElementById("menuCarousel")).prev())),document.querySelectorAll(".right-menu-button").forEach((e=>e.onclick=()=>M.Carousel.getInstance(document.getElementById("menuCarousel")).next()))}function toggleMenu(){let e=M.Modal.getInstance(document.getElementById("menu"));e.isOpen?e.close():e.open()}async function createAndLoadConfig(){storageManager.find("keybinds").then(initKeybinds,(e=>{initKeybinds(DEFAULT_KEYBIND_CONFIG),storageManager.persist(keybinds,DEFAULT_KEYBIND_CONFIG)}))}function fileToDirPath(e){return e.slice(0,e.lastIndexOf("/"))}document.addEventListener("DOMContentLoaded",(function(){console.info("Version 0.7.0-ALPHA"),document.getElementById("version").innerHTML="0.7.0-ALPHA",M.Modal.init(document.getElementById("menu"),{onOpenStart:()=>IodineGUI.isPlaying&&IodineGUI.Iodine.pause(),onCloseEnd:()=>!IodineGUI.isPlaying&&IodineGUI.Iodine.playStatusCallback&&IodineGUI.Iodine.play(),dismissible:!1}).open(),initMenu(),createAndLoadConfig(),M.Autocomplete.init(document.getElementById("autocomplete-items"),{limit:4,data:Object.keys(ITEM_DATA).reduce(((e,t)=>(e[t]=null,e)),{})}),M.Autocomplete.init(document.getElementById("autocomplete-locations"),{limit:4,data:Object.keys(KEY_LOCATION_DATA).reduce(((e,t)=>(e[t]=null,e)),{}),onAutocomplete:()=>{let e=KEY_LOCATION_DATA[document.getElementById("autocomplete-locations").value].split(",");document.getElementById("game-value-input").value=e[0],document.getElementById("bank-value-input").value=e[1],document.getElementById("map-value-input").value=e[2],document.getElementById("warp-value-input").value=e[3],M.FormSelect.getInstance(document.getElementById("game-value-input"))._handleSelectChangeBound()}}),M.Autocomplete.init(document.getElementById("autocomplete-hints"),{limit:4,data:Object.fromEntries(Object.keys(PATH_FINDING_LOCATIONS).map((e=>[e,null])))}),populateHints(),M.FormSelect.init(document.querySelectorAll("select"),{}),debugConsole=M.Modal.init(document.getElementById("console"),{}),document.querySelectorAll("input[type=text]").forEach((e=>e.addEventListener("focusin",(e=>userInputEnabled=!1)))),document.querySelectorAll("input[type=text]").forEach((e=>e.addEventListener("focusout",(e=>userInputEnabled=!0))));let e=document.querySelectorAll(".sidenav");M.Sidenav.init(e,{})})),CommandExecutor.register("toggleRouteFinder",(e=>toggleSidebar())),window.addEventListener("resize",initMenu,!0),document.addEventListener("keydown",(e=>doInput(e.code,!0,!1))),document.addEventListener("keyup",(e=>doInput(e.code,!1,!1))),CommandExecutor.register("toggleMenu",(e=>toggleMenu()));let keybinds=new Map;function initKeybinds(e){e=JSON.parse(e);let t=document.getElementById("key-binding-table");e.sort(sortCommands),e.forEach((e=>{"exec"==e.type?(e.kbd&&keybinds.set("KBD-"+e.kbd+"-Down",e.command),e.gmpd&&keybinds.set("GMPD-"+e.gmpd+"-Down",e.command)):"button"==e.type&&(e.kbd&&keybinds.set("KBD-"+e.kbd+"-Down",e.command+"Down"),e.kbd&&keybinds.set("KBD-"+e.kbd+"-Up",e.command+"Up"),e.gmpd&&keybinds.set("GMPD-"+e.gmpd+"-Down",e.command+"Down"),e.gmpd&&keybinds.set("GMPD-"+e.gmpd+"-Up",e.command+"Up"));let n=t.insertRow(t.rows.length);n.insertCell(0).innerHTML=`<td>&nbsp;${e.command.replace("Key","")}</td>`;let o=n.insertCell(1);o.innerHTML=`<td>&nbsp;<span>${e.kbd.replace("Key","")||"N/A"}</span></td>`,o.setAttribute("data-command",e.command),o.setAttribute("data-type",e.type),o.addEventListener("click",listenForKbdBinding);let i=n.insertCell(2);i.innerHTML=`<td>&nbsp;<span>${e.gmpd||"N/A"}</span></td>`,i.setAttribute("data-command",e.command),i.setAttribute("data-type",e.type),i.addEventListener("click",listenForGmpdBinding)}))}let listenFor=!1;function listenForKbdBinding(e){M.Toast.dismissAll(),listenFor={isGamepad:!1,command:e.currentTarget.getAttribute("data-command"),type:e.currentTarget.getAttribute("data-type"),elmnt:e.currentTarget,oldCode:e.currentTarget.querySelector("span").innerHTML},M.toast({html:"Press any key...",displayLength:3e3,completeCallback:()=>freezeClic=listenFor=!1}),freezeClic=!0}function listenForGmpdBinding(e){M.Toast.dismissAll(),listenFor={isGamepad:!0,command:e.currentTarget.getAttribute("data-command"),type:e.currentTarget.getAttribute("data-type"),elmnt:e.currentTarget,oldCode:e.currentTarget.querySelector("span").innerHTML},M.toast({html:"Press any button...",displayLength:3e3,completeCallback:()=>freezeClic=listenFor=!1}),freezeClic=!0}var userInputEnabled=!0;function doInput(e,t,n){userInputEnabled&&(listenFor&&!listenFor.isGamepad&&!n&&t?("button"==listenFor.type?(keybinds.delete("KBD-"+listenFor.oldCode+"-Down"),keybinds.delete("KBD-"+listenFor.oldCode+"-Up"),keybinds.set("KBD-"+e+"-Down",listenFor.command+"Down"),keybinds.set("KBD-"+e+"-Up",listenFor.command+"Up")):"exec"==listenFor.type&&(keybinds.delete("KBD-"+listenFor.oldCode+"-Down"),keybinds.set("KBD-"+e+"-Down",listenFor.command)),listenFor.elmnt.innerHTML=`<td>&nbsp;<span>${e.replace("Key","")}</span></td>`,listenFor=!1,M.Toast.dismissAll(),writeKeybinds()):listenFor&&listenFor.isGamepad&&n&&t?("button"==listenFor.type?(keybinds.delete("GMPD-"+listenFor.oldCode+"-Down"),keybinds.delete("GMPD-"+listenFor.oldCode+"-Up"),keybinds.set("GMPD-"+e+"-Down",listenFor.command+"Down"),keybinds.set("GMPD-"+e+"-Up",listenFor.command+"Up")):"exec"==listenFor.type&&(keybinds.delete("GMPD-"+listenFor.oldCode+"-Down"),keybinds.set("GMPD-"+e+"-Down",listenFor.command)),listenFor.elmnt.innerHTML=`<td>&nbsp;<span>${e}</span></td>`,listenFor=!1,M.Toast.dismissAll(),writeKeybinds()):(e=(n?"GMPD-":"KBD-")+e+(t?"-Down":"-Up"),keybinds.get(e)&&CommandExecutor.execute(keybinds.get(e))))}function writeKeybinds(){let e=[];new Set([...keybinds.values()].filter((e=>!e.includes("KeyUp")))).forEach((t=>{let n={},o=t.includes("Down")&&[...keybinds].filter((([e,n])=>n==t.replace("Down","Up")>0));n.type=o?"button":"exec",n.command=o?t.replace(/KeyDown$/,"Key"):t,n.kbd=null,n.gmpd=null,[...keybinds].filter((([e,n])=>n==t)).forEach((e=>n[e[0].includes("KBD")?"kbd":"gmpd"]=e[0].match(/-(.*)-/).pop())),e.push(n)})),e.sort(sortCommands);let t=JSON.stringify(e,null,2).replace(/([\"|(null)|\{],?)\n/g,"$1");storageManager.persist("keybinds",t)}function sortCommands(e,t){return e.type+commandToIndex(e.command)>t.type+commandToIndex(t.command)?1:-1}function commandToIndex(e){switch(e){case"AKey":return 0;case"BKey":return 1;case"LKey":return 2;case"RKey":return 3;case"StartKey":return 4;case"SelectKey":return 5;case"UpKey":return 6;case"DownKey":return 7;case"LeftKey":return 8;case"RightKey":return 9;case"SpeedUp":return 10;case"Restart":return 11;case"toggleMenu":return 12;default:return 999}}function menuInput(e){switch(e){case"A":case"B":case"START":case"SELECT":case"UP":case"DOWN":case"LEFT":case"RIGHT":break;case"L":M.Carousel.getInstance(document.getElementById("menuCarousel")).prev();break;case"R":M.Carousel.getInstance(document.getElementById("menuCarousel")).next()}}let freezeClic=!1;function populateHints(){let e=document.getElementById("hint-table");Object.entries(HINTABLE_LOCATIONS).forEach((t=>{let n=e.insertRow(e.rows.length);n.insertCell(0).innerHTML=`<td>&nbsp;${t[0]}</td>`;let o=n.insertCell(1);o.innerHTML="<td>&nbsp;<span>Show Hint</span></td>",o.setAttribute("data-location",t[1]),o.setAttribute("data-target",`hint-table-${t[0].replaceAll(" ","-")}`),o.addEventListener("click",displayHint);let i=n.insertCell(2);i.setAttribute("id",`hint-table-${t[0].replaceAll(" ","-")}`),i.innerHTML="<td>&nbsp;...</td>"}))}function displayHint(e){let t=document.getElementById(e.currentTarget.getAttribute("data-target")),n=getHint(e.currentTarget.getAttribute("data-location"));t.innerHTML=n}function searchRoute(){if(document.getElementById("searchRouteFinder").innerHTML="<span>PROCESSING</span>","undefined"==typeof cy){let e=document.getElementById("input_seed_text").value;setTimeout((()=>{mapWarps(e).then(searchRouteAux())}),50)}else searchRouteAux()}function searchRouteAux(){let e=document.getElementById("autocomplete-hints").value,t=shortestPath(e),n=document.getElementById("route-finder-flags");n.innerHTML="",0==t.flags.size?n.appendChild(createFlagItem("NONE")):t.flags.forEach((e=>n.appendChild(createFlagItem(e))));let o=document.getElementById("route-finder-route");o.innerHTML="",t.route.forEach((e=>o.appendChild(createRouteItem(e)))),document.getElementById("searchRouteFinder").innerHTML="<span>SEARCH</span>"}function createFlagItem(e){let t=document.createElement("li");return t.innerHTML=e,t}function createRouteItem(e){if("WALK"==e.substring(0,4)){let t=document.createElement("div");return t.innerHTML="WALK TO "+e.slice(4),t.setAttribute("class","walk-to"),t}if("WARP"==e.substring(0,4)){let t=document.createElement("div");return t.innerHTML="WARP TO "+e.slice(4),t.setAttribute("class","warp-to"),t}let t=document.createElement("li"),n=e.split("-").map((e=>e.trim()));return t.innerHTML=n[0]+" - "+n[1]+"<br/>"+n[2],t}document.addEventListener("click",(e=>{freezeClic&&(M.Toast.dismissAll(),e.stopPropagation(),e.preventDefault())}),!0),document.addEventListener("swiped-down",(e=>{console.log(e.detail.yEnd-e.detail.yStart),e.detail.yEnd-e.detail.yStart>250&&toggleMenu()}));
//# sourceMappingURL=build-index.5d2856cf.js.map
