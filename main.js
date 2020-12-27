let commentsData = [
  // {
  //     id: "1",
  //     parId: "0",
  //     text: "comment 1"
  // }
];
let graph = {};
let myData = {};

function dfsPlot(u, par) {
  if (u != "0") {
    let htmldata = `<br/>
                        <div class="card" style="">
                            <img class="card-img-top">
                            <div class="card-body" id="${u}">
                                <p class="card-text">${myData[u]}</p>
                                <button class="btn btn-primary btn-sm replybtn" data-u="${u}">Reply</button>
                                <button class="btn btn-danger btn-sm deletebtn float-right" data-u="${u}" data-par="${par}">X</button>
                                <br/>
                                <form class="form" id="form${u}" data-u="${u}" style="display: none">
                                    <div class="form-group">
                                        <input type="text" class="form-control" id="input${u}" placeholder="Add reply" style="margin-top: 10px">
                                    </div>
                                </form>

                            </div>
                        </div>`;
    let parId = "#" + par;
    $(parId).append(htmldata);
  }

  graph[u] &&
    graph[u].forEach((v) => {
      if (v !== par) {
        dfsPlot(v, u);
      }
    });
}

function dfsDelete(u, par) {
  graph[u] &&
    graph[u].forEach((v) => {
      if (v != par) {
        dfsDelete(v, u);
      }
    });

  // remove node
  for (var i = 0; i < commentsData.length; i++) {
    if (commentsData[i].id == u) {
      commentsData.splice(i, 1);
      break;
    }
  }
}

function init() {
  graph = {};
  myData = {};

  document.getElementById("0").innerHTML = "";

  commentsData.forEach((element, index) => {
    graph[element.id] = [];
    graph[element.parId] = [];
    myData[element.id] = element.text;
  });

  commentsData.forEach((element, index) => {
    graph[element.id].push(element.parId);
    graph[element.parId].push(element.id);
  });

  console.log(graph);
  let node = "0",
    par = null;
  dfsPlot(node, par);

  document.querySelectorAll(".replybtn").forEach((item) => {
    item.addEventListener("click", (e) => {
      let id = item.getAttribute("data-u");
      let formId = "#form" + id;
      let form = document.querySelector(formId);
      if (form.style.display == "none") {
        form.style.display = "block";
      } else {
        form.style.display = "none";
      }
    });
  });

  document.querySelectorAll(".form").forEach((item) => {
    item.addEventListener("submit", (e) => {
      e.preventDefault();
      let id = item.getAttribute("data-u");
      let inpId = "#input" + id;
      let text = document.querySelector(inpId).value;
      if (!text.trim()) return;

      let newData = {
        id: new Date().getTime().toString(),
        parId: id,
        text: text,
      };

      commentsData.push(newData);

      init();
    });
  });

  document.querySelectorAll(".deletebtn").forEach((item) => {
    item.addEventListener("click", (e) => {
      let id = item.getAttribute("data-u");
      let par = item.getAttribute("data-par");
      dfsDelete(id, par);
      init();
    });
  });
}

document.querySelector("#form0").addEventListener("submit", (e) => {
  e.preventDefault();
  let text = document.querySelector("#input0").value;
  if (!text.trim()) return;

  let newData = {
    id: new Date().getTime().toString(),
    parId: "0",
    text: text,
  };

  commentsData.push(newData);

  init();
  document.querySelector("#input0").value = "";
});

init();
