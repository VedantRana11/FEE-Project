const url = "https://www.reddit.com/";
const loader=document.querySelector(".load");

//refreshing of the mainpage data;
const refresh = () => {
  loader.style.display="flex";
  const cards = document.querySelectorAll(".cards");
  cards.forEach((ele) => {
    ele.remove();
  });
};

//refreshing community data;
const refreshCommunity = () => {
  const community = document.querySelectorAll(".community");
  community.forEach((ele) => {
    ele.remove();
  });
};



//get call for the popular subreddits
const popSubreddit = async () => {
  try {
    let popSub = {};
    refreshCommunity();
    if (Object.keys(popSub).length == 0) {
      const res = await axios.get(url + "subreddits/popular.json");
      popSub = res.data.data.children;
      console.log("api call");
    }
    return popSub;
  } catch (error) {
    console.log(error);
  }
};

//main call
popSubreddit().then((element) => {
  element.forEach((ele) => {
    showSub(ele);
  });
  communities.appendChild(seelbtn);
});

let combox = document.querySelector(".combox");
let communities = document.querySelector(".communities");

//displaying of popular subreddits
const showSub = (data) => {
  let icon = data.data.icon_img;
  let dispName = data.data.display_name_prefixed;
  const community = document.createElement("div");
  community.classList.add("community");

  if (data.data.icon_img == "") {
    icon = "img/sublogo.png";
  }
  community.innerHTML = `<img src=${icon} alt="">
    <a href="#">${dispName}</a>`;

  combox.appendChild(community);
};

let seeMore = document.querySelector("#seeMore");
let seelbtn = document.createElement("button");
seelbtn.innerText = "See less";
seelbtn.classList.add("see");
seelbtn.style.display = "none";

seeMore.addEventListener("click", () => {
  communities.style.height = "70vh";
  seeMore.style.display = "none";
  combox.style.height = "70vh";
  combox.style.overflow = "auto";
  seelbtn.style.display = "block";
});
combox.appendChild(seelbtn);

seelbtn.addEventListener("click", () => {
  communities.style.height = "43vh";
  seeMore.style.display = "block";
  combox.style.height = "50vh";
  combox.style.overflow = "hidden";
  seelbtn.style.display = "none";
});

//to display the votes in the cards
const votes = (data) => {
  let ups = data.ups;
  if (ups >= 1000) {
    ups = Math.floor(data.ups / 1000) + "k";
  }
  const vote = document.createElement("div");
  vote.classList.add("votes");
  vote.innerHTML = ` <i class="fa-solid fa-right-long fa-rotate-270" style="color: #cececf;"></i>
<p>${ups}</p>
<i class="fa-solid fa-right-long fa-rotate-90" style="color: #cececf;"></i>`;
  return vote;
};

//display the tools in the card
const tools = () => {
  const tool = document.createElement("div");
  tool.classList.add("tools");
  tool.innerHTML = `<button class="comments" id="comments"><i class="fa-regular fa-message"></i>
    Comments</button>
<button class="share"><i class="fa-solid fa-share"></i> Share</button>
<button class="save"><i class="fa-regular fa-bookmark"></i> Save</button>
<button class="dots"><i class="fa-solid fa-ellipsis"></i></button>`;
  return tool;
};

//to display the video player if available
const videoPlayer = (video) => {
  const videoPlayer = document.createElement("div");
  videoPlayer.classList.add("vid");
  let vid = document.createElement("video");
  vid.controls = true;
  const player = dashjs.MediaPlayer().create();
  player.initialize(vid, `${video}`, false);
  videoPlayer.appendChild(vid);
  return videoPlayer;
};

