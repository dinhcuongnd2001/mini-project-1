var baseUrl = "http://10.63.161.172:300/api"
var size = 9; // pagesize
var totalProducts = 100; 
var currentPage = 2;
var body = {
  page: currentPage,
  data: {
    type: "service",
    name: "",
  }
}


var timer;
var listItems = [
    {
      image:
        "https://nupet.vn/wp-content/uploads/2023/10/hinh-nen-ngo-nghinh-anh-meo-cute-nupet-new-5.jpg",
      price: 10000000,
      name: "Dinh Nhu Cuong",
      id: 1,
      type:"service"
    },
    {
      image:
        "https://nupet.vn/wp-content/uploads/2023/10/hinh-nen-ngo-nghinh-anh-meo-cute-nupet-new-5.jpg",
      price: 10000000,
      name: "Le Hai Ha",
      id: 2,
      type:"facility"
    },
    {
      image:
        "https://nupet.vn/wp-content/uploads/2023/10/hinh-nen-ngo-nghinh-anh-meo-cute-nupet-new-5.jpg",
      price: 10000000,
      name: "Nguyen Hoang Anh",
      id: 3,
      type:"service"
    },
  ];

var cartItems = [];
/*
  {
    productId: number;
    productName: string;
    quanlity : number;
    price: number;
  }
*/
var currentListItem = [];

 
var listElement = document.getElementById("list-items");
var inputSearch = document.getElementById("search");
var detailContainer = document.getElementById("detail-container");
var detailItem = document.getElementById("detail-item");
var btnService = document.getElementById("btn-service")
var btnFacility = document.getElementById("btn-facilities")
var cart = document.getElementById("cart")
var cartDetailContainer = document.getElementById("cart-detail-container")
var cartDetail = document.getElementById("cart-detail")
var cartEmpty = document.getElementById("cart-empty");
var tableBody = document.getElementById("table-body")
var quantity = document.getElementById("quantity")
var sectionTotal = document.getElementById("section-total");
var totalPrice = document.getElementById('total-price')

var pagination = document.getElementById("pagination")
var paginationRender = document.getElementById("pagination-render")






  /*
    body: {
      data: {
        type: string;
        name: string;
      },
      page: number;
    }
  */

