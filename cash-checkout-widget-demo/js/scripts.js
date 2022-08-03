let itemCount = 0;
const items = [ 
    buildItem("Death Stranding Director's Cut", 1599, 5, "https://http2.mlstatic.com/D_NQ_NP_2X_679808-MLM47599358721_092021-F.webp"),
    buildItem("Halo Infinite", 1299, 4, "https://m.media-amazon.com/images/I/811QTSH5K6L._AC_SL1500_.jpg"),
    buildItem("Demon's Souls", 1499, 5, "https://external-preview.redd.it/vNUo4qbp4-fumJt82di_mv_H5pl14MOhVhw5qVGFJ5k.jpg?auto=webp&s=42716bdd17c10d9aee650500237238d6e0f56a05"),
    buildItem("Forza Horizon 5", 999, 3, "https://m.media-amazon.com/images/I/71LSwnEXpXL._AC_SL1500_.jpg"),
    buildItem("Ghost of Tsushima Director's Cut", 1499, 5, "https://m.media-amazon.com/images/I/81LmR4liNaL._AC_SL1500_.jpg"),
    buildItem("PlayStation 5", 13499, 4, "https://www.radioshack.com.mx/medias/100100682.jpg-515ftw?context=bWFzdGVyfHJvb3R8MTUwNDAwfGltYWdlL2pwZWd8aGFlL2g4Yy85MDg3NDMwOTgzNzEwLzEwMDEwMDY4Mi5qcGdfNTE1ZnR3fDZjMzhhZmM5OTk4ZTU2YjUxMGJjYmU5NzkyZjE4ZTk3YTRjOTM5NWJjYjM5OTdiYWQxMmIzODdmNTMwNGJhZmU"),
    buildItem("Xbox Series X", 13499, 5, "https://i5.walmartimages.com/asr/cc20b404-8b2c-4787-9670-ad6583e70dc4.c96193c9a37288ff6e6dcd8ee572a4cb.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff"),
    buildItem("Xbox Series S", 8499, 3, "https://www.heb.com.mx/media/catalog/product/cache/9f5ec31302878493d9ed0ac40a398e12/8/4/841448_1.jpg")
];
const selectedItems = new Map();
const HOLACASH_PUBLIC_KEY = "pub_sandbox_mjRUaBKr.ZOpcQYBqKn4m0oTstDRQNpfmSr2CdHF4";
const FORMATTER = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MXN'
  });

function getItems() {
    let itemGrid = "";
    items.forEach((item) => {
        itemGrid += `
            <div class="col p-4 mb-3">
                <div class="card h-100">
                    <!-- Product details-->
                    <div class="card-body p-4">
                        <!-- Product image-->
                        <div class="text-center">
                            <img class="col-md-12 px-0 card-img-top img-fluid" src="`+ item.imageUrl +`" />
                            <!-- Product name-->
                            <h5 id="item-name" class="fw-bolder">`+ item.name +`</h5>
                            <!-- Product reviews-->
                            <div class="d-flex justify-content-center small text-warning mb-2">
                                `+ getProductRate(item.stars) +`
                            </div>
                            <!-- Product price-->
                            <span id="item-price">`+ FORMATTER.format(item.price) +`</span>
                        </div>
                    </div>
                    <!-- Product actions-->
                    <div class="card-footer mb-4 p-0 pt-0 border-top-0 bg-transparent">
                        <div class="text-center"><button id="`+ item.itemId +`" onclick="addToCart(this.id)" type="button" class="btn btn-outline-secondary">Add to cart</button></div>
                    </div>
                </div>
            </div>
        `;
    });
    document.getElementById("items").innerHTML = itemGrid;
}

function getProductRate(stars) {
    let rateSection = "";
    for(let i = 0; i < stars; i++) {
        rateSection += '<div class="bi-star-fill"></div>';
    }
    return rateSection;
}

function addToCart(itemId) {
    let item = items.filter((item) => item.itemId == itemId)[0];
    if(selectedItems.get(item.name) == undefined) {
        selectedItems.set(item.name, [item]);
    } else {
        selectedItems.get(item.name).push(item);
    }
    itemCount += 1;
    document.getElementById("cart-items").textContent = itemCount;
    document.getElementById("toast-text").innerHTML = 'Item ' + item.name + ' successfully added to cart';
    $('.toast').toast('show');
}

