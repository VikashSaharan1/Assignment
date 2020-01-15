/* Author: Vikash Saharan *?
/* In this file we keep get data from api.myjson.com url, show in listing page, click on sort by etc... */
var adobeEcommerce  = (function(functionName, baseObj) {
        functionName = functionName || "docReady";
        baseObj = baseObj || window;
        var sortByArr;
        var responseJson;
        this.cart = [];
        const srcUrl = 'https://api.myjson.com/bins/qzuzi/';
        removeActiveClass = () => {
            Array.from(sortByArr).forEach((element)  => {
                element.classList.remove('active');
            });
        };
        sortBy = (event, isClicked) => {
            this.removeActiveClass();
            event.srcElement.classList.add("active");
            if(event.srcElement.id == "hl") {
                this.responseJson = this.sortByHighLow();
            } else  if(event.srcElement.id == "lh") {
                this.responseJson = this.sortByLowHigh();
            } else  if(event.srcElement.id == "dis"){
                this.responseJson = this.sortByDiscount();
            }    
            this.displayItemList();
        };
        sortByHighLow = () => {
            return this.responseJson.sort((a, b) => b.price - a.price);
        };
        sortByLowHigh = () => {
            return this.responseJson.sort((a, b) => a.price - b.price);
        };
        sortByDiscount = () => {
            return this.responseJson.sort((a, b) => b.discount - a.discount);
        };
        caluclateAfterDiscountPrice = (mrp, discount) => {
            return (mrp - Math.round(mrp/100 * discount));
        }; 
        displayItemList = () => {

            let element, Obj, newprice, html = "";
            let objItemContainer = document.getElementsByClassName("items-container")[0];
            objItemContainer.innerHTML = '';
            for(element in this.responseJson) {
                Obj = this.responseJson[element];
                newprice = this.caluclateAfterDiscountPrice(Number.parseFloat(Obj.price), Number.parseFloat(Obj.discount));
                // Obj.img_url is exiting in data but it's take time to loading

                html = `<div class="item" id="${Obj.id}">
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
        addtoCartbtn = (event) => {
            
            let id = event.srcElement.parentNode.parentNode.getAttribute("id");
            let isExistObj = Boolean(this.cart.length && this.cart.filter((a) => { return a.id == id}));
            let Obj = this.responseJson.filter((a) => {return a.id == id; });
            this.cart.push(Obj);
            this.updateNotifyIcon();

        };
        updateNotifyIcon = () => {
            let cartItemsCount = this.cart.length;
            let notifyIcon = document.getElementById("notify-icon");
            if(cartItemsCount > 0) {
                notifyIcon.innerText = cartItemsCount;
                notifyIcon.classList.remove("d-none");
            } else {
                notifyIcon.classList.add("d-none");
            }
        };
        removeCartItem = (event) => {
                event.target.parentElement.remove();
                this.updatreCartTotal
        };
        updatreCartTotal = () => {
                
        };
        init = () => {
            this.updateNotifyIcon();
            sortByArr = document.getElementsByClassName("sort-by-opt");
            //sortByArr.addEventListener('click', this.sortBy.bind(this), false);
            Array.from(sortByArr).forEach((element) => {
                element.addEventListener('click', this.sortBy.bind(this), false);
            });
            
            this.getJsonFromSRC(srcUrl).then(data => {
                this.responseJson = data;
                sortByArr[0].click();
                let Obj = document.getElementsByClassName("btn-addtocart");
                Array.from(Obj).forEach((element) => {
                    element.addEventListener('click', this.addtoCartbtn.bind(element), false);
                });
            }).catch(error => {
                console.log(error);
            });
            /*let removeCartObj = document.getElementsByClassName("btn-removetocart");
            Array.from(removeCartObj).forEach((element) => {
                element.addEventListener("click", this.removeCartItem.bind(this), false);
            });*/ 
        };
        return init;
})("docReady", window);
document.onreadystatechange = function () {
    var state = document.readyState;
    if (state == 'complete') {
        adobeEcommerce();
    }
  };
