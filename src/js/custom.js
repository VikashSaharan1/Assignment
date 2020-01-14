/* Author: Vikash Saharan *?
/* In this file we keep get data from api.myjson.com url, show in listing page, click on sort by etc... */
var adobeEcommerce  = (function(functionName, baseObj) {
        functionName = functionName || "docReady";
        baseObj = baseObj || window;
        var sortByArr;
        var responseJson;
        const srcUrl = 'https://api.myjson.com/bins/qzuzi/';
        removeActiveClass = () => {
            Array.from(sortByArr).forEach((element)  => {
                element.classList.remove('active');
            });
        };
        sortBy = (event, flag) => {
            this.removeActiveClass();
            event.srcElement.classList.add("active");
        };
        caluclateAfterDiscountPrice = (mrp, discount) => {
            return (mrp - Math.round(mrp/100 * discount));
        }; 
        displayItemList = () => {
            let element, Obj, newprice, html = "";
            let objItemContainer = document.getElementsByClassName("items-container")[0];
            for(element in this.responseJson) {
                Obj = this.responseJson[element];
                newprice = this.caluclateAfterDiscountPrice(Number.parseFloat(Obj.price), Number.parseFloat(Obj.discount));
                // Obj.img_url is exiting in data but it's take time to loading

                html = `<div class="item" >
                <div class="image"><img src="assets/image/earphone.jfif"/></div>
                <div class="name">${Obj.name}</div>
                <div class="price"><span class="newprice">${newprice}</span><span class="mrp">${Obj.price}</span><span class="discount-percent">${Obj.discount}% off</span></div>
                <div class="addtocart"><button type="button" class="btn btn-primary btn-addtocart">Add to Cart</button></div>
           </div>`;
                objItemContainer.insertAdjacentHTML("beforeend", html);
            }
            
            document.getElementById("spinner").classList.add("d-none");            
            document.getElementsByTagName("aside")[0].classList.remove("d-none");
            document.getElementsByClassName("content")[0].classList.remove("d-none");

        };
        getJsonFromSRC = (URL) => {
            return new Promise((resolve, reject) => {
                let xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {
                   if ( this.readyState == 4 && this.status == 200 ) {
                        resolve(JSON.parse(this.responseText));
                    }
                };
                xmlhttp.open("GET", URL, true);
                xmlhttp.send();
            });
        };
        init = () => {
            sortByArr = document.getElementsByClassName("sort-by-opt");
            Array.from(sortByArr).forEach((element) => {
                element.addEventListener('click', this.sortBy.bind(this), false);
            });
            this.getJsonFromSRC(srcUrl).then(data => {
                this.responseJson = data;
                this.displayItemList();
            }).catch(error => {
                console.log(error);
            });
        };
        return init;
})("docReady", window);
document.onreadystatechange = function () {
    var state = document.readyState;
    if (state == 'complete') {
        adobeEcommerce();
    }
  };
