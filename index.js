import { menuArray } from "./data.js"

const menu = document.getElementById("menu")
const orderSection = document.getElementById("order-section")
const orderBtn = document.getElementById("order-btn")

let currentOrder = []

document.addEventListener("click", function(e){
    if(e.target.dataset.additem){
        modifyOrder(e.target.dataset.additem, 1)
    } else if (e.target.dataset.reduce) {
        modifyOrder(e.target.dataset.reduce, -1)
    } else if (e.target.dataset.increase) {
        modifyOrder(e.target.dataset.increase, 1)
    } else if (e.target.dataset.modify) {
        const btnEl = document.getElementById("btn-" + e.target.dataset.modify)
        if (!btnEl.style.display || btnEl.style.display == "none"){
            btnEl.style.display = "flex"
        }
        else {
            btnEl.style.display = "none"
        }
    } else if (e.target.dataset.order) {
        renderPaymentForm()
    } else if (e.target.dataset.pay) {
        localStorage.setItem('hasOrdered', 'true')
    }
})

function modifyOrder(itemId, amount){
    let productAlreadyInOrder = false
        
    currentOrder.forEach(function(currentOrderItem){
        if (currentOrderItem.id == itemId){
            productAlreadyInOrder = true
            if (amount > 0) {
                currentOrderItem.quantity += amount
            } else if ( amount < 0) {
                if ( currentOrderItem.quantity + amount < 0) {
                    currentOrderItem.quantity = 0   
                } else {
                    currentOrderItem.quantity += amount
                }
            } 
        } 
    })
    if (!productAlreadyInOrder){
        currentOrder.push({id: parseInt(itemId), quantity: amount})
    }
    
    currentOrder = currentOrder.filter(function(currentOrderItem){
        return currentOrderItem.quantity
    })
    
    renderOrder()
}

function getMenuHtml() {
    let menuHtml = `<div class="overlay" id="overlay">
                        <div class="payment-form">
                            <p class="form-title">Enter card details</p>
                            <form class="payment-input" id="payment-form">
                                <input type="text" class="form-input" placeholder="Enter your name" required>
                                <input type="text" class="form-input" placeholder="Enter your card number" required>
                                <input type="text" class="form-input" placeholder="Enter CVV" required>
                                <button type="sumbit" class="order-btn pay-btn" data-pay="true">Pay now</button>
                            </form>
                        </div>
                    </div>`
    menuArray.forEach(function(menuItem){
        
        let ingredients = ""
        menuItem.ingredients.forEach(function(ingredient, i){
            ingredients += ingredient
            if (i != menuItem.ingredients.length - 1){
                ingredients += ", "   
            }
        })
        
        menuHtml += `<div class="menu-item" id="${menuItem.id}">
                        <div class="menu-item-content">
                            <img class="menu-item-img" src="${menuItem.image}">
                            <div class="menu-item-text-btn">
                                <div class="menu-item-text">
                                    <p class="title-text">${menuItem.name}</p>
                                    <p class="menu-item-ingredients">${ingredients}</p>
                                    <p class="price-text">\$${menuItem.price}</p>
                                </div>
                                <div>
                                    <img class="temp-plus" src="https://cdn-icons-png.flaticon.com/512/107/107075.png" data-additem="${menuItem.id}">
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>`
    })
    return menuHtml
}

function getOrderHtml(){
    let orderHtml = ""
    if (!currentOrder.length){
        orderHtml = ""
    } else if (currentOrder.length){
        orderHtml = `<p class="order-title title-text"> Your order </p>
                            <div class="order-list">`
        let totalPrice = 0
        
        currentOrder.forEach(function(currentOrderItem){
            const menuItem = menuArray.filter(function(item){
                return currentOrderItem.id == item.id
            })[0]
            
            totalPrice += currentOrderItem.quantity * menuItem.price

            orderHtml += `     <div class="order-product">
                                    <div class="order-product-left">
                                        <div class="quantity-btn" data-modify="${currentOrderItem.id}">
                                            <p class="quantity"  data-modify="${currentOrderItem.id}">${currentOrderItem.quantity}</p>
                                            <img class ="dropdown-arrow" src="https://static.thenounproject.com/png/551749-200.png"  data-modify="${currentOrderItem.id}">
                                        </div>
                                        <div class="quantity-btns" id="btn-${currentOrderItem.id}">
                                            <button class="quantity-modify" data-reduce="${currentOrderItem.id}">-</button>
                                            <p class="vertical-divider">|</p>
                                            <button class="quantity-modify" data-increase="${currentOrderItem.id}">+</button>
                                        </div>
                                        <div class="title-text">
                                            <p>${menuItem.name}</p>
                                        </div>
                                    </div>
                                    <div class="order-product-right">
                                        <p class="price-text">\$${menuItem.price * currentOrderItem.quantity}</p>
                                    </div>
                                </div>
                            </div>`
        })
        
        orderHtml += `      <hr>
                            <div class="order-product">
                                <div class="order-product-left">
                                    <div class="title-text">
                                        <p>Total</p>
                                    </div>
                                </div>
                                <div class="order-product-right">
                                    <p class="price-text">\$${totalPrice}</p>
                                </div>
                            </div>
                            <button class="order-btn" id="order-btn" data-order="true">
                                COMPLETE ORDER
                            </button>`
    }
    
    return orderHtml
}

function render(){
    menu.innerHTML = getMenuHtml()
    renderOrder()
    localStorage.clear()
}

function renderOrder(){
    if (localStorage.getItem("hasOrdered")) {
        orderSection.innerHTML = `<p class="success">Thanks, James! Your order is on its way!</p>`
        window.scrollTo(0, document.body.scrollHeight);
    } else {
        orderSection.innerHTML = getOrderHtml()   
    }
}

function renderPaymentForm(){
    document.getElementById("overlay").style.display = "block"
}

render()