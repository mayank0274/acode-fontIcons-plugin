import plugin from "../plugin.json";
import icons from "./icon.js";


const loader = acode.require("loader");

class fonticons {
  async init($page) {
    let command = {
      name: "Font icon",
      description: "Font icon",
      exec: this.run.bind(this),
    };
    editorManager.editor.commands.addCommand(command);

    $page.id = "acode-plugin-fonticon";
    $page.settitle("Font icons");
    this.$page = $page;

    this.$main = tag("main", {
      className: "main",
    });

    this.$page.append(this.$main);

    this.$main.style.height = "100%";
    this.$main.style.display = "flex";
    this.$main.style.flexDirection = "column";

    this.$main.style.alignItems = "center";
    // this.$main.style.justifyContent = "center";

    // container for search field and button
    this.$searchDiv = tag("div", {
      className: "searchDiv",
    });

    this.$searchDiv.style.display = "flex";
    this.$searchDiv.style.width = "100%";
    this.$searchDiv.style.justifyContent = "center";
    this.$searchDiv.style.alignItems = "center";
    this.$searchDiv.style.marginTop = "12px";

    // search field
    this.$search = tag("input", {
      type: "text",
      placeholder: "e.g. android",
      className: "search",
    });

    this.$search.style.width = "60%";
    this.$search.style.fontSize = "17px";
    this.$search.style.padding = "3px";

    // search button
    this.$searchBtn = tag("button", {
      textContent: "Search",
      className: "searchBtn",
    });

    this.$searchBtn.style.width = "20%";
    this.$searchBtn.style.padding = "5px";
    this.$searchBtn.style.textAlign = "center";
    this.$searchBtn.style.fontSize = "16px";
    this.$searchBtn.style.backgroundColor= "#ffffff";
    this.$searchBtn.style.color= "#000000";
    this.$searchBtn.style.borderRadius = "5px"
    this.$searchBtn.style.border = "1px solid #ffffff"
    this.$main.append(this.$searchDiv);
    this.$searchDiv.append(this.$search);
    this.$searchDiv.append(this.$searchBtn);

    // output area
    this.$displayDiv = tag("div", {
      className: "display",
    });

    this.$main.append(this.$displayDiv);
    this.$displayDiv.style.backgroundColor = "#404258";
    // 36454F
    this.$displayDiv.style.height = "70vh";
    this.$displayDiv.style.width = "85vw";
    this.$displayDiv.style.borderRadius = "5px";
    this.$displayDiv.style.color = "#ffffff";
    this.$displayDiv.style.marginTop = "15px";
    this.$displayDiv.style.overflowY = "scroll";
    this.$displayDiv.style.display = "flex";
    this.$displayDiv.style.flexDirection = "column";
    this.$displayDiv.style.textAlign = "center";

    this.$copyCdn = tag("button", {
      className: "copyCdn",
      textContent: "Insert Icon Cdn Link",
    });

    this.$main.append(this.$copyCdn);
    this.$copyCdn.width = "85%";
    this.$copyCdn.style.padding = "5px";
    this.$copyCdn.style.textAlign = "center";
    this.$copyCdn.style.fontSize = "18px";
    this.$copyCdn.style.marginTop = "10px";
    this.$copyCdn.style.backgroundColor= "#ffffff";
    this.$copyCdn.style.color= "#000000";
    this.$copyCdn.style.borderRadius = "5px"
    this.$copyCdn.style.border = "1px solid #ffffff"
    
  }
  
  clear_display() {
  	// elegant way to clear element childs and event listener (easy on memory)
  	const displayArea = document.querySelector(".display");

		while (displayArea.firstChild) {
			displayArea.removeChild(displayArea.lastChild);
		}
	}