function createOrder() {
    if(selectedItems.size == 0) {
        document.getElementById("toast-text").innerHTML = 'Please add some items to your cart before checking out';
        $('.toast').toast('show');
        return;
    }
    let orderDetail = "";
    let orderTotalAmount = 0;
    selectedItems.forEach((details,name) => {
        let itemTotalAmount = details[0].price*details.length;
        orderTotalAmount += itemTotalAmount;
        orderDetail += `
            <div class="card shadow-0 border mb-0">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <img src="`+ details[0].imageUrl +`" class="img-fluid"
                                alt="Phone">
                        </div>
                        <div class="col-md-3 text-center d-flex justify-content-center align-items-center">
                            <p class="text-muted mb-0">`+ name +`</p>
                        </div>
                        <div class="col-md-3 text-center d-flex justify-content-center align-items-center">
                            <p class="text-muted mb-0 small">Qty: `+ details.length +`</p>
                        </div>
                        <div class="col-md-3 text-center d-flex justify-content-center align-items-center">
                            <p class="text-muted mb-0 small">$`+ FORMATTER.format(details[0].price) +`</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    orderDetail += `
        <div class="card-footer border-0 px-4 py-0" style="background-color: #007bff; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <span class="d-flex align-items-center justify-content-end text-white mb-0">Total: <span class="mb-0 ms-2">`+ FORMATTER.format(orderTotalAmount) +`</span></span>
        </div>
    `
    document.getElementById("modal-body").innerHTML = orderDetail;
    $('#cartModal').modal('show');
    placeOrder(selectedItems);
}

const placeOrder = async (items) => {
    document
    .getElementById("customButtonTriggerWidgetOpen")
    .disabled = true;
    try {
        let orderTotalAmount = 0;
        let purchases = [];
        items.forEach((details, name) => {
            let itemTotalAmount = details[0].price*details.length*100;
            orderTotalAmount += itemTotalAmount;
            purchases.push({
                description: name,
                quantity: details.length,
                unit_amount: {
                    amount: details[0].price*100,
                    currency_code: "MXN"
                },
                item_total_amount: {
                    amount: itemTotalAmount,
                    currency_code: "MXN"
                }
            });
        });
        const response = await axios.post(
            "https://sandbox.api.holacash.mx/v2/order",
            {
              order_total_amount: {
                amount: orderTotalAmount,
                currency_code: "MXN",
              },
              description: "My videogame store",
              purchases: purchases
            },
            {
              headers: {
                "X-Api-Client-Key": HOLACASH_PUBLIC_KEY,
                "Content-Type": "application/json",
              },
            }
        );

        if (response?.data?.order_information?.order_id) {
            document
                .getElementById("customButtonTriggerWidgetOpen")
                .disabled = false;
            let orderId = response?.data?.order_information?.order_id;
            console.log("ORDER ID:", orderId);
        }

        const callbacks = {
            //onSuccess happens when a charge is created correctly.
            onSuccess: (res) => {
                console.log("Success response", JSON.parse(res));
                closeModal();
                selectedItems.clear();
                document.getElementById("cart-items").textContent = selectedItems.size;
            },

            //onAbort happens when the users intentionally close the widget
            onAbort: () => {
              
            },
    
            // on Error happens when the holacash service cannot succesfully generate a charge correctly at that moment
            onError: (err) => console.log(JSON.stringify(err)),
    
            // onEmailEntered is called when the user completes entering an email
            onEmailEntered: (email) => console.log(email),
    
            // onCheckoutStart is called when the checkout page is presented
            onCheckoutStart: () => console.log("checkout started"),
    
            // We will use the check callback to determine if Cash Pay should proceed.
            // This must return a boolean
            check: () => {
                return true;
            },
        };

        // Initializing widget with order information
        // eslint-disable-next-line no-undef
        HolaCashCheckout.configure(
            {
                order_id: response?.data?.order_information?.order_id,
                hints: {
                    first_name: "John",
                    last_name: "Doe",
                    second_last_name: "Doe",
                    email: "john.doe@gmail.com",
                    phone: "13212312412",
                }
            },
            callbacks
        );
    } catch (e) {
        console.log("Request to create order has failed", e);
    }
};

function openWidget() {
    closeModal();
    HolaCashCheckout.initiateCheckout();
  }

function closeModal() {
    $('#cartModal').modal('hide');
}

function buildItem(name, price, stars, imageUrl) {
    return {
        itemId: generateQuickGuid(),
        name: name,
        price: price,
        stars: stars,
        imageUrl: imageUrl
    };
}

function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}