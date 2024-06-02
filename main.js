var listItems = [
  {
    image:
      "https://nupet.vn/wp-content/uploads/2023/10/hinh-nen-ngo-nghinh-anh-meo-cute-nupet-new-5.jpg",
    price: 10,
    name: "test 1",
    id: 1,
  },
  {
    image:
      "https://nupet.vn/wp-content/uploads/2023/10/hinh-nen-ngo-nghinh-anh-meo-cute-nupet-new-5.jpg",
    price: 10,
    name: "test 2",
    id: 2,
  },
  {
    image:
      "https://nupet.vn/wp-content/uploads/2023/10/hinh-nen-ngo-nghinh-anh-meo-cute-nupet-new-5.jpg",
    price: 10,
    name: "test 3",
    id: 3,
  },
  {
    image:
      "https://nupet.vn/wp-content/uploads/2023/10/hinh-nen-ngo-nghinh-anh-meo-cute-nupet-new-5.jpg",
    price: 10,
    name: "test 4",
    id: 4,
  },
];

var detailItem = document.getElementById("detail-item");
var detailItemShow = document.getElementById("detail-item-show");

console.log('detailItem :', detailItem.id)

const renderView = () => {
    const data = listItems.map(item => `
    <div onclick="viewDetail(this.id)" id=${item.id} class="item">
        <img src=${item.image}>
        <div class="flex" style="justify-content: space-between;">
            <p>${item.name}</p>
            <p>${item.price}</p>
        </div>
    </div>
    `).join("")
    const listElement = document.getElementById('list-items');
    listElement.innerHTML = data;
}

const viewDetail = (id) => {
    const item = listItems.find(x => x.id == id);
    const text = `<div class="flex">
                    <img style="width: 300px; height: 200px; object-fit: contain;" src=${item.image}>
                    <div class="flex" style="justify-content: space-between;">
                        <p>${item.name}</p>
                        <p>${item.price}</p>
                    </div>
                </div>
            `;
    detailItemShow.innerHTML = text;
    detailItem.classList.add('show')
}

const clickOnDetail = (event) => {
    if(event.target.id == detailItem.id) {
        detailItem.classList.remove("show");
        detailItem.classList.add("hidden");
        return;
    }
}

renderView()