  async run() {
    const page = this.$page;
    var that = this;
    this.$page.show();

    // cdn link for icons
    const cdnUrl = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.1.0/css/all.css" integrity="sha512-ajhUYg8JAATDFejqbeN7KbF2zyPbbqz04dgOLyGcYEk/MJD3V+HJhJLKvJ2VVlqrr4PwHeGTTWxbI+8teA7snw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    `;

    // head and style tag
    const head = document.getElementsByTagName("head")[0];

    head.innerHTML += cdnUrl;

    const style = document.createElement("style");
    const scrollStyle = `
  .display::-webkit-scrollbar {
			width: 8px;
		}
		
		.display::-webkit-scrollbar-track {
			background: #6B728E;
		}
		
		.display::-webkit-scrollbar-thumb {
			background:#50577A;
		}
  `;

    style.innerText = scrollStyle;
    head.appendChild(style);

    // function for inserting element in output area
    function insert(className) {
      const displayArea = document.querySelector(".display");
      const icon = document.createElement("div");

      icon.style.marginTop = "2px";
      icon.style.backgroundColor = "#474E68";
      icon.style.padding = "7px 0";
      icon.style.borderRadius = "4px";

      const html = `
<i class = "${className}" style="font-size:23px; padding:0 5px;"></i>
<code style="font-size:15px;">&lt;i class="${className}"&gt;&lt;/i&gt;</code>
`;

      icon.insertAdjacentHTML("afterbegin", html);
      displayArea.appendChild(icon);
    }

    // function for getting icon class from array of icons
    function getClass() {
      const iconArr = icons.icons;

      /* iconArr.forEach((e) => {
        insert(e);
      });
      */

      for (let i = 0; i < 60; i++) {
        insert(iconArr[i]);
      }
    }

    getClass();
    
    // function to insert icon in editor
    function insertToEditor() {
      const iconCode = document.getElementsByTagName("code");
      const iconCodeArr = Array.from(iconCode);
      iconCodeArr.forEach((e) => {
        const code = e.innerText;
        e.addEventListener("click", () => {
          editorManager.editor.insert(code);
          page.hide();
        });
      });
    }

    insertToEditor();

    //insert cdn link
    const cdn = document.querySelector(".copyCdn");
    cdn.onclick = function(){
      editorManager.editor.insert(cdnUrl)
      page.hide()
    };

    // search function

    const searchBtn = document.querySelector(".searchBtn");

    searchBtn.addEventListener("click", () => {
      const searchEle = document.querySelector(".search");
      const searchVal = searchEle.value.toLowerCase().trim()
      // support lower case and ignore trailing whitespace
      const displayArea = document.querySelector(".display");
      let filterArr = icons.icons;

			that.clear_display()
      

      if (searchVal === "all-icons") {
        for (let i = 0; i < filterArr.length; i++) {
          insert(filterArr[i]);
        }
      } else if(searchVal) {
      	// if search text not empty 
        const newArr = new Array();
        filterArr.forEach((e) => {
          if (e.includes(searchVal)) {
            newArr.push(e);
          }
        });
        if (newArr.length) {
          displayArea.innerHTML = " ";
          for (let i = 0; i < newArr.length; i++) {
            insert(newArr[i]);
          }
        } else {
        	displayArea.innerHTML = "No icon found for your search!!";
        }
      } else {
      	getClass();
      	// on empty search will return the primary items
      }
insertToEditor();
    });
    


    this.$page.onhide = () => {
      const displayArea = document.querySelector(".display");
const searchVal = document.querySelector(".search");
searchVal.value = ""
      that.clear_display();
      getClass();
    };
  }

  async destroy() {
    let command = {
      name: "Font icon",
      description: "Font icon",
      exec: this.run.bind(this),
    };
    editorManager.editor.commands.removeCommand(command);
  }
}

if (window.acode) {
  const acodePlugin = new fonticons();
  acode.setPluginInit(
    plugin.id,
    (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
      if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
      }
      acodePlugin.baseUrl = baseUrl;
      acodePlugin.init($page, cacheFile, cacheFileUrl);
    }
  );
  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