//to display main content of the cards
const content = (data) => {
  const cont = document.createElement("div");
  cont.classList.add("content");
  const subInfo = document.createElement("div");
  subInfo.classList.add("subInfo");
  let thumbnail=data.thumbnail;
  if(data.thumbnail==("self"||"default")){
    thumbnail="img/sublogo.png";
  }
  subInfo.innerHTML = `<img src="${thumbnail}" alt="reddit">
    <a href="#">${data.subreddit_name_prefixed}</a>
    <p>Posted by <span>u/${data.author}</span>
    </p>`;
  const title = document.createElement("div");
  title.classList.add("title");
  if(data.title.length>200){
    title.innerHTML = `<h5>${data.title.substr(0,200).concat("...")}</h5>`;
  }else{
    title.innerHTML = `<h5>${data.title}</h5>`;
  }
  const datacont = document.createElement("div");
  datacont.classList.add("dataContent");
  datacont.setAttribute("id","dataContent");
  if (data.is_video === true) {
    const video = videoPlayer(data.media.reddit_video.dash_url);
    datacont.appendChild(video);
  }

  if (
    (data.url && data.url.endsWith(".jpg")) ||
    (data.url && data.url.endsWith(".png"))
  ) {
    const img = document.createElement("img");
    img.setAttribute("src", data.url);
    datacont.appendChild(img);
  }

  if (data.selfText != "") {
    const p = document.createElement("h6");
    p.innerText = data.selftext;
    datacont.appendChild(p);
  }

  const tool = tools();
  cont.appendChild(subInfo);
  cont.appendChild(title);
  cont.appendChild(datacont);
  cont.appendChild(tool);

  return cont;
};

const mainpage = document.querySelector(".mainpage");
//Display the card
const showReddit = async (ele) => {
  if (ele.over_18 != true) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("cards");
    
    const vote = votes(ele.data);
    const contents = content(ele.data);

    newDiv.appendChild(vote);
    newDiv.appendChild(contents);
    mainpage.appendChild(newDiv);
  }
};



let arr = [{}, {}, {}, [{}, {}, {}, {}, {}, {}]];

const sortcall = async (id, value, time, def) => {
  try {
    refresh();
    if (id == 3) {
      if (Object.keys(arr[id][def]).length == 0) {
        const res = await axios.get(url + value + `.json?t=${time}&limit=40`);
        arr[id][def] = res.data.data.children;
        console.log("api call");
      }
      return [id, def];
    } else {
      if (Object.keys(arr[id]).length == 0) {
        const res = await axios.get(url + value + `.json?t=${time}&limit=40`);
        arr[id] = res.data.data.children;
        console.log("api call");
        console.log(arr[id]);
      }
      return id;
    }
  } catch (error) {
    console.log(error);
  }
};

//using sort buttons
let filter = document.querySelector("#filter");
let btn = filter.querySelectorAll(".radio");
let drop = filter.querySelector(".dropdown");
let btns = drop.querySelector("button");
let list = drop.querySelectorAll(".dropdown-item");

btn.forEach((ele) => {
  ele.addEventListener("click", () => {
    clearBackground();
    ele.style.backgroundColor = "#d7dadc3d";
    ele.classList.add("clicked");
    let id = ele.id;
    if (id == 3) {
      drop.classList.remove("drop");
      sortcall(3, "top", "all", 0).then((index) => {
        loader.style.display="none";
        arr[index[0]][index[1]].forEach((ele) => {
          showReddit(ele);
        });
      });
    } else {
      drop.classList.add("drop");
      sortcall(id, ele.value).then((index) => {
        loader.style.display="none";
        arr[index].forEach((ele) => {
          showReddit(ele);
        });
      });
    }
  });
});

list.forEach((ele) => {
  ele.addEventListener("click", () => {
    btns.innerText = ele.innerText;
    sortcall(3, "top", ele.value, ele.id).then((index) => {
      loader.style.display="none";
      arr[index[0]][index[1]].forEach((element) => {
        showReddit(element);
      });
    });
  });
});

const clearBackground = () => {
  btn.forEach((ele) => {
    ele.style.backgroundColor = "inherit";
  });
};

//main call
sortcall(0, "best").then((index) => {
  loader.style.display="none";
  arr[index].forEach((ele) => {
    showReddit(ele);
  });
});