const callApi = async (url, body) => {
    const response = await fetch(`${baseUrl}/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
    return (await response.json()).data;
    const {items, totals} = (await response.json()).data;
}

const renderListProduct = async (body) => {
    // const {items, totals} = callApi("", {size, ...data})

    console.log('body :', body)
    const items = [...listItems, ...listItems, ...listItems].filter(x => x.type === body.data.type && x.name.includes(body.data.name));
    currentListItem = items;
    const data = items.map(item => `
        <div onclick="viewDetail(this.id)" id="${item.id}" class="item">
            <img style="cursor: pointer" src="${item.image}" alt="">
            <div class="flex" style="justify-content: space-between;">
                <p>${item.name}</p>
                <p>${formatCurrency(item.price)}</p>
            </div>
        </div>`).join("")
    listElement.innerHTML = data;


    // render pagination
    if(!totalProducts) {
      pagination.classList.add("hidden")
      pagination.classList.remove("show")
    } else {
      pagination.classList.add("show")
      pagination.classList.remove("hidden")

      const totalPage = Math.ceil(totalProducts / size)

      const textPaginationData = [...Array(totalPage).keys()].map(e => `
        <span onclick="handleClickPaginationItem(${e})" class="item-pagination ${e == currentPage ? "item-pagination-active" : ""}">
          ${e + 1}
        </span>
      `).join("")
      
      paginationRender.innerHTML = textPaginationData;
    }
}

const renderCartItems = async () => {
  if(!cartItems.length) {
    cartDetail.classList.add('hidden');
    cartDetail.classList.remove('show');
    cartEmpty.classList.remove('hidden');
    cartEmpty.classList.add('show');
    quantity.innerHTML = "";
    return;
  }
  cartDetail.classList.remove('hidden');
  cartDetail.classList.add('show');
  cartEmpty.classList.add('hidden');
  cartEmpty.classList.remove('show');


  quantity.innerHTML = cartItems.reduce((res, curr) => res += curr.quanlity, 0);
  const total =  cartItems.reduce((res, curr) => res += curr.price * curr.quanlity, 0);
  const textData = cartItems.map(item => `<tr key=${item.productId}>
                              <th scope="row">
                                  ${item.name}
                              </th>
                              <td>
                                  ${item.quanlity}
                              </td>
                              <td>
                                  ${formatCurrency(item.quanlity * item.price)}
                              </td>
                              <td style="text-align: center;">
                                  <i onclick={handleRemoveItem(${item.productId})} style="cursor: pointer" class="fa-solid fa-trash"></i>
                              </td>
                          </tr>`).join("")
  
  tableBody.innerHTML = textData;
  if(total) {
    sectionTotal.classList.remove('hidden')
    totalPrice.innerHTML = `Total: ${formatCurrency(total)}`;
  } else {
    sectionTotal.classList.add('hidden')
  }

}

inputSearch.addEventListener('input', function (event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      body.data.name = event.target.value;
      renderListProduct(body)
    }, 500);
})

const viewDetail = (id) => {
    const item = listItems.find(x => x.id == id);
    const text = ` <img src=${item.image}>
                    <div class="flex" style="flex: 1; flex-direction: column;">
                      <div style="width: 100%; text-align: right">
                        <span onclick="closeShowDetail()" style="cursor: pointer; padding:10px">X</span>
                      </div> 

                      <div style="display: flex; width:100%; flex: 1;flex-direction: column; justify-content: flex-start; align-items: flex-start">
                        <p>Name :${item.name}</p>
                        <p>Description: ${item.price}</p>
                        <p>Price: ${formatCurrency(item.price)}</p>
                      </div>
                      <div style="width: 100%; text-align: right">
                        <button class="btn" onclick="handleAddToCart(${id})">Add to cart</button>
                      </div>

                    </div>
            `;
    detailItem.innerHTML = text;
    detailContainer.classList.add('show-flex')
}

const clickOnDetail = (event) => {
    if(event.target.id == detailContainer.id) {
        detailContainer.classList.remove("show-flex");
        detailContainer.classList.add("hidden");
      return;
    }
}

const closeShowDetail = () => {
  detailContainer.classList.remove("show-flex");
  detailContainer.classList.add("hidden");
}

const handleAddToCart = (productId) => {
  const index = cartItems.findIndex(item => item.productId == productId);
    if(index != -1) {
      cartItems[index].quanlity += 1;
    } else {
      const product = currentListItem.find(item => item.id == productId);
      cartItems.push({productId, quanlity: 1, name: product.name, price: product.price})
    }
    
    renderCartItems()  
}

const handleClickBtnType = (type) => {
  if(body.data.type == type) return;
  body.data.type = type;
  if(type == "service") {
    btnService.classList.add('active')
    btnFacility.classList.remove("active")
  } else {
    btnFacility.classList.add('active')
    btnService.classList.remove("active")
  }
  renderListProduct(body)
}

const showCart = () => {
  if(cartDetailContainer.classList.contains("show")) {
    cartDetailContainer.classList.remove("show");
    cartDetailContainer.classList.add("hidden")
  } else {
    cartDetailContainer.classList.add("show");
    cartDetailContainer.classList.remove("hidden")
  }
}


const handleClickCartDetailContainer = (event) => {
  if(event.target.id == cartDetailContainer.id) {
    cartDetailContainer.classList.remove("show");
    cartDetailContainer.classList.add("hidden");
    return;
  }
}

const handleRemoveItem = (productId) => {
  cartItems = cartItems.filter(item => item.productId != productId);
  renderCartItems();
}

const submitCart = () => {
  // call api submit
}

const handleClickPaginationItem = (pageSelected) => {
  currentPage = pageSelected;
  body = {...body, page: currentPage}
  renderListProduct(body)
}

const handlePrePage = () => {
  if(currentPage == 0) return;
  handleClickPaginationItem(currentPage - 1)
}

const handleNextPage = () => {
  if(currentPage == Math.ceil(totalProducts / size)) return;
  handleClickPaginationItem(currentPage + 1)
}


const formatCurrency = (val) => {
  return val.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}

// initial
renderListProduct(body);
renderCartItems()