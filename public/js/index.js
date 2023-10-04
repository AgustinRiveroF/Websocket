const socket = io();
const form = document.getElementById('productForm');
const inputPrice = document.getElementById('productPrice');
const priceP = document.getElementById('priceP');
const productList = document.getElementById('realTimeProductsList');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const price = inputPrice.value;
    socket.emit('newPrice', price);
});

socket.on('priceUpdate', (price) => {
    priceP.innerHTML = price;
});

socket.on('newProduct', (product) => {
    const newProductItem = document.createElement('li');
    newProductItem.innerHTML = `
        ${product.title} - ${product.description} - $${product.price}
        <button onclick="deleteProduct(${product.id})">Eliminar</button>`;
    productList.appendChild(newProductItem);
});

function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
}

socket.on('productDeleted', (productId) => {
    const itemToDelete = productList.querySelector(`li[data-product-id="${productId}"]`);
    if (itemToDelete) {
        productList.removeChild(itemToDelete);
    }
});

socket.on('productsUpdate', (products) => {
    productList.innerHTML = '';
    products.forEach((product) => {
        const productItem = document.createElement('li');
        productItem.innerHTML = `
            ${product.title} - ${product.description} - $${product.price}
            <button onclick="deleteProduct(${product.id})">Eliminar</button>`;
            
        productList.appendChild(productItem);
    });
});

socket.on('productDeleted', (productId) => {
    const itemToDelete = productList.querySelector(`li[data-product-id="${productId}"]`);
    if (itemToDelete) {
        productList.removeChild(itemToDelete);
    }
});

socket.on('createProductError', (errorMessage) => {
    console.error(errorMessage);
});