/*--------------------------------------------The operations on input funcitons starts from here------------------------------------------*/
let searchArr = [];
const searchFilter = document.querySelector(".sfilter");
const input = document.querySelector("input");
let val = "";
const first=searchFilter.querySelector(".first");
let tempval="";

let notFound=document.querySelector(".notFound");

input.addEventListener("keydown", (event) => {
  if ((event.key === "Enter")&&(input.value.trim()!="")&&(input.value.trim()!=tempval)){
    notFound.style.display="none";
    clearSearchBackground();
    searchArr=[{}, {}, {}, [{}, {}, {}, {}, {}, {}]];
    val = input.value.trim();
    tempval=val;
    searchDropDown.classList.add("drop");
    searchDropDown.classList.add("drop");
    first.style.backgroundColor="#d7dadc3d";
    dropButton.innerText="All Item"

    searchCallFunc(0, val, "best").then((index) => {
      loader.style.display="none";
      checkAndDisplay(searchArr[index]);
    });
    filter.style.display = "none";
    searchFilter.style.display = "flex";
  }
});



const checkAndDisplay=(disArr)=>{
  if(disArr.length==0){
    loader.style.display="none";
    notFound.style.display="flex";
    let info=document.querySelector(".InfoDisc")
    let valFor=document.querySelector(".valFor");
    valFor.innerHTML=val;
    let adj=document.querySelector(".adj");
    adj.addEventListener("click",()=>{
      input.click();
    });
  }else{
    disArr.forEach((ele)=>{
      showReddit(ele);
    })
  }
};

const searchCallFunc = async (id, value, sort, times, seid) => {
  try {
    refresh();
    if (id == 3) {
      if (Object.keys(searchArr[id][seid]).length == 0) {
        const res = await axios.get(
          url + `search.json?q=${value}&sort=${sort}&t=${times}&limit=40`
        );
        console.log("api call");
        searchArr[id][seid] = res.data.data.children;
      }
      return [id, seid];
    } else {
      if (Object.keys(searchArr[id]).length == 0) {
        const res = await axios.get(
          url + `search.json?q=${value}&sort=${sort}&t=${times}&limit=40`
        );
        console.log("api call");
        searchArr[id] = res.data.data.children;
        console.log(searchArr[id]);
      }
      return id;
    }
  } catch (error) {
    console.log(error);
  }
};

const searchDrop = searchFilter.querySelectorAll(".sradio");
let searchDropDown = searchFilter.querySelector(".dropdown");
const topSearchDrop = searchDropDown.querySelectorAll(".dropdown-item");
const dropButton = searchDropDown.querySelector("button");

const clearSearchBackground = () => {
  searchDrop.forEach((ele) => {
    ele.style.backgroundColor = "inherit";
  });
};

topSearchDrop.forEach((ele) => {
  ele.addEventListener("click", () => {
    dropButton.innerText = ele.innerText;
    searchCallFunc(3, val, "top", ele.value, ele.id).then((index) => {
      loader.style.display="none";
      searchArr[index[0]][index[1]].forEach((element) => {
        showReddit(element);
      });
    });
  });
});


searchDrop.forEach((ele) => {
  ele.addEventListener("click", () => {
    clearSearchBackground();
    ele.style.backgroundColor = "#d7dadc3d";
    if (ele.value === "top") {
      searchDropDown.classList.remove("drop");
      searchCallFunc(ele.id, val, "top", ele.value, 0).then((index) => {
        loader.style.display="none";
        searchArr[index[0]][index[1]].forEach((ele) => {
          showReddit(ele);
        });
      });
    } else {
      searchDropDown.classList.add("drop");
      searchCallFunc(ele.id, val, ele.value).then((index) => {
        loader.style.display="none";
        searchArr[index].forEach((ele) => {
          showReddit(ele);
        });
      });
    }
  });
});

//---------------------------------------------------------
// displayInfo();
// displaySubreddit();

// const test=async ()=>{
//     let ur=await axios.get("https://www.reddit.com/r/AskReddit/comments/17jxh7a/what_is_the_smallest_hill_youll_die_on/.json");
//     console.log(ur);
// }